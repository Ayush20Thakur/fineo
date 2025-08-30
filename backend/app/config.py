import os
from dotenv import load_dotenv
load_dotenv()

IBM_CLOUD_API_KEY = os.getenv("IBM_CLOUD_API_KEY","")
IBM_PROJECT_ID    = os.getenv("IBM_PROJECT_ID","")
IBM_REGION        = os.getenv("IBM_REGION","https://eu-de.ml.cloud.ibm.com")
GRANITE_MODEL_ID  = os.getenv("GRANITE_MODEL_ID","ibm/granite-3-8b-instruct")

PRIVATE_LEDGER_SALT = os.getenv("PRIVATE_LEDGER_SALT","changeme")
PRIVATE_LEDGER_ENC_KEY = os.getenv("PRIVATE_LEDGER_ENC_KEY","")
