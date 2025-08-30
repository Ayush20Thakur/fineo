import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

def cashflow_forecast(series: pd.Series, days=60):
    s = pd.Series(series).copy()
    if not isinstance(s.index, pd.DatetimeIndex):
        s.index = pd.to_datetime(s.index, errors="coerce")
    s = s.dropna()
    if s.empty:
        return [0.0]*days, [0.0]*days, [0.0]*days

    daily = s.resample("D").sum().asfreq("D").fillna(0.0)

    if len(daily) < 10:
        mu = float(daily.mean())
        sigma = float(daily.std(ddof=0) or 1.0)
        mean = [mu]*days
        lo = [mu - 1.28*sigma]*days
        hi = [mu + 1.28*sigma]*days
        return mean, lo, hi

    try:
        model = ARIMA(daily, order=(1,0,1))
        fit = model.fit()
        pred = fit.get_forecast(steps=days)
        mean = pred.predicted_mean
        mean = mean.tolist() if hasattr(mean, "tolist") else list(mean)

        ci = pred.conf_int(alpha=0.2)
        if hasattr(ci, "to_numpy"):
            arr = ci.to_numpy()
            lo = arr[:,0].tolist(); hi = arr[:,1].tolist()
        else:
            lo = ci[:,0].tolist(); hi = ci[:,1].tolist()
        return mean, lo, hi
    except Exception:
        mu = float(daily.mean())
        sigma = float(daily.std(ddof=0) or 1.0)
        mean = [mu]*days
        lo = [mu - 1.28*sigma]*days
        hi = [mu + 1.28*sigma]*days
        return mean, lo, hi
