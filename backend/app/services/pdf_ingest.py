import io, re, pdfplumber
from datetime import datetime

DATE_RX = re.compile(r"(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})")

def _fmt_date(s:str) -> str:
    s=s.replace(".","/").replace("-","/").strip()
    for fmt in ("%d/%m/%Y","%d/%m/%y","%m/%d/%Y","%Y/%m/%d"):
        try: 
            return datetime.strptime(s,fmt).strftime("%Y-%m-%d")
        except: 
            pass
    return s

def _clean_money(x):
    if x is None: return 0.0
    x = str(x).replace(",","").strip()
    if x in ("","-"): return 0.0
    try: return float(x)
    except: return 0.0

def parse_passbook_pdf(content: bytes):
    rows=[]
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables() or []
            for tbl in tables:
                if len(tbl) < 2: 
                    continue
                header = [str(h or "").lower() for h in tbl[0]]
                for r in tbl[1:]:
                    cells = [str(c or "").strip() for c in r]
                    rec = {header[i] if i < len(header) else f"c{i}": cells[i] for i in range(len(cells))}
                    date = rec.get("date") or rec.get("txn date") or rec.get("value date") or ""
                    desc = rec.get("description") or rec.get("narration") or rec.get("particulars") or ""
                    ref  = rec.get("ref") or rec.get("cheque no") or rec.get("chq no") or rec.get("utr no") or ""
                    debit = rec.get("debit") or rec.get("withdrawal") or rec.get("dr") or ""
                    credit= rec.get("credit") or rec.get("deposit") or rec.get("cr") or ""
                    bal   = rec.get("balance") or rec.get("closing balance") or ""
                    if not DATE_RX.search(str(date)) and any(cells):
                        m = DATE_RX.search(" ".join(cells))
                        date = m.group(1) if m else ""
                    if date:
                        rows.append({
                            "date": _fmt_date(date),
                            "description": desc or "NA",
                            "ref": ref or "",
                            "debit": _clean_money(debit),
                            "credit": _clean_money(credit),
                            "balance": _clean_money(bal),
                            "category": ""
                        })
    return rows
