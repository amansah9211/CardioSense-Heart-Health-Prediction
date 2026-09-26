from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Heart Disease Prediction API",
    description="Machine Learning API for Heart Disease Prediction",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("../model/heart_disease_model.pkl")
scaler = joblib.load("../model/scaler.pkl")


class HeartDiseaseInput(BaseModel):

    age: float
    sex: int
    chest_pain: int
    resting_bp: float
    cholesterol: float
    fasting_blood_sugar: int
    resting_ecg: int
    max_heart_rate: float
    exercise_angina: int
    oldpeak: float
    slope: int
    ca: float
    Thal: float


class PredictionResponse(BaseModel):

    result: str
    disease_probability: float


@app.get("/")
def home():
    return {
        "message": "Heart Disease Prediction API is running"
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(data: HeartDiseaseInput):

    input_data = pd.DataFrame([{
        "age": data.age,
        "sex": data.sex,
        "chest_pain": data.chest_pain,
        "resting_bp": data.resting_bp,
        "cholesterol": data.cholesterol,
        "fasting_blood_sugar": data.fasting_blood_sugar,
        "resting_ecg": data.resting_ecg,
        "max_heart_rate": data.max_heart_rate,
        "exercise_angina": data.exercise_angina,
        "oldpeak": data.oldpeak,
        "slope": data.slope,
        "ca": data.ca,
        "Thal": data.Thal
    }])

    input_scaled = scaler.transform(input_data)

    prediction = model.predict(input_scaled)[0]

    probabilities = model.predict_proba(input_scaled)[0]

    probability = probabilities[1]

    if prediction == 1:
        result = "Heart Disease Detected"
    else:
        result = "No Heart Disease Detected"

    return PredictionResponse(
        result=result,
        disease_probability=round(float(probability) * 100, 2)
    )