import json
from ..config import IBM_CLOUD_API_KEY, IBM_PROJECT_ID, IBM_REGION, GRANITE_MODEL_ID

PREFERRED_MODELS = [
    "ibm/granite-3-8b-instruct",
    "ibm/granite-13b-instruct-v2",
    "ibm/granite-3-2b-instruct"
]

def granite_ready() -> bool:
    return bool(IBM_CLOUD_API_KEY and IBM_PROJECT_ID and IBM_REGION)

def _get_model(model_id: str):
    from ibm_watsonx_ai import Credentials
    from ibm_watsonx_ai.foundation_models import Model
    base = IBM_REGION if IBM_REGION.startswith("http") else f"https://{IBM_REGION}"
    creds = Credentials(api_key=IBM_CLOUD_API_KEY, url=base)
    return Model(model_id=model_id, credentials=creds, project_id=IBM_PROJECT_ID, params={"decoding_method":"greedy","max_new_tokens":256,"temperature":0.25})

def _auto_pick_supported():
    try:
        from ibm_watsonx_ai import Credentials
        from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
        base = IBM_REGION if IBM_REGION.startswith("http") else f"https://{IBM_REGION}"
        creds = Credentials(api_key=IBM_CLOUD_API_KEY, url=base)
        models = list(ModelTypes.list_models(creds))
        # choose first preferred available
        for m in PREFERRED_MODELS:
            if m in models:
                return m
        # else any ibm/granite model
        for m in models:
            if isinstance(m, str) and m.startswith("ibm/granite"):
                return m
        # fallback to first model
        return models[0] if models else None
    except Exception:
        return None

def advise(question: str, context: dict):
    if not granite_ready():
        return {"answer":"Granite credentials missing. Set IBM_CLOUD_API_KEY, IBM_PROJECT_ID, IBM_REGION in .env.","actions":[],"route":"/insights"}
    try:
        # try configured model
        try:
            model = _get_model(GRANITE_MODEL_ID)
            out = model.generate(f"""You are a financial copilot. Use this context JSON:
{json.dumps(context)}
Question: {question}
Return JSON with keys: answer, actions, route.""")
        except Exception as e:
            # if unsupported, auto-pick a supported model and retry
            picked = _auto_pick_supported()
            if not picked:
                return {"answer": f"Granite error: {e}", "actions": [], "route": "/insights"}
            model = _get_model(picked)
            out = model.generate(f"""You are a financial copilot. Use this context JSON:
{json.dumps(context)}
Question: {question}
Return JSON with keys: answer, actions, route.""")

        text = out.get("results",[{}])[0].get("generated_text","{}")
        try:
            return json.loads(text)
        except Exception:
            return {"answer": text, "actions": [], "route": "/insights"}
    except Exception as e:
        return {"answer": f"Granite error: {e}", "actions": [], "route": "/insights"}
