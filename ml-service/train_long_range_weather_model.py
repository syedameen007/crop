import pickle

import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


DATASET_FILE = "long_range_weather_india.csv"
MODEL_FILE = "long_range_weather_model.pkl"

TARGETS = [
    "Temperature_Avg (°C)",
    "Humidity (%)",
    "Rainfall (mm)",
    "Wind_Speed (km/h)",
    "Pressure (hPa)",
    "Cloud_Cover (%)",
]

NUMERIC_FEATURES = [
    "month",
    "day",
    "day_of_year",
    "month_sin",
    "month_cos",
    "day_of_year_sin",
    "day_of_year_cos",
]

CATEGORICAL_FEATURES = ["City", "State"]


def add_date_features(df):
    df = df.copy()
    dates = pd.to_datetime(df["Date"])
    df["month"] = dates.dt.month
    df["day"] = dates.dt.day
    df["day_of_year"] = dates.dt.dayofyear
    df["month_sin"] = np.sin(2 * np.pi * df["month"] / 12)
    df["month_cos"] = np.cos(2 * np.pi * df["month"] / 12)
    df["day_of_year_sin"] = np.sin(2 * np.pi * df["day_of_year"] / 366)
    df["day_of_year_cos"] = np.cos(2 * np.pi * df["day_of_year"] / 366)
    return df


df = pd.read_csv(DATASET_FILE)
df = add_date_features(df)

print("\nLong-Range Weather Dataset Loaded Successfully")
print(df.head())
print("\nRows:", len(df))
print("Cities:", ", ".join(sorted(df["City"].unique())))

X = df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
y = df[TARGETS]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
)

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
            "regressor",
            RandomForestRegressor(
                n_estimators=250,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1,
            ),
        ),
    ]
)

model.fit(X_train, y_train)

print("\nLong-Range Weather Model Training Completed")

y_pred = model.predict(X_test)

for index, target in enumerate(TARGETS):
    mae = mean_absolute_error(y_test.iloc[:, index], y_pred[:, index])
    r2 = r2_score(y_test.iloc[:, index], y_pred[:, index])
    print(f"{target}: MAE={mae:.2f}, R2={r2:.3f}")

with open(MODEL_FILE, "wb") as file:
    pickle.dump(
        {
            "model": model,
            "numeric_features": NUMERIC_FEATURES,
            "categorical_features": CATEGORICAL_FEATURES,
            "targets": TARGETS,
            "cities": sorted(df["City"].unique()),
            "states_by_city": df.groupby("City")["State"].first().to_dict(),
        },
        file,
    )

print(f"\nLong-range weather model saved as {MODEL_FILE}")
