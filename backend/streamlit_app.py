import streamlit as st
import pandas as pd
import numpy as np
from io import BytesIO

from app.services.pdf_ingest import parse_passbook_pdf
from app.services.portfolio import summarize
from app.services.scoring import fairscore_v0
from app.services.fairness import statistical_parity, equal_opportunity, threshold_shift
from app.services.forecast import cashflow_forecast
from app.services.ledgers import private_append
from app.services.granite import advise, granite_ready

st.set_page_config(page_title="FairPredict Backend Demo", layout="wide")
st.title("FairPredict — Ingest → Insights → Forecast → FairScore → Audit → Granite")

# Granite readiness
if granite_ready():
    st.sidebar.success("Granite: READY ✅")
else:
    st.sidebar.warning("Granite: missing or invalid credentials (.env)")

with st.expander("1) Upload passbook (PDF)", expanded=True):
    up = st.file_uploader("Upload a passbook PDF", type=["pdf"])
    if up is not None:
        rows = parse_passbook_pdf(up.read())
        if not rows:
            st.error("No rows parsed. Try another PDF.")
        else:
            st.success(f"Parsed {len(rows)} transactions")
            df = pd.DataFrame(rows)
            st.dataframe(df.head(20), use_container_width=True)
            st.session_state["tx_df"] = df

df = st.session_state.get("tx_df")
if df is not None and not df.empty:
    st.subheader("2) Dashboard Summary")
    summary = summarize(df.to_dict("records"))
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Balance (last seen)", f"₹{summary['balance']:,.0f}")
    c2.metric("Inflow", f"₹{summary['inflow']:,.0f}")
    c3.metric("Outflow", f"₹{summary['outflow']:,.0f}")
    c4.metric("Savings Rate", f"{summary['savings_rate']*100:.1f}%")

    st.write("**Category Allocation**")
    alloc_df = pd.DataFrame(summary["allocation"])
    if not alloc_df.empty:
        st.bar_chart(alloc_df.set_index("category")["amount"])

    st.write("**Daily Cashflow**")
    cash_df = pd.DataFrame(summary["cashflow"])
    if not cash_df.empty:
        st.line_chart(cash_df.set_index("date")["amount"])

    st.subheader("3) Cashflow Forecast (60 days)")
    if not cash_df.empty:
        series = cash_df.set_index("date")["amount"]
        mean, lo, hi = cashflow_forecast(series, days=60)
        fc_df = pd.DataFrame({"mean": mean, "lower": lo, "upper": hi})
        st.area_chart(fc_df[["lower","upper"]])
        st.line_chart(fc_df["mean"])
    else:
        st.info("Need cashflow history to forecast.")

    # Auto feature extraction (simple heuristics)
    def extract_features_from_df(df: pd.DataFrame) -> dict:
        if df.empty:
            return {"pay_hist":0.7,"utilization":0.4,"savings_rate":0.2,"cashflow_var":0.3,"history_len":0.3,"sip_regularity":0.5,"mandate_punctual":0.7,"threshold_k":650}
        dfx = df.copy()
        dfx["date"] = pd.to_datetime(dfx["date"], errors="coerce")
        dfx = dfx.dropna(subset=["date"])
        if "category" not in dfx.columns:
            dfx["category"] = ""
        inflow  = float(dfx["credit"].sum())
        outflow = float(dfx["debit"].sum())
        savings_rate = 0.0 if inflow <= 0 else max(min((inflow - outflow) / max(inflow, 1e-6), 1.0), 0.0)
        dfx["month"] = dfx["date"].dt.to_period("M").astype(str)
        monthly_in = dfx.groupby("month")["credit"].sum()
        patt = ("emi","loan","card","creditcard","repay")
        dfx["is_loanish"] = dfx["description"].str.lower().str.contains("|".join(patt))
        loanish_by_m = dfx[dfx["is_loanish"]].groupby("month")["debit"].sum().reindex(monthly_in.index, fill_value=0)
        util_series = np.where(monthly_in.values > 0, loanish_by_m.values / np.maximum(monthly_in.values, 1e-6), 0.0)
        utilization = float(np.clip(np.nan_to_num(util_series, nan=0.0).mean(), 0.0, 1.0))
        daily_net = dfx.groupby(dfx["date"].dt.date).apply(lambda g: g["credit"].sum() - g["debit"].sum())
        if len(daily_net) >= 5:
            cf_std = float(np.std(daily_net.values))
            cf_mean_abs = float(np.mean(np.abs(daily_net.values))) or 1.0
            cashflow_var = float(np.clip(cf_std / (cf_mean_abs * 5), 0.0, 1.0))
        else:
            cashflow_var = 0.3
        months_span = max(1, len(sorted(dfx["month"].unique())))
        history_len = float(np.clip(months_span / 24.0, 0.0, 1.0))
        sip_mask = dfx["description"].str.lower().str.contains("sip|mutual fund|mf|systematic")
        sip_months = dfx[sip_mask]["month"].nunique()
        total_months = max(1, dfx["month"].nunique())
        sip_regularity = float(np.clip(sip_months / total_months, 0.0, 1.0))
        penalty_mask = dfx["description"].str.lower().str.contains("reversal|penalty|charge|bounce|return")
        penalty_hits = int(penalty_mask.sum())
        mandate_punctual = float(np.clip(0.9 - 0.05 * penalty_hits, 0.0, 1.0))
        threshold_k = 650
        return {
            "pay_hist": round(0.85 + 0.1 * (savings_rate - 0.2), 2) if inflow > 0 else 0.7,
            "utilization": round(utilization, 2),
            "savings_rate": round(savings_rate, 2),
            "cashflow_var": round(cashflow_var, 2),
            "history_len": round(history_len, 2),
            "sip_regularity": round(sip_regularity, 2),
            "mandate_punctual": round(mandate_punctual, 2),
            "threshold_k": threshold_k
        }

    st.subheader("4) FairScore (explainable, gender-agnostic)")
    auto_feats = extract_features_from_df(df)
    st.markdown(
        f"**Detected parameters from your financial statement** "
        f"(you can still tweak sliders):  \n"
        f"- pay_hist: **{auto_feats['pay_hist']}**  \n"
        f"- utilization: **{auto_feats['utilization']}**  \n"
        f"- savings_rate: **{auto_feats['savings_rate']}**  \n"
        f"- cashflow_var: **{auto_feats['cashflow_var']}**  \n"
        f"- history_len: **{auto_feats['history_len']}**  \n"
        f"- sip_regularity: **{auto_feats['sip_regularity']}**  \n"
        f"- mandate_punctual: **{auto_feats['mandate_punctual']}**"
    )

    pay_hist = st.slider("On-time payment history (0..1)", 0.0, 1.0, float(auto_feats["pay_hist"]), 0.01)
    utilization = st.slider("Utilization / DTI (0..1, higher = worse, will invert)", 0.0, 1.0, float(auto_feats["utilization"]), 0.01)
    savings_rate = st.slider("Savings rate (0..1)", 0.0, 1.0, float(auto_feats["savings_rate"]), 0.01)
    cashflow_var = st.slider("Cashflow variability (0..1, higher = worse, will invert)", 0.0, 1.0, float(auto_feats["cashflow_var"]), 0.01)
    history_len = st.slider("History length (0..1)", 0.0, 1.0, float(auto_feats["history_len"]), 0.01)
    sip_regularity = st.slider("SIP regularity (0..1)", 0.0, 1.0, float(auto_feats["sip_regularity"]), 0.01)
    mandate_punctual = st.slider("Mandate punctuality (0..1)", 0.0, 1.0, float(auto_feats["mandate_punctual"]), 0.01)
    threshold_k = st.slider("Decision threshold k", 580, 720, auto_feats["threshold_k"], 1)

    if st.button("Compute FairScore"):
        features = dict(
            pay_hist=pay_hist, utilization=utilization, savings_rate=savings_rate,
            cashflow_var=cashflow_var, history_len=history_len,
            sip_regularity=sip_regularity, mandate_punctual=mandate_punctual,
            threshold_k=threshold_k
        )
        score, contrib, ver = fairscore_v0(features)
        st.success(f"FairScore = {score:.1f} (v{ver})")
        st.dataframe(pd.DataFrame(contrib))

    st.subheader("5) Fairness Audit (SPD/EO)")
    # create synthetic two cohorts around detected score
    sc_tmp, _, _ = fairscore_v0(auto_feats)
    rng = np.random.default_rng(42)
    default_f = [int(x) for x in (sc_tmp + rng.normal(5, 12, size=5)).round(0)]
    default_m = [int(x) for x in (sc_tmp + rng.normal(-5, 12, size=5)).round(0)]
    cols = st.columns(2)
    with cols[0]:
        scores_f = st.text_area("Female scores JSON array", str(default_f))
    with cols[1]:
        scores_m = st.text_area("Male scores JSON array", str(default_m))
    k = st.slider("Threshold k for approval", 580, 720, threshold_k, 1)
    delta = st.slider("Tolerance δ", 0.00, 0.20, 0.05, 0.01)
    if st.button("Run Audit"):
        try:
            sf = pd.read_json(BytesIO(scores_f.encode()), typ='series').tolist() if scores_f.strip().startswith("[") else []
            sm = pd.read_json(BytesIO(scores_m.encode()), typ='series').tolist() if scores_m.strip().startswith("[") else []
        except Exception:
            sf = eval(scores_f); sm = eval(scores_m)
        spd = statistical_parity(sf, sm, k)
        eo  = equal_opportunity([1]*len(sf), sf, [1]*len(sm), sm, k)
        newk = threshold_shift(spd, eo, k, delta)
        st.write(f"SPD = {spd:.3f}, EO = {eo:.3f}, Recommended k = {newk}")
        payload = {"version":"0.1","k":k,"spd":round(spd,4),"eo":round(eo,4),"delta":delta,"recommended_k":newk,"passed": abs(spd)<=delta and abs(eo)<=delta}
        if st.button("Publish audit to private ledger (local file)"):
            bh, ph = private_append(payload)
            st.write("Private block hash:", bh)
            st.write("Payload hash:", ph)

    st.subheader("6) Advisor (IBM Granite)")
    q = st.text_input("Ask a question", "How can I raise my savings rate to 20%?")
    if st.button("Ask Granite"):
        ctx = {"kpis":{"savings_rate":summary.get("savings_rate",0.2)}, "hints":["focus on EMI, SIP regularity, utilization"]}
        ans = advise(q, ctx)
        st.json(ans)
else:
    st.info("Upload a passbook PDF to begin.")
