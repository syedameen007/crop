import pandas as pd
import numpy as np
import pickle

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# -------------------------------
# 1. LOAD DATASET
# -------------------------------
df = pd.read_csv("Crop_recommendation.csv")

print("\nDataset Loaded Successfully")
print(df.head())

# -------------------------------
# 2. SPLIT FEATURES & LABEL
# -------------------------------
X = df.drop("label", axis=1)   # input features
y = df["label"]                # target

# -------------------------------
# 3. TRAIN-TEST SPLIT
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))

# -------------------------------
# 4. CREATE MODEL
# -------------------------------
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

# -------------------------------
# 5. TRAIN MODEL
# -------------------------------
model.fit(X_train, y_train)

print("\nModel Training Completed")

# -------------------------------
# 6. TEST MODEL
# -------------------------------
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# -------------------------------
# 7. TEST SAMPLE PREDICTION
# -------------------------------
sample = X_test.iloc[0].values.reshape(1, -1)

prediction = model.predict(sample)[0]
probabilities = model.predict_proba(sample)[0]

print("\nSample Prediction:", prediction)

# -------------------------------
# 8. TOP 3 PREDICTIONS
# -------------------------------
classes = model.classes_
top_indices = np.argsort(probabilities)[-3:][::-1]

print("\nTop 3 Recommendations:")
for i in top_indices:
    print(f"{classes[i]} → {probabilities[i]*100:.2f}%")

# -------------------------------
# 9. SAVE MODEL
# -------------------------------
pickle.dump(model, open("model.pkl", "wb"))

print("\nModel saved as model.pkl")
