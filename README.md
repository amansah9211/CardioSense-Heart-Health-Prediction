# CardioSense — Heart Disease Prediction

CardioSense is a machine learning-based heart health assessment application that predicts the likelihood of heart disease from commonly used cardiovascular health parameters.

The project uses a trained Support Vector Machine (SVM) model with StandardScaler preprocessing and provides predictions through a FastAPI backend with a web-based frontend.

---

## Features

- Heart disease prediction using machine learning
- SVM classification model
- StandardScaler preprocessing
- FastAPI REST API
- HTML, CSS and JavaScript frontend
- Disease probability score
- Interactive assessment form
- Responsive healthcare-focused interface
- Swagger API documentation

---

## Tech Stack

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- Support Vector Machine (SVM)
- StandardScaler
- Joblib

### Backend
- FastAPI
- Pydantic
- Uvicorn

### Frontend
- HTML
- CSS
- JavaScript

---

## Project Structure

```text
Disease_Prediction/
│
├── dataset/
│
├── model/
│   ├── heart_disease_model.pkl
│   └── scaler.pkl
│
├── notebook/
│   └── heart_disease.ipynb
│
├── Backend/
│   └── main.py
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── requirements.txt
└── README.md