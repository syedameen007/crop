from argparse import Namespace
from datetime import timedelta
import io
from pathlib import Path
from typing import Any
from contextlib import redirect_stdout

import numpy as np
import pandas as pd

import test_model


def build_args(payload: dict[str, Any], soil_card_path: str | None = None) -> Namespace:
    data = dict(payload)
    if soil_card_path:
        data["soil_card"] = soil_card_path

    defaults = {
        "N": None,
        "P": None,
        "K": None,
        "temperature": None,
        "humidity": None,
        "ph": None,
        "rainfall": None,
        "soil_card": None,
        "manual_mode": "auto",
        "soil_type": None,
        "is_clayey": "no",
        "soil_moisture": "normal",
        "irrigation_regular": "yes",
        "previous_crop": "none",
        "irrigation_mm": None,
        "planting_date": test_model.date.today().isoformat(),
        "auto_weather": True,
        "weather_provider": "auto",
        "weather_mode": "forecast",
        "forecast_days": 5,
        "weather_api_key": None,
        "city": None,
        "latitude": None,
        "longitude": None,
        "location_type": "inland",
        "season": None,
        "uv_index": None,
        "compare_crop": None,
    }
    defaults.update(data)
    return Namespace(**defaults)


def to_builtin(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: to_builtin(item) for key, item in value.items()}
    if isinstance(value, list):
        return [to_builtin(item) for item in value]
    if isinstance(value, tuple):
        return [to_builtin(item) for item in value]
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, pd.DataFrame):
        return value.to_dict(orient="records")
    return value


def build_input_values(values: list[float]) -> dict[str, float]:
    return {
        feature: float(value)
        for feature, value in zip(test_model.FEATURES, values)
    }


def build_recommendation_analysis(
    prediction: str,
    top_predictions: list[tuple[str, float]],
    input_values: dict[str, float],
    compare_crop: str | None,
) -> dict[str, Any]:
    crop_profiles = test_model.load_crop_profiles()
    prediction_fit = test_model.evaluate_crop_fit(prediction, input_values, crop_profiles)
    comparison = []

    for crop, probability in top_predictions:
        if crop == prediction:
            continue
        fit = test_model.evaluate_crop_fit(crop, input_values, crop_profiles)
        comparison.append(
            {
                "crop": crop,
                "probability": round(float(probability), 2),
                "reasons": [
                    test_model.concern_reason(item, crop)
                    for item in fit["concerns"][:2]
                ],
            }
        )

    compared_crop = test_model.find_crop_name(compare_crop, crop_profiles)
    explicit_compare = None
    if compared_crop and compared_crop != prediction:
        fit = test_model.evaluate_crop_fit(compared_crop, input_values, crop_profiles)
        explicit_compare = {
            "crop": compared_crop,
            "probability": round(
                float(dict(top_predictions).get(compared_crop, 0)),
                2,
            ),
            "reasons": [
                test_model.concern_reason(item, compared_crop)
                for item in fit["concerns"][:2]
            ],
        }

    return {
        "recommended_crop": prediction,
        "top_predictions": [
            {"crop": crop, "probability": round(float(probability), 2)}
            for crop, probability in top_predictions
        ],
        "strengths": [
            test_model.match_reason(item)
            for item in prediction_fit["matches"][:4]
        ],
        "watchouts": [
            test_model.concern_reason(item, prediction)
            for item in prediction_fit["concerns"][:2]
        ],
        "alternatives": comparison[:2],
        "compared_crop": explicit_compare,
    }


def build_model_outputs(
    prediction: str,
    top_predictions: list[tuple[str, float]],
    weather_prediction: str | None,
    weather_top_predictions: list[tuple[str, float]],
    weather: dict[str, Any] | None,
) -> dict[str, Any]:
    return {
        "crop_model": {
            "model_file": "model.pkl",
            "recommended_crop": prediction,
            "top_predictions": [
                {"crop": crop, "probability": round(float(probability), 2)}
                for crop, probability in top_predictions
            ],
        },
        "weather_type_model": {
            "model_file": "weather_model.pkl",
            "predicted_weather_type": weather_prediction,
            "top_predictions": [
                {"label": label, "probability": round(float(probability), 2)}
                for label, probability in weather_top_predictions
            ],
        },
        "long_range_weather_model": {
            "model_file": "long_range_weather_model.pkl",
            "used": bool(weather and weather.get("source") == "Kaggle historical-pattern long-range weather model"),
            "source": None if weather is None else weather.get("source"),
        },
    }


def build_irrigation_summary(crop: str, weather: dict[str, Any], args: Namespace) -> dict[str, Any]:
    minimum, upper = test_model.irrigation_thresholds(crop, args)
    rainfall = float(weather.get("rainfall", 0))
    irrigation = args.irrigation_mm
    available = rainfall + (irrigation or 0)

    if irrigation is None:
        if rainfall < minimum:
            status = "needs_irrigation"
            advice = (
                f"Add about {minimum - rainfall:.1f} mm during the planting window."
            )
        elif rainfall > upper:
            status = "too_wet"
            advice = "Do not add irrigation now; focus on drainage."
        else:
            status = "adequate"
            advice = "Forecast rainfall looks adequate; irrigate only if soil dries."
    else:
        if available < minimum:
            status = "not_enough"
            advice = f"Add about {minimum - available:.1f} mm more."
        elif available > upper:
            status = "too_much"
            advice = "Irrigation may be too much; avoid extra watering and check drainage."
        else:
            status = "proper"
            advice = "Irrigation looks proper for the planting window."

    return {
        "status": status,
        "advice": advice,
        "forecast_rainfall_mm": round(rainfall, 2),
        "irrigation_mm": None if irrigation is None else round(float(irrigation), 2),
        "total_water_mm": round(available, 2),
        "recommended_min_mm": round(float(minimum), 2),
        "recommended_max_mm": round(float(upper), 2),
    }


def build_harvest_summary(crop: str, args: Namespace) -> dict[str, Any]:
    planting_date = test_model.get_planting_date(args)
    days = test_model.CROP_HARVEST_DAYS.get(crop)
    if not days:
        return {
            "planting_date": planting_date.isoformat(),
            "duration_days": None,
            "harvest_start": None,
            "harvest_end": None,
        }

    harvest_start = planting_date + timedelta(days=days[0])
    harvest_end = planting_date + timedelta(days=days[1])
    return {
        "planting_date": planting_date.isoformat(),
        "duration_days": int(round((days[0] + days[1]) / 2)),
        "harvest_start": harvest_start.isoformat(),
        "harvest_end": harvest_end.isoformat(),
    }


def build_duration_outlook(crop: str, location: dict[str, Any] | None, args: Namespace) -> dict[str, Any] | None:
    if location is None:
        return None

    outlook = test_model.get_crop_duration_weather_outlook(crop, location, args)
    if not outlook:
        return None

    crop_profiles = test_model.load_crop_profiles()
    crop_profile = crop_profiles.get(crop)
    fit_summary = None
    if crop_profile:
        fit_input = {
            "N": crop_profile["N"]["mean"],
            "P": crop_profile["P"]["mean"],
            "K": crop_profile["K"]["mean"],
            "temperature": outlook["temperature"],
            "humidity": outlook["humidity"],
            "ph": crop_profile["ph"]["mean"],
            "rainfall": outlook["daily_rainfall_average"],
        }
        fit = test_model.evaluate_crop_fit(crop, fit_input, crop_profiles)
        fit_summary = {
            "strengths": [test_model.match_reason(item) for item in fit["matches"][:3]],
            "watchouts": [test_model.concern_reason(item, crop) for item in fit["concerns"][:2]],
        }

    return {
        "summary": to_builtin(outlook),
        "fit": fit_summary,
    }


def run_prediction(payload: dict[str, Any], soil_card_path: str | None = None) -> dict[str, Any]:
    args = build_args(payload, soil_card_path=soil_card_path)
    location = None
    weather = None

    if args.auto_weather:
        location = test_model.get_location(args)
        with redirect_stdout(io.StringIO()):
            soil_values = test_model.get_soil_values_from_user(args, location)
        weather = test_model.get_weather(location, args)
        weather_prediction, weather_top_predictions, weather_sample = test_model.predict_weather_type(
            weather,
            location,
            args,
        )
        values = [
            soil_values["N"],
            soil_values["P"],
            soil_values["K"],
            weather["temperature"],
            weather["humidity"],
            soil_values["ph"],
            weather["rainfall"],
        ]
    else:
        with redirect_stdout(io.StringIO()):
            soil_values = test_model.get_soil_values_from_user(args)
        weather_prediction = None
        weather_top_predictions = []
        weather_sample = None
        values = [
            soil_values["N"],
            soil_values["P"],
            soil_values["K"],
            float(args.temperature),
            float(args.humidity),
            soil_values["ph"],
            float(args.rainfall),
        ]

    model = test_model.load_model()
    sample = pd.DataFrame([values], columns=test_model.FEATURES)
    prediction = model.predict(sample)[0]
    probabilities = model.predict_proba(sample)[0]
    classes = model.classes_
    top_indices = np.argsort(probabilities)[-3:][::-1]
    top_predictions = [
        (classes[index], probabilities[index] * 100)
        for index in top_indices
    ]
    input_values = build_input_values(values)

    result = {
        "model_outputs": build_model_outputs(
            prediction,
            top_predictions,
            weather_prediction,
            weather_top_predictions,
            weather,
        ),
        "location": to_builtin(location),
        "resolved_inputs": {
            "soil": to_builtin(soil_values),
            "model_features": input_values,
        },
        "weather": {
            "forecast": to_builtin(weather),
            "trained_weather_prediction": weather_prediction,
            "trained_weather_top_predictions": [
                {"label": label, "probability": round(float(probability), 2)}
                for label, probability in weather_top_predictions
            ],
            "trained_weather_input": None if weather_sample is None else weather_sample.to_dict(orient="records")[0],
        },
        "crop_prediction": build_recommendation_analysis(
            prediction,
            top_predictions,
            input_values,
            args.compare_crop,
        ),
        "duration_weather_outlook": build_duration_outlook(prediction, location, args),
        "irrigation": build_irrigation_summary(
            prediction,
            weather if weather is not None else {"rainfall": input_values["rainfall"]},
            args,
        ),
        "harvest": build_harvest_summary(prediction, args),
    }
    return to_builtin(result)


def cleanup_soil_card(path: str | None) -> None:
    if not path:
        return
    file_path = Path(path)
    if file_path.exists():
        file_path.unlink()
