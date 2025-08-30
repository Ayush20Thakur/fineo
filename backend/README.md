# FairPredict Backend (Streamlit + IBM Granite)

## Setup (Windows / VS Code)
```
cd <unzipped-folder>
python -m venv .venv
.venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
streamlit run streamlit_app.py
```
Granite is pre-configured in `.env` with region=https://eu-de.ml.cloud.ibm.com and model=ibm/granite-3-8b-instruct.
