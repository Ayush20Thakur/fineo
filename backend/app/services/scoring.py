def fairscore_v0(features: dict, version: str = "0.1"):
    f = dict(features)
    f["utilization"]  = 1.0 - min(max(f.get("utilization",0.0),0),1)
    f["cashflow_var"] = 1.0 - min(max(f.get("cashflow_var",0.0),0),1)

    w = {
      "pay_hist": 0.30, "utilization": 0.20, "savings_rate": 0.15,
      "cashflow_var": 0.10, "history_len": 0.10, "sip_regularity": 0.10,
      "mandate_punctual": 0.05
    }
    raw = sum(w[k]*float(f.get(k,0.0)) for k in w)
    z = max(min(raw, 0.8), 0.0)
    score = 300 + (z/0.8)*600
    contrib = [{"name":k,"weight":w[k],"value":float(f.get(k,0.0))} for k in w]
    return round(score,1), contrib, version
