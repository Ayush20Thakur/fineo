import os, json
from cryptography.fernet import Fernet
from ..config import PRIVATE_LEDGER_ENC_KEY, PRIVATE_LEDGER_SALT
from ..utils import canonical, sha256_hex

PRIVATE_CHAIN_FILE = os.path.join(os.getcwd(), "private_chain.jsonl")

def private_append(payload: dict):
    os.makedirs(os.path.dirname(PRIVATE_CHAIN_FILE), exist_ok=True) if os.path.dirname(PRIVATE_CHAIN_FILE) else None
    js = canonical(payload)
    payload_hash = "0x"+sha256_hex(js)
    cipher = js
    if PRIVATE_LEDGER_ENC_KEY:
        f = Fernet(PRIVATE_LEDGER_ENC_KEY.encode() if isinstance(PRIVATE_LEDGER_ENC_KEY,str) else PRIVATE_LEDGER_ENC_KEY)
        cipher = f.encrypt(js.encode()).decode()
    prev_hash = "0x"+"0"*64
    if os.path.exists(PRIVATE_CHAIN_FILE):
        with open(PRIVATE_CHAIN_FILE, "rb") as f:
            try:
                last = json.loads(f.readlines()[-1])
                prev_hash = last.get("block_hash", prev_hash)
            except:
                pass
    block_hash = "0x"+sha256_hex(prev_hash + cipher + PRIVATE_LEDGER_SALT)
    rec = {"prev_hash": prev_hash, "payload_cipher": cipher, "payload_hash": payload_hash, "block_hash": block_hash}
    with open(PRIVATE_CHAIN_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(rec) + "\n")
    return block_hash, payload_hash
