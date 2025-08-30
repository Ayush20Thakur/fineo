import json, hashlib
def canonical(obj)->str:
    return json.dumps(obj, sort_keys=True, separators=(",",":"))
def sha256_hex(s:str)->str:
    return hashlib.sha256(s.encode()).hexdigest()
