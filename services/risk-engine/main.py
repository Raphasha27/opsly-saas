from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

app = FastAPI(title="Opsly Risk & Anomaly Engine", version="1.0.0")

class OperationalData(BaseModel):
    user_id: str
    action_count: int
    error_rate: float
    login_frequency: int
    data_transfer_kb: float

# Initialize Anomaly Detection Model (Pre-trained concept)
# In production, this would be loaded from a joblib file
clf = IsolationForest(contamination=0.1, random_state=42)

@app.post("/analyze-risk")
async def analyze_risk(data: OperationalData):
    """
    Kirov Dynamics Risk Scoring Logic.
    Calculates a risk score based on operational metrics.
    """
    # Simple heuristic + ML hybrid
    base_score = (data.error_rate * 50) + (data.action_count / 100)
    
    # ML Anomaly Check
    features = np.array([[data.action_count, data.error_rate, data.login_frequency, data.data_transfer_kb]])
    # Mock prediction for demo (IsolationForest returns -1 for anomalies)
    is_anomaly = clf.fit_predict(features)[0] == -1
    
    risk_score = base_score + (25 if is_anomaly else 0)
    
    return {
        "user_id": data.user_id,
        "risk_score": min(round(risk_score, 2), 100),
        "is_anomaly": bool(is_anomaly),
        "status": "CRITICAL" if risk_score > 75 else "STABLE",
        "engine": "Kirov Risk v1.0"
    }

@app.get("/health")
async def health():
    return {"status": "green", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
