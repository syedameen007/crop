import pickle

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


DATASET_FILE = "weather_classification_data.csv"
MODEL_FILE = "weather_model.pkl"
TARGET = "Weather Type"

NUMERIC_FEATURES = [
    "Temperature",
    "Humidity",
    "Wind Speed",
    "Precipitation (%)",
    "Atmospheric Pressure",
    "UV Index",
    "Visibility (km)",
]

CATEGORICAL_FEATURES = [
    "Cloud Cover",
    "Season",
    "Location",
]


df = pd.read_csv(DATASET_FILE)

print("\nWeather Dataset Loaded Successfully")
print(df.head())

X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))

preprocessor = ColumnTransformer(
    transformers=[
        ("numeric", "passthrough", NUMERIC_FEATURES),
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            CATEGORICAL_FEATURES,
        ),
    ]
)

model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            RandomForestClassifier(
                n_estimators=150,
                random_state=42,
                class_weight="balanced",
            ),
        ),
    ]
)

model.fit(X_train, y_train)

print("\nWeather Model Training Completed")

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

sample = X_test.iloc[[0]]
prediction = model.predict(sample)[0]
probabilities = model.predict_proba(sample)[0]
classes = model.classes_

print("\nSample Weather Prediction:", prediction)

print("\nWeather Probabilities:")
for label, probability in zip(classes, probabilities):
    print(f"{label}: {probability * 100:.2f}%")

with open(MODEL_FILE, "wb") as file:
    pickle.dump(
        {
            "model": model,
            "numeric_features": NUMERIC_FEATURES,
            "categorical_features": CATEGORICAL_FEATURES,
        },
        file,
    )

print(f"\nWeather model saved as {MODEL_FILE}")
