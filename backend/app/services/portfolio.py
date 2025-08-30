from collections import defaultdict

def auto_category(description:str) -> str:
    desc = (description or "").lower()
    if "salary" in desc or "payroll" in desc: return "salary"
    if "emi" in desc or "loan" in desc: return "loan_emi"
    if "rent" in desc: return "rent"
    if "sip" in desc or "mf" in desc or "mutual fund" in desc: return "invest_sip"
    if "upi" in desc or "gpay" in desc or "phonepe" in desc: return "upi"
    if "atm" in desc or "cash" in desc: return "cash"
    if "bill" in desc or "broadband" in desc or "electric" in desc or "water" in desc: return "utilities"
    if "swiggy" in desc or "zomato" in desc or "cafe" in desc: return "food"
    if "uber" in desc or "ola" in desc or "irctc" in desc or "air" in desc: return "travel"
    return "other"

def summarize(transactions):
    cf = defaultdict(float)
    alloc = defaultdict(float)
    bal = 0.0
    for t in transactions:
        cat = t.get("category") or auto_category(t.get("description",""))
        t["category"] = cat
        cf[t["date"]] += t.get("credit",0.0) - t.get("debit",0.0)
        alloc[cat] += abs(t.get("debit",0.0))
        bal = t.get("balance", bal)
    cashflow = [{"date": d, "amount": a} for d,a in sorted(cf.items())]
    total_spend = sum(alloc.values()) or 1.0
    allocation = [{"category":k, "amount":v, "pct": round(100*v/total_spend,1)} for k,v in sorted(alloc.items(), key=lambda x:-x[1])]
    inflow  = sum(t.get("credit",0.0) for t in transactions)
    outflow = sum(t.get("debit",0.0) for t in transactions)
    savings_rate = round(max(inflow - outflow, 0)/max(inflow,1e-6), 3)
    return {"balance": bal, "inflow": inflow, "outflow": outflow, "savings_rate": savings_rate, "cashflow": cashflow, "allocation": allocation}
