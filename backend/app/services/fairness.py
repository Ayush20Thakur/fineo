import numpy as np

def statistical_parity(scores_f, scores_m, k: int = 650) -> float:
    sf = np.array(scores_f, dtype=float)
    sm = np.array(scores_m, dtype=float)
    p_f = (sf >= k).mean() if sf.size else 0.0
    p_m = (sm >= k).mean() if sm.size else 0.0
    return float(p_f - p_m)

def equal_opportunity(y_true_f, scores_f, y_true_m, scores_m, k: int = 650) -> float:
    y_f = np.array(y_true_f, dtype=int)
    s_f = np.array(scores_f, dtype=float)
    y_m = np.array(y_true_m, dtype=int)
    s_m = np.array(scores_m, dtype=float)
    def tpr(y, s):
        pos = (y == 1)
        denom = max(1, pos.sum())
        return float(((s >= k) & pos).sum() / denom)
    return tpr(y_f, s_f) - tpr(y_m, s_m)

def threshold_shift(spd: float, eo: float, k: int, delta: float = 0.05) -> int:
    if abs(spd) > delta or abs(eo) > delta:
        return max(580, min(720, k + (-30 if spd < 0 else 30)))
    return k
