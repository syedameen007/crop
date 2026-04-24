import os
import tempfile
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Any

from bson import ObjectId
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import DESCENDING, MongoClient

import prediction_service


try:
    import mongomock
except ImportError:
    mongomock = None


BASE_DIR = Path(__file__).resolve().parent
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DB = os.getenv("MONGODB_DB", "crop_service")
MONGODB_COLLECTION = os.getenv("MONGODB_COLLECTION", "predictions")

app = FastAPI(title="Crop Prediction API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionPayload(BaseModel):
    user_id: str | None = Field(default=None, description="Optional user identifier")
    user_name: str | None = None
    manual_mode: str = "auto"
    soil_type: str | None = None
    is_clayey: str | None = None
    soil_moisture: str | None = None
    irrigation_regular: str | None = None
    previous_crop: str | None = None
    irrigation_mm: float | None = None
    planting_date: str | None = None
    auto_weather: bool = True
    weather_provider: str = "auto"
    weather_mode: str = "forecast"
    forecast_days: int = 5
    weather_api_key: str | None = None
    city: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    location_type: str = "inland"
    season: str | None = None
    uv_index: float | None = None
    compare_crop: str | None = None
    temperature: float | None = None
    humidity: float | None = None
    rainfall: float | None = None


@lru_cache(maxsize=1)
def get_mongo_client():
    if MONGODB_URI.startswith("mongomock://"):
        if mongomock is None:
            raise RuntimeError("mongomock is not installed.")
        return mongomock.MongoClient()
    return MongoClient(MONGODB_URI)


def get_collection():
    client = get_mongo_client()
    collection = client[MONGODB_DB][MONGODB_COLLECTION]
    collection.create_index([("created_at", DESCENDING)])
    collection.create_index([("user_id", DESCENDING), ("created_at", DESCENDING)])
    return collection


def serialize_document(document: dict[str, Any]) -> dict[str, Any]:
    if not document:
        return document

    serialized = dict(document)
    serialized["id"] = str(serialized.pop("_id"))
    return serialized


def store_prediction(
    payload: dict[str, Any],
    prediction_result: dict[str, Any],
    soil_card_meta: dict[str, Any] | None = None,
) -> dict[str, Any]:
    document = {
        "user_id": payload.get("user_id"),
        "user_name": payload.get("user_name"),
        "request": payload,
        "soil_card": soil_card_meta,
        "prediction": prediction_result,
        "created_at": datetime.now(timezone.utc),
    }
    collection = get_collection()
    result = collection.insert_one(document)
    document["_id"] = result.inserted_id
    return serialize_document(document)


def create_temp_soil_card(upload: UploadFile) -> tuple[str, dict[str, Any]]:
    suffix = Path(upload.filename or "soil-card.bin").suffix or ".bin"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir=BASE_DIR) as handle:
        handle.write(upload.file.read())
        temp_path = handle.name
    metadata = {
        "filename": upload.filename,
        "content_type": upload.content_type,
        "saved_path": temp_path,
    }
    return temp_path, metadata


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predictions")
def create_prediction(payload: PredictionPayload):
    try:
        prediction_result = prediction_service.run_prediction(payload.model_dump())
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    document = store_prediction(payload.model_dump(), prediction_result)
    return document


@app.post("/predictions/soil-card")
def create_prediction_with_soil_card(
    user_id: str | None = Form(default=None),
    user_name: str | None = Form(default=None),
    manual_mode: str = Form(default="auto"),
    soil_type: str | None = Form(default=None),
    is_clayey: str | None = Form(default=None),
    soil_moisture: str | None = Form(default=None),
    irrigation_regular: str | None = Form(default=None),
    previous_crop: str | None = Form(default=None),
    irrigation_mm: float | None = Form(default=None),
    planting_date: str | None = Form(default=None),
    auto_weather: bool = Form(default=True),
    weather_provider: str = Form(default="auto"),
    weather_mode: str = Form(default="forecast"),
    forecast_days: int = Form(default=5),
    weather_api_key: str | None = Form(default=None),
    city: str | None = Form(default=None),
    latitude: float | None = Form(default=None),
    longitude: float | None = Form(default=None),
    location_type: str = Form(default="inland"),
    season: str | None = Form(default=None),
    uv_index: float | None = Form(default=None),
    compare_crop: str | None = Form(default=None),
    soil_card: UploadFile = File(...),
):
    payload = {
        "user_id": user_id,
        "user_name": user_name,
        "manual_mode": manual_mode,
        "soil_type": soil_type,
        "is_clayey": is_clayey,
        "soil_moisture": soil_moisture,
        "irrigation_regular": irrigation_regular,
        "previous_crop": previous_crop,
        "irrigation_mm": irrigation_mm,
        "planting_date": planting_date,
        "auto_weather": auto_weather,
        "weather_provider": weather_provider,
        "weather_mode": weather_mode,
        "forecast_days": forecast_days,
        "weather_api_key": weather_api_key,
        "city": city,
        "latitude": latitude,
        "longitude": longitude,
        "location_type": location_type,
        "season": season,
        "uv_index": uv_index,
        "compare_crop": compare_crop,
    }
    temp_path = None
    soil_card_meta = None
    try:
        temp_path, soil_card_meta = create_temp_soil_card(soil_card)
        prediction_result = prediction_service.run_prediction(payload, soil_card_path=temp_path)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    finally:
        prediction_service.cleanup_soil_card(temp_path)

    document = store_prediction(payload, prediction_result, soil_card_meta=soil_card_meta)
    return document


@app.get("/predictions")
def list_predictions(user_id: str | None = None, limit: int = 20):
    query = {"user_id": user_id} if user_id else {}
    collection = get_collection()
    documents = collection.find(query).sort("created_at", DESCENDING).limit(limit)
    return [serialize_document(document) for document in documents]


@app.get("/predictions/{prediction_id}")
def get_prediction(prediction_id: str):
    collection = get_collection()
    try:
        document = collection.find_one({"_id": ObjectId(prediction_id)})
    except Exception as error:
        raise HTTPException(status_code=400, detail="Invalid prediction id.") from error

    if not document:
        raise HTTPException(status_code=404, detail="Prediction not found.")

    return serialize_document(document)
