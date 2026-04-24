import argparse
from collections import Counter
from datetime import date, datetime, timedelta
import json
import os
import pickle
import re
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import numpy as np
import pandas as pd


FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
SOIL_FEATURES = ["N", "P", "K", "ph"]
CROP_DATASET_FILE = "Crop_recommendation.csv"
OPENWEATHER_MAX_FORECAST_DAYS = 5
OPEN_METEO_MAX_FORECAST_DAYS = 16
WEATHER_MODEL_FILE = "weather_model.pkl"
LONG_RANGE_WEATHER_MODEL_FILE = "long_range_weather_model.pkl"
TESSERACT_PATHS = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
]

LONG_RANGE_CITY_COORDINATES = {
    "Ahmedabad": (23.0225, 72.5714),
    "Bengaluru": (12.9716, 77.5946),
    "Bhopal": (23.2599, 77.4126),
    "Chennai": (13.0827, 80.2707),
    "Delhi": (28.7041, 77.1025),
    "Hyderabad": (17.3850, 78.4867),
    "Jaipur": (26.9124, 75.7873),
    "Kolkata": (22.5726, 88.3639),
    "Lucknow": (26.8467, 80.9462),
    "Mumbai": (19.0760, 72.8777),
}

WEATHER_NUMERIC_FEATURES = [
    "Temperature",
    "Humidity",
    "Wind Speed",
    "Precipitation (%)",
    "Atmospheric Pressure",
    "UV Index",
    "Visibility (km)",
]

WEATHER_CATEGORICAL_FEATURES = [
    "Cloud Cover",
    "Season",
    "Location",
]

FEATURE_NAMES = {
    "N": "nitrogen",
    "P": "phosphorus",
    "K": "potassium",
    "temperature": "temperature",
    "humidity": "humidity",
    "ph": "soil pH",
    "rainfall": "rainfall",
}

FEATURE_UNITS = {
    "N": "",
    "P": "",
    "K": "",
    "temperature": " C",
    "humidity": "%",
    "ph": "",
    "rainfall": " mm",
}

SOIL_DEFAULTS = {
    "alluvial": {"N": 70, "P": 40, "K": 45, "ph": 7.0},
    "black": {"N": 80, "P": 35, "K": 50, "ph": 7.4},
    "clayey": {"N": 65, "P": 35, "K": 55, "ph": 7.2},
    "loamy": {"N": 60, "P": 40, "K": 40, "ph": 6.8},
    "red": {"N": 45, "P": 30, "K": 35, "ph": 6.2},
    "sandy": {"N": 35, "P": 25, "K": 30, "ph": 6.5},
    "silty": {"N": 55, "P": 38, "K": 42, "ph": 6.8},
}

LOCATION_SOIL_RULES = [
    ("maharashtra", "black"),
    ("mumbai", "black"),
    ("gujarat", "black"),
    ("madhya pradesh", "black"),
    ("karnataka", "red"),
    ("tamil nadu", "red"),
    ("telangana", "red"),
    ("andhra pradesh", "red"),
    ("rajasthan", "sandy"),
    ("punjab", "alluvial"),
    ("haryana", "alluvial"),
    ("uttar pradesh", "alluvial"),
    ("bihar", "alluvial"),
    ("west bengal", "alluvial"),
    ("kerala", "loamy"),
    ("goa", "loamy"),
    ("assam", "alluvial"),
]

LEGUME_PREVIOUS_CROPS = {
    "blackgram",
    "chickpea",
    "kidneybeans",
    "lentil",
    "mothbeans",
    "mungbean",
    "pigeonpeas",
}

HEAVY_FEEDER_PREVIOUS_CROPS = {
    "banana",
    "cotton",
    "maize",
    "papaya",
    "rice",
    "sugarcane",
    "wheat",
}

CROP_HARVEST_DAYS = {
    "rice": (120, 150),
    "maize": (90, 120),
    "chickpea": (90, 120),
    "kidneybeans": (75, 95),
    "pigeonpeas": (150, 180),
    "mothbeans": (60, 75),
    "mungbean": (60, 70),
    "blackgram": (70, 90),
    "lentil": (110, 130),
    "pomegranate": (730, 1095),
    "banana": (270, 365),
    "mango": (1095, 2190),
    "grapes": (730, 1095),
    "watermelon": (80, 100),
    "muskmelon": (70, 90),
    "apple": (1460, 2920),
    "orange": (1095, 1825),
    "papaya": (240, 330),
    "coconut": (2190, 3650),
    "cotton": (150, 180),
    "jute": (100, 120),
    "coffee": (1095, 1460),
}

KNOWN_PREVIOUS_CROPS = sorted(
    set(CROP_HARVEST_DAYS.keys())
    | LEGUME_PREVIOUS_CROPS
    | HEAVY_FEEDER_PREVIOUS_CROPS
    | {"none"}
)

HIGH_WATER_CROPS = {"rice", "jute", "banana", "coconut"}
LOW_WATER_CROPS = {
    "blackgram",
    "chickpea",
    "kidneybeans",
    "lentil",
    "mothbeans",
    "mungbean",
    "pigeonpeas",
}

WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}


def load_model():
    with open("model.pkl", "rb") as file:
        return pickle.load(file)


def load_weather_model():
    with open(WEATHER_MODEL_FILE, "rb") as file:
        return pickle.load(file)


def load_long_range_weather_model():
    with open(LONG_RANGE_WEATHER_MODEL_FILE, "rb") as file:
        return pickle.load(file)


def load_crop_profiles():
    df = pd.read_csv(CROP_DATASET_FILE)
    profiles = {}

    for crop, group in df.groupby("label"):
        profiles[crop] = {}
        for feature in FEATURES:
            values = group[feature].astype(float)
            profiles[crop][feature] = {
                "mean": float(values.mean()),
                "min": float(values.min()),
                "max": float(values.max()),
                "q10": float(values.quantile(0.10)),
                "q90": float(values.quantile(0.90)),
                "std": float(values.std()) or 1.0,
            }

    return profiles


def extract_pdf_text(path):
    try:
        from pypdf import PdfReader
    except ImportError as error:
        raise RuntimeError("Install pypdf to read PDF soil health cards.") from error

    reader = PdfReader(str(path))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages)


def extract_image_text(path):
    try:
        from PIL import Image
        import pytesseract
    except ImportError as error:
        raise RuntimeError(
            "Image soil-card OCR needs Pillow and pytesseract. "
            "Text PDFs and .txt files can be read without OCR."
        ) from error

    for tesseract_path in TESSERACT_PATHS:
        if Path(tesseract_path).exists():
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
            break

    try:
        return pytesseract.image_to_string(Image.open(path))
    except Exception as error:
        raise RuntimeError(
            "Could not OCR this image. Install the Tesseract app or use a text PDF."
        ) from error


def read_soil_card_text(card_path):
    path = Path(card_path)

    if not path.exists():
        raise RuntimeError(f"Soil health card not found: {card_path}")

    extension = path.suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(path)
    if extension in [".txt", ".csv"]:
        return path.read_text(encoding="utf-8", errors="ignore")
    if extension in [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"]:
        return extract_image_text(path)

    raise RuntimeError(
        "Unsupported soil-card file type. Use PDF, TXT, CSV, PNG, JPG, or JPEG."
    )


def extract_number_near_label(text, labels):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    label_pattern = "|".join(re.escape(label) for label in labels)
    value_pattern = re.compile(r"([-+]?\d+(?:\.\d+)?)")

    for line in lines:
        if re.search(label_pattern, line, flags=re.IGNORECASE):
            values = value_pattern.findall(line)
            if values:
                return float(values[-1])

    compact = re.sub(r"\s+", " ", text)
    pattern = re.compile(
        rf"(?:{label_pattern})[^\d\-]{{0,80}}([-+]?\d+(?:\.\d+)?)",
        flags=re.IGNORECASE,
    )
    match = pattern.search(compact)

    if match:
        return float(match.group(1))

    return None


def extract_ph_value(text):
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    value_pattern = re.compile(r"([-+]?\d+(?:\.\d+)?)")
    ph_label = re.compile(
        r"(?:soil\s*p\s*h|p\s*h\s*value|\bp\s*h\b)",
        flags=re.IGNORECASE,
    )

    for line in lines:
        if "phosph" in line.lower():
            continue
        if ph_label.search(line):
            values = value_pattern.findall(line)
            if values:
                return normalize_ph(float(values[-1]))

    compact = re.sub(r"\s+", " ", text)
    for match in ph_label.finditer(compact):
        nearby = compact[match.end():match.end() + 60]
        values = value_pattern.findall(nearby)
        if values:
            return normalize_ph(float(values[0]))

    return None


def normalize_ph(value):
    if value > 14 and value <= 140:
        return value / 10
    if value > 140 and value <= 1400:
        return value / 100

    return value


def infer_soil_type_from_location(location):
    location_text = (location or {}).get("name", "").lower()

    for keyword, soil_type in LOCATION_SOIL_RULES:
        if keyword in location_text:
            return soil_type

    latitude = (location or {}).get("latitude")
    if latitude is not None:
        latitude = abs(float(latitude))
        if latitude < 15:
            return "loamy"
        if latitude < 25:
            return "black"
        if latitude < 32:
            return "alluvial"

    return "loamy"


def extract_soil_values_from_card(card_path):
    text = read_soil_card_text(card_path)

    values = {
        "N": extract_number_near_label(
            text,
            ["available nitrogen", "nitrogen", "n value", " n "],
        ),
        "P": extract_number_near_label(
            text,
            ["available phosphorus", "phosphorus", "phosphate", "p value", " p "],
        ),
        "K": extract_number_near_label(
            text,
            ["available potassium", "potassium", "potash", "k value", " k "],
        ),
        "ph": extract_ph_value(text),
    }

    missing = [feature for feature, value in values.items() if value is None]
    if missing:
        missing_text = ", ".join(missing)
        raise RuntimeError(
            f"Could not extract {missing_text} from the soil health card. "
            "Use a clearer text PDF or pass the missing values manually."
        )

    return values


def estimate_soil_values(args, location=None):
    inferred_soil_type = infer_soil_type_from_location(location)
    soil_type = args.soil_type or inferred_soil_type
    is_clayey = parse_bool(
        args.is_clayey
        if args.is_clayey is not None
        else ask_text("Is the soil clayey? (yes/no)", default="no")
    )
    if args.soil_moisture is None:
        args.soil_moisture = ask_choice(
            "Is the soil dry, normal, or wet",
            ["dry", "normal", "wet"],
            default="normal",
        )
    if args.irrigation_regular is None:
        args.irrigation_regular = ask_text(
            "Is irrigation regular? (yes/no)",
            default="yes",
        )
    previous_crop = args.previous_crop or ask_text(
        "Previous crop grown in this field",
        default="none",
    )
    previous_crop = previous_crop.strip().lower()
    defaults = SOIL_DEFAULTS.get(soil_type, SOIL_DEFAULTS["loamy"]).copy()

    if is_clayey and soil_type != "clayey":
        defaults["K"] += 8
        defaults["ph"] += 0.15

    args.soil_type = soil_type
    args.is_clayey = "yes" if is_clayey else "no"
    args.previous_crop = previous_crop

    if args.soil_moisture == "dry":
        defaults["N"] = max(0, defaults["N"] - 5)
    elif args.soil_moisture == "wet":
        defaults["N"] += 5

    if previous_crop in LEGUME_PREVIOUS_CROPS:
        defaults["N"] += 12
        defaults["P"] += 3
    elif previous_crop in HEAVY_FEEDER_PREVIOUS_CROPS:
        defaults["N"] = max(0, defaults["N"] - 12)
        defaults["P"] = max(0, defaults["P"] - 5)
        defaults["K"] = max(0, defaults["K"] - 6)

    irrigation_regular = parse_bool(args.irrigation_regular)
    if args.irrigation_mm is None:
        args.irrigation_mm = 25 if irrigation_regular else 0

    for feature in SOIL_FEATURES:
        override = getattr(args, feature)
        if override is not None:
            defaults[feature] = override

    print("\nEstimated Soil Input")
    if location:
        print("Soil estimate location:", location.get("name", "unknown"))
    print("Soil type:", soil_type)
    if not args.soil_type:
        print("Soil type source: estimated from geolocation")
    print("Clayey:", "yes" if is_clayey else "no")
    print("Soil moisture:", args.soil_moisture)
    print("Regular irrigation:", "yes" if irrigation_regular else "no")
    print("Previous crop:", previous_crop)
    print("Estimated N:", defaults["N"])
    print("Estimated P:", defaults["P"])
    print("Estimated K:", defaults["K"])
    print("Estimated pH:", defaults["ph"])
    print(
        "Note: N, P, K, and pH are estimated internally from the manual field inputs."
    )

    return defaults


def fetch_json(url, source):
    request = Request(url, headers={"User-Agent": "crop-recommendation-model/1.0"})
    try:
        with urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        raise RuntimeError(f"HTTP error {error.code} while calling {source}.") from error
    except URLError as error:
        raise RuntimeError(f"Network error while calling {source}.") from error


def average(values):
    return sum(values) / len(values)


def most_common(values, default="Unknown"):
    if not values:
        return default

    return Counter(values).most_common(1)[0][0]


def cloud_cover_category(cloud_cover_percent, weather_type=None):
    if cloud_cover_percent is None and weather_type:
        weather_type = weather_type.lower()
        if "clear" in weather_type or "sun" in weather_type:
            return "clear"
        if "overcast" in weather_type:
            return "overcast"
        if "cloud" in weather_type:
            return "cloudy"

    cloud_cover_percent = float(cloud_cover_percent or 0)

    if cloud_cover_percent <= 20:
        return "clear"
    if cloud_cover_percent <= 50:
        return "partly cloudy"
    if cloud_cover_percent <= 80:
        return "cloudy"

    return "overcast"


def infer_season(latitude, reference_date=None):
    reference_date = reference_date or date.today()
    month = reference_date.month

    if latitude is not None and latitude < 0:
        month = ((month + 5) % 12) + 1

    if month in [12, 1, 2]:
        return "Winter"
    if month in [3, 4, 5]:
        return "Spring"
    if month in [6, 7, 8]:
        return "Summer"

    return "Autumn"


def estimate_uv_index(season, cloud_cover):
    base_by_season = {
        "Winter": 2,
        "Spring": 6,
        "Summer": 8,
        "Autumn": 4,
    }
    cloud_reduction = {
        "clear": 0,
        "partly cloudy": 1,
        "cloudy": 2,
        "overcast": 3,
    }

    return max(0, base_by_season.get(season, 5) - cloud_reduction.get(cloud_cover, 1))


def parse_bool(value):
    if isinstance(value, bool):
        return value

    value = str(value).strip().lower()

    if value in ["yes", "y", "true", "1"]:
        return True
    if value in ["no", "n", "false", "0"]:
        return False

    raise ValueError("Expected yes or no.")


def parse_date(value):
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError as error:
        raise RuntimeError("Date must be in YYYY-MM-DD format.") from error


def get_planting_date(args):
    if args.planting_date:
        planting_date = parse_date(args.planting_date)
    else:
        planting_date = parse_date(
            ask_text(
                "When do you want to cultivate/plant? (YYYY-MM-DD)",
                default=date.today().isoformat(),
            )
        )

    if planting_date < date.today():
        raise RuntimeError("Planting date cannot be in the past.")

    args.planting_date = planting_date.isoformat()
    return planting_date


def get_forecast_window(args):
    start_date = get_planting_date(args)
    forecast_days = max(1, args.forecast_days)
    end_date = start_date + timedelta(days=forecast_days - 1)
    return start_date, end_date, forecast_days


def ensure_open_meteo_forecast_window(start_date, end_date):
    max_date = date.today() + timedelta(days=OPEN_METEO_MAX_FORECAST_DAYS - 1)

    if end_date > max_date:
        raise RuntimeError(
            "Open-Meteo forecast supports up to 16 days ahead. "
            f"Choose a planting window ending on or before {max_date}."
        )


def ensure_openweather_forecast_window(start_date, end_date):
    max_date = date.today() + timedelta(days=OPENWEATHER_MAX_FORECAST_DAYS - 1)

    if end_date > max_date:
        raise RuntimeError(
            "OpenWeather free 5-day / 3-hour forecast supports about 5 days ahead. "
            f"Choose a planting window ending on or before {max_date}, "
            "or use --weather-provider open-meteo for up to 16 days."
        )


def is_within_open_meteo_window(end_date):
    max_date = date.today() + timedelta(days=OPEN_METEO_MAX_FORECAST_DAYS - 1)
    return end_date <= max_date


def is_within_openweather_window(end_date):
    max_date = date.today() + timedelta(days=OPENWEATHER_MAX_FORECAST_DAYS - 1)
    return end_date <= max_date


def geolocate_by_ip():
    data = fetch_json("https://ipwho.is/", "IP geolocation API")

    if data.get("success") is False:
        raise RuntimeError(data.get("message", "Could not detect location from IP."))

    return {
        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "name": ", ".join(
            part for part in [data.get("city"), data.get("region"), data.get("country")]
            if part
        ),
    }


def geolocate_by_city(city):
    query = urlencode({"name": city, "count": 1, "language": "en", "format": "json"})
    data = fetch_json(
        f"https://geocoding-api.open-meteo.com/v1/search?{query}",
        "Open-Meteo geocoding API",
    )
    results = data.get("results", [])

    if not results:
        raise RuntimeError(f"Could not find location for city: {city}")

    result = results[0]
    return {
        "latitude": result["latitude"],
        "longitude": result["longitude"],
        "name": ", ".join(
            part for part in [
                result.get("name"),
                result.get("admin1"),
                result.get("country"),
            ]
            if part
        ),
    }


def get_location(args):
    if args.latitude is not None and args.longitude is not None:
        return {
            "latitude": args.latitude,
            "longitude": args.longitude,
            "name": f"{args.latitude}, {args.longitude}",
        }

    if args.city:
        return geolocate_by_city(args.city)

    return geolocate_by_ip()


def get_open_meteo_current_weather(location):
    query = urlencode(
        {
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "current": (
                "temperature_2m,relative_humidity_2m,precipitation,weather_code,"
                "wind_speed_10m,pressure_msl,cloud_cover"
            ),
            "daily": "precipitation_sum",
            "timezone": "auto",
            "forecast_days": 1,
        }
    )
    data = fetch_json(
        f"https://api.open-meteo.com/v1/forecast?{query}",
        "Open-Meteo current weather API",
    )

    current = data["current"]
    daily = data["daily"]
    weather_code = current.get("weather_code")
    cloud_percent = current.get("cloud_cover")
    weather_type = WEATHER_CODES.get(weather_code, f"Weather code {weather_code}")

    return {
        "temperature": float(current["temperature_2m"]),
        "humidity": float(current["relative_humidity_2m"]),
        "rainfall": float(daily["precipitation_sum"][0]),
        "weather_type": weather_type,
        "current_precipitation": float(current.get("precipitation", 0)),
        "wind_speed": float(current.get("wind_speed_10m", 0)),
        "atmospheric_pressure": float(current.get("pressure_msl", 1013.25)),
        "cloud_cover_percent": float(cloud_percent or 0),
        "cloud_cover": cloud_cover_category(cloud_percent, weather_type),
        "precipitation_probability": 100 if float(current.get("precipitation", 0)) > 0 else 0,
        "visibility_km": 10,
        "source": "Open-Meteo current weather",
        "mode": "current",
        "rainfall_note": "daily precipitation sum",
    }


def get_open_meteo_forecast_weather(location, start_date, end_date, forecast_days):
    ensure_open_meteo_forecast_window(start_date, end_date)
    query = urlencode(
        {
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "hourly": (
                "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,"
                "pressure_msl,visibility,cloud_cover,precipitation_probability"
            ),
            "daily": "precipitation_sum",
            "timezone": "auto",
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        }
    )
    data = fetch_json(
        f"https://api.open-meteo.com/v1/forecast?{query}",
        "Open-Meteo forecast API",
    )

    hourly = data["hourly"]
    daily = data["daily"]
    weather_codes = [
        WEATHER_CODES.get(code, f"Weather code {code}")
        for code in hourly.get("weather_code", [])
    ]
    cloud_cover_percent = average([float(value) for value in hourly["cloud_cover"]])
    precipitation_probability = average(
        [float(value) for value in hourly["precipitation_probability"]]
    )

    return {
        "temperature": round(average([float(value) for value in hourly["temperature_2m"]]), 2),
        "humidity": round(
            average([float(value) for value in hourly["relative_humidity_2m"]]), 2
        ),
        "rainfall": round(sum(float(value) for value in daily["precipitation_sum"]), 2),
        "weather_type": most_common(weather_codes),
        "current_precipitation": None,
        "wind_speed": round(average([float(value) for value in hourly["wind_speed_10m"]]), 2),
        "atmospheric_pressure": round(
            average([float(value) for value in hourly["pressure_msl"]]), 2
        ),
        "cloud_cover_percent": round(cloud_cover_percent, 2),
        "cloud_cover": cloud_cover_category(cloud_cover_percent, most_common(weather_codes)),
        "precipitation_probability": round(precipitation_probability, 2),
        "visibility_km": round(average([float(value) / 1000 for value in hourly["visibility"]]), 2),
        "source": "Open-Meteo weather forecast",
        "mode": "forecast",
        "forecast_days": forecast_days,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "rainfall_note": f"predicted total rainfall for next {forecast_days} day(s)",
    }


def get_openweather_current_weather(location, api_key):
    if not api_key:
        raise RuntimeError(
            "OpenWeather API key missing. Set OPENWEATHER_API_KEY or pass --weather-api-key."
        )

    query = urlencode(
        {
            "lat": location["latitude"],
            "lon": location["longitude"],
            "appid": api_key,
            "units": "metric",
        }
    )
    data = fetch_json(
        f"https://api.openweathermap.org/data/2.5/weather?{query}",
        "OpenWeather current weather API",
    )

    if str(data.get("cod")) != "200":
        raise RuntimeError(data.get("message", "OpenWeather API request failed."))

    main = data["main"]
    weather = data.get("weather", [{}])[0]
    rain = data.get("rain", {})
    rainfall = float(rain.get("1h", rain.get("3h", 0)))
    cloud_percent = data.get("clouds", {}).get("all")
    weather_type = weather.get("description", "Unknown").title()

    return {
        "temperature": float(main["temp"]),
        "humidity": float(main["humidity"]),
        "rainfall": rainfall,
        "weather_type": weather_type,
        "current_precipitation": rainfall,
        "wind_speed": round(float(data.get("wind", {}).get("speed", 0)) * 3.6, 2),
        "atmospheric_pressure": float(main.get("pressure", 1013.25)),
        "cloud_cover_percent": float(cloud_percent or 0),
        "cloud_cover": cloud_cover_category(cloud_percent, weather_type),
        "precipitation_probability": 100 if rainfall > 0 else 0,
        "visibility_km": round(float(data.get("visibility", 10000)) / 1000, 2),
        "source": "OpenWeather current weather",
        "mode": "current",
        "rainfall_note": "current rain volume from last 1h/3h, or 0 if no rain is reported",
    }


def get_openweather_forecast_weather(location, api_key, start_date, end_date, forecast_days):
    if not api_key:
        raise RuntimeError(
            "OpenWeather API key missing. Set OPENWEATHER_API_KEY or pass --weather-api-key."
        )

    ensure_openweather_forecast_window(start_date, end_date)
    query = urlencode(
        {
            "lat": location["latitude"],
            "lon": location["longitude"],
            "appid": api_key,
            "units": "metric",
            "cnt": OPENWEATHER_MAX_FORECAST_DAYS * 8,
        }
    )
    data = fetch_json(
        f"https://api.openweathermap.org/data/2.5/forecast?{query}",
        "OpenWeather forecast API",
    )

    if str(data.get("cod")) != "200":
        raise RuntimeError(data.get("message", "OpenWeather forecast request failed."))

    forecasts = [
        item
        for item in data.get("list", [])
        if start_date <= datetime.fromtimestamp(item["dt"]).date() <= end_date
    ]
    if not forecasts:
        raise RuntimeError("OpenWeather forecast did not return points for that planting window.")

    temperatures = [float(item["main"]["temp"]) for item in forecasts]
    humidities = [float(item["main"]["humidity"]) for item in forecasts]
    rainfall = sum(float(item.get("rain", {}).get("3h", 0)) for item in forecasts)
    wind_speeds = [float(item.get("wind", {}).get("speed", 0)) * 3.6 for item in forecasts]
    pressures = [float(item["main"].get("pressure", 1013.25)) for item in forecasts]
    precipitation_probabilities = [float(item.get("pop", 0)) * 100 for item in forecasts]
    visibilities = [float(item.get("visibility", 10000)) / 1000 for item in forecasts]
    cloud_percentages = [
        float(item.get("clouds", {}).get("all", 0)) for item in forecasts
    ]
    descriptions = [
        item.get("weather", [{}])[0].get("description", "Unknown").title()
        for item in forecasts
    ]
    cloud_percent = average(cloud_percentages)

    return {
        "temperature": round(average(temperatures), 2),
        "humidity": round(average(humidities), 2),
        "rainfall": round(rainfall, 2),
        "weather_type": most_common(descriptions),
        "current_precipitation": None,
        "wind_speed": round(average(wind_speeds), 2),
        "atmospheric_pressure": round(average(pressures), 2),
        "cloud_cover_percent": round(cloud_percent, 2),
        "cloud_cover": cloud_cover_category(cloud_percent, most_common(descriptions)),
        "precipitation_probability": round(average(precipitation_probabilities), 2),
        "visibility_km": round(average(visibilities), 2),
        "source": "OpenWeather 5-day / 3-hour forecast",
        "mode": "forecast",
        "forecast_days": forecast_days,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "forecast_points": len(forecasts),
        "rainfall_note": f"predicted total rainfall for next {forecast_days} day(s)",
    }


def add_long_range_date_features(frame):
    frame = frame.copy()
    dates = pd.to_datetime(frame["Date"])
    frame["month"] = dates.dt.month
    frame["day"] = dates.dt.day
    frame["day_of_year"] = dates.dt.dayofyear
    frame["month_sin"] = np.sin(2 * np.pi * frame["month"] / 12)
    frame["month_cos"] = np.cos(2 * np.pi * frame["month"] / 12)
    frame["day_of_year_sin"] = np.sin(2 * np.pi * frame["day_of_year"] / 366)
    frame["day_of_year_cos"] = np.cos(2 * np.pi * frame["day_of_year"] / 366)
    return frame


def choose_long_range_city(location, args, bundle):
    cities = bundle.get("cities", [])
    states_by_city = bundle.get("states_by_city", {})

    requested_city = (args.city or "").strip().lower()
    for city in cities:
        if city.lower() == requested_city:
            return city, states_by_city.get(city, "")

    location_name = (location or {}).get("name", "").lower()
    for city in cities:
        if city.lower() in location_name:
            return city, states_by_city.get(city, "")

    latitude = (location or {}).get("latitude")
    longitude = (location or {}).get("longitude")
    if latitude is not None and longitude is not None:
        best_city = min(
            cities,
            key=lambda city: (
                (float(latitude) - LONG_RANGE_CITY_COORDINATES.get(city, (0, 0))[0]) ** 2
                + (float(longitude) - LONG_RANGE_CITY_COORDINATES.get(city, (0, 0))[1]) ** 2
            ),
        )
        return best_city, states_by_city.get(best_city, "")

    fallback_city = "Mumbai" if "Mumbai" in cities else cities[0]
    return fallback_city, states_by_city.get(fallback_city, "")


def weather_type_from_long_range(rainfall, cloud_cover):
    if rainfall >= 15:
        return "Rainy historical pattern"
    if rainfall >= 2:
        return "Light rain historical pattern"
    if cloud_cover >= 75:
        return "Overcast historical pattern"
    if cloud_cover >= 45:
        return "Cloudy historical pattern"
    return "Sunny historical pattern"


def find_target_column(targets, prefix):
    for target in targets:
        if target.startswith(prefix):
            return target

    raise RuntimeError(f"Long-range weather model target missing: {prefix}")


def get_kaggle_long_range_weather(location, args, start_date, end_date, forecast_days):
    bundle = load_long_range_weather_model()
    model = bundle["model"]
    targets = bundle["targets"]
    city, state = choose_long_range_city(location, args, bundle)

    rows = []
    current_date = start_date
    while current_date <= end_date:
        rows.append(
            {
                "Date": current_date.isoformat(),
                "City": city,
                "State": state,
            }
        )
        current_date += timedelta(days=1)

    frame = add_long_range_date_features(pd.DataFrame(rows))
    prediction_frame = frame[
        bundle["numeric_features"] + bundle["categorical_features"]
    ]
    predictions = pd.DataFrame(model.predict(prediction_frame), columns=targets)

    temperature = float(predictions[find_target_column(targets, "Temperature_Avg")].mean())
    humidity = float(predictions[find_target_column(targets, "Humidity")].mean())
    rainfall = float(predictions[find_target_column(targets, "Rainfall")].sum())
    wind_speed = float(predictions[find_target_column(targets, "Wind_Speed")].mean())
    pressure = float(predictions[find_target_column(targets, "Pressure")].mean())
    cloud_cover_percent = float(predictions[find_target_column(targets, "Cloud_Cover")].mean())
    cloud_cover = cloud_cover_category(cloud_cover_percent)
    precipitation_probability = min(100, max(0, rainfall / max(1, forecast_days) * 12))

    return {
        "temperature": round(temperature, 2),
        "humidity": round(max(0, min(100, humidity)), 2),
        "rainfall": round(max(0, rainfall), 2),
        "weather_type": weather_type_from_long_range(rainfall, cloud_cover_percent),
        "current_precipitation": None,
        "wind_speed": round(max(0, wind_speed), 2),
        "atmospheric_pressure": round(pressure, 2),
        "cloud_cover_percent": round(max(0, min(100, cloud_cover_percent)), 2),
        "cloud_cover": cloud_cover,
        "precipitation_probability": round(precipitation_probability, 2),
        "visibility_km": 10,
        "source": "Kaggle historical-pattern long-range weather model",
        "mode": "long-range forecast",
        "forecast_days": forecast_days,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "long_range_city": city,
        "rainfall_note": (
            f"historical-pattern rainfall estimate for {forecast_days} day(s), "
            "used because the selected date is beyond live forecast limits"
        ),
    }


def get_crop_duration_days(crop):
    days = CROP_HARVEST_DAYS.get(crop)
    if not days:
        return None

    return round((days[0] + days[1]) / 2)


def get_crop_duration_weather_outlook(crop, location, args):
    duration_days = get_crop_duration_days(crop)
    if duration_days is None:
        return None

    planting_date = get_planting_date(args)
    end_date = planting_date + timedelta(days=duration_days - 1)

    outlook = get_kaggle_long_range_weather(
        location,
        args,
        planting_date,
        end_date,
        duration_days,
    )
    outlook["duration_days"] = duration_days
    outlook["daily_rainfall_average"] = round(
        outlook["rainfall"] / max(1, duration_days),
        2,
    )
    return outlook


def get_weather(location, args):
    api_key = args.weather_api_key or os.getenv("OPENWEATHER_API_KEY")
    start_date, end_date, forecast_days = get_forecast_window(args)

    if args.weather_provider == "kaggle-long-range":
        return get_kaggle_long_range_weather(
            location,
            args,
            start_date,
            end_date,
            forecast_days,
        )

    if args.weather_provider == "auto" and args.weather_mode == "forecast":
        if api_key and is_within_openweather_window(end_date):
            return get_openweather_forecast_weather(
                location,
                api_key,
                start_date,
                end_date,
                forecast_days,
            )

        if is_within_open_meteo_window(end_date):
            return get_open_meteo_forecast_weather(
                location,
                start_date,
                end_date,
                forecast_days,
            )

        return get_kaggle_long_range_weather(
            location,
            args,
            start_date,
            end_date,
            forecast_days,
        )

    if args.weather_provider == "openweather":
        if args.weather_mode == "current":
            return get_openweather_current_weather(location, api_key)

        if not is_within_openweather_window(end_date):
            if is_within_open_meteo_window(end_date):
                return get_open_meteo_forecast_weather(
                    location,
                    start_date,
                    end_date,
                    forecast_days,
                )

            return get_kaggle_long_range_weather(
                location,
                args,
                start_date,
                end_date,
                forecast_days,
            )

        return get_openweather_forecast_weather(
            location,
            api_key,
            start_date,
            end_date,
            forecast_days,
        )

    if args.weather_provider == "open-meteo":
        if args.weather_mode == "current":
            return get_open_meteo_current_weather(location)

        if not is_within_open_meteo_window(end_date):
            return get_kaggle_long_range_weather(
                location,
                args,
                start_date,
                end_date,
                forecast_days,
            )

        return get_open_meteo_forecast_weather(location, start_date, end_date, forecast_days)

    if api_key:
        if args.weather_mode == "current":
            return get_openweather_current_weather(location, api_key)

        return get_openweather_forecast_weather(
            location,
            api_key,
            start_date,
            end_date,
            forecast_days,
        )

    if args.weather_mode == "current":
        return get_open_meteo_current_weather(location)

    return get_open_meteo_forecast_weather(location, start_date, end_date, forecast_days)


def build_weather_model_sample(weather, location, args):
    planting_date = get_planting_date(args)
    season = args.season or infer_season(location.get("latitude"), planting_date)
    cloud_cover = weather.get("cloud_cover") or cloud_cover_category(
        weather.get("cloud_cover_percent"),
        weather.get("weather_type"),
    )
    uv_index = args.uv_index

    if uv_index is None:
        uv_index = estimate_uv_index(season, cloud_cover)

    return pd.DataFrame(
        [
            {
                "Temperature": weather["temperature"],
                "Humidity": weather["humidity"],
                "Wind Speed": weather.get("wind_speed", 0),
                "Precipitation (%)": weather.get("precipitation_probability", 0),
                "Cloud Cover": cloud_cover,
                "Atmospheric Pressure": weather.get("atmospheric_pressure", 1013.25),
                "UV Index": uv_index,
                "Season": season,
                "Visibility (km)": weather.get("visibility_km", 10),
                "Location": args.location_type,
            }
        ],
        columns=WEATHER_NUMERIC_FEATURES + WEATHER_CATEGORICAL_FEATURES,
    )


def predict_weather_type(weather, location, args):
    bundle = load_weather_model()
    model = bundle["model"] if isinstance(bundle, dict) else bundle
    sample = build_weather_model_sample(weather, location, args)
    prediction = model.predict(sample)[0]
    probabilities = model.predict_proba(sample)[0]
    classes = model.classes_
    top_indices = np.argsort(probabilities)[-3:][::-1]

    top_predictions = [
        (classes[index], probabilities[index] * 100)
        for index in top_indices
    ]

    return prediction, top_predictions, sample


def format_feature_value(feature, value):
    if feature == "ph":
        return f"{value:.2f}"

    if feature in ["N", "P", "K"]:
        return f"{value:.0f}"

    return f"{value:.2f}{FEATURE_UNITS.get(feature, '')}"


def format_range(feature, low, high):
    return (
        f"{format_feature_value(feature, low)} to "
        f"{format_feature_value(feature, high)}"
    )


def evaluate_crop_fit(crop, input_values, crop_profiles):
    profile = crop_profiles[crop]
    matches = []
    concerns = []
    total_distance = 0

    for feature, value in input_values.items():
        stats = profile[feature]
        std = stats["std"] or 1.0
        distance = abs(value - stats["mean"]) / std
        total_distance += distance

        item = {
            "feature": feature,
            "value": value,
            "stats": stats,
            "distance": distance,
        }

        if stats["q10"] <= value <= stats["q90"]:
            matches.append(item)
        else:
            concerns.append(item)

    matches.sort(key=lambda item: item["distance"])
    concerns.sort(key=lambda item: item["distance"], reverse=True)

    return {
        "crop": crop,
        "matches": matches,
        "concerns": concerns,
        "total_distance": total_distance,
    }


def match_reason(item):
    feature = item["feature"]
    stats = item["stats"]
    value = item["value"]
    return (
        f"{FEATURE_NAMES[feature]} is {format_feature_value(feature, value)}, "
        f"inside the common {format_range(feature, stats['q10'], stats['q90'])} "
        "range seen in the crop dataset"
    )


def concern_reason(item, crop):
    feature = item["feature"]
    stats = item["stats"]
    value = item["value"]
    crop_range = format_range(feature, stats["q10"], stats["q90"])
    value_text = format_feature_value(feature, value)

    if value < stats["q10"]:
        direction = "too low"
    elif value > stats["q90"]:
        direction = "too high"
    else:
        direction = "not ideal"

    return (
        f"{FEATURE_NAMES[feature]} is {value_text}, which is {direction} for "
        f"{crop}; its common dataset range is {crop_range}"
    )


def find_crop_name(crop_name, crop_profiles):
    if not crop_name:
        return None

    for crop in crop_profiles:
        if crop.lower() == crop_name.lower():
            return crop

    return None


def print_bad_crop_reason(crop, probability, input_values, crop_profiles):
    fit = evaluate_crop_fit(crop, input_values, crop_profiles)
    weak_reasons = fit["concerns"][:2]

    if not weak_reasons:
        print(
            f"- {crop} is possible but weaker: model probability is "
            f"{probability:.2f}% and it has fewer strong matches than the top crop."
        )
        return

    reason_text = "; ".join(
        concern_reason(item, crop) for item in weak_reasons
    )
    print(f"- {crop} is a bad idea right now ({probability:.2f}%): {reason_text}.")


def print_recommendation_explanation(
    prediction,
    top_predictions,
    input_values,
    compare_crop=None,
):
    crop_profiles = load_crop_profiles()
    prediction_fit = evaluate_crop_fit(prediction, input_values, crop_profiles)
    probability_by_crop = dict(top_predictions)

    print("\nWhy this crop is recommended:")
    print(
        f"{prediction} is the best match because the trained crop model gave it "
        f"the highest probability, and the input/forecast values fit its dataset profile."
    )

    for item in prediction_fit["matches"][:4]:
        print("- Good:", match_reason(item))

    if prediction_fit["concerns"]:
        print("\nThings to watch even for this recommendation:")
        for item in prediction_fit["concerns"][:2]:
            print("- Check:", concern_reason(item, prediction))

    print("\nWhy other crops are weaker choices:")
    explained = 0
    for crop, probability in top_predictions:
        if crop == prediction:
            continue

        print_bad_crop_reason(crop, probability, input_values, crop_profiles)
        explained += 1
        if explained >= 2:
            break

    compared_crop = find_crop_name(compare_crop, crop_profiles)
    if compare_crop and not compared_crop:
        print(f"\nCould not compare '{compare_crop}' because it is not in the crop dataset.")
    elif compared_crop and compared_crop != prediction:
        compared_probability = probability_by_crop.get(compared_crop, 0)
        print(f"\nWhy {compared_crop} is not the best choice:")
        print_bad_crop_reason(
            compared_crop,
            compared_probability,
            input_values,
            crop_profiles,
        )

    if explained == 0:
        weakest_crops = []
        for crop in crop_profiles:
            if crop != prediction:
                fit = evaluate_crop_fit(crop, input_values, crop_profiles)
                weakest_crops.append((fit["total_distance"], crop, fit))

        weakest_crops.sort(reverse=True)
        for _, crop, fit in weakest_crops[:2]:
            reason_text = "; ".join(
                concern_reason(item, crop) for item in fit["concerns"][:2]
            )
            print(f"- {crop} is a bad idea right now: {reason_text}.")


def irrigation_thresholds(crop, args):
    if crop in HIGH_WATER_CROPS:
        minimum = 25
        upper = 70
    elif crop in LOW_WATER_CROPS:
        minimum = 10
        upper = 45
    else:
        minimum = 15
        upper = 55

    if args.soil_type == "sandy":
        minimum += 5
        upper -= 5
    elif args.soil_type == "clayey" or parse_bool(args.is_clayey or "no"):
        minimum -= 3
        upper -= 8

    if args.soil_moisture == "dry":
        minimum += 8
    elif args.soil_moisture == "wet":
        minimum -= 6
        upper -= 10

    return max(5, minimum), max(minimum + 10, upper)


def print_irrigation_advice(crop, weather, args):
    minimum, upper = irrigation_thresholds(crop, args)
    rainfall = float(weather.get("rainfall", 0))
    irrigation = args.irrigation_mm
    available = rainfall + (irrigation or 0)

    print("\nIrrigation Check:")
    print("Forecast rainfall in planting window:", f"{rainfall:.2f} mm")

    if irrigation is None:
        print("Irrigation entered: not provided")
        if rainfall < minimum:
            needed = minimum - rainfall
            print(
                f"Advice: irrigation is needed. Add about {needed:.1f} mm "
                f"during the planting window for {crop}."
            )
        elif rainfall > upper:
            print(
                "Advice: do not add irrigation now; rainfall is already high, "
                "so drainage/waterlogging is the bigger risk."
            )
        else:
            print("Advice: forecast rainfall looks adequate; light irrigation only if soil dries.")
        return

    print("Irrigation entered:", f"{irrigation:.2f} mm")
    print("Rainfall + irrigation:", f"{available:.2f} mm")

    if available < minimum:
        print(
            "Status: irrigation is not enough. "
            f"Add about {minimum - available:.1f} mm more for better establishment."
        )
    elif available > upper:
        print(
            "Status: irrigation may be too much. Avoid extra watering and check drainage."
        )
    else:
        print("Status: irrigation looks proper for the planting window.")


def print_harvest_window(crop, args):
    planting_date = get_planting_date(args)
    days = CROP_HARVEST_DAYS.get(crop)

    print("\nExpected Harvest Window:")
    print("Planting date:", planting_date.isoformat())

    if not days:
        print(f"No harvest estimate is available for {crop}.")
        return

    start_date = planting_date + timedelta(days=days[0])
    end_date = planting_date + timedelta(days=days[1])

    if days[0] >= 365:
        print(
            f"{crop} is a long-duration/perennial crop. "
            f"Expected first harvest: {start_date.isoformat()} to {end_date.isoformat()}."
        )
    else:
        print(
            f"Expected harvest for {crop}: {start_date.isoformat()} "
            f"to {end_date.isoformat()}."
        )

    print(
        "Best-yield note: keep irrigation, drainage, and nutrient management stable "
        "through the crop cycle; this estimate is based on common crop duration."
    )


def print_crop_duration_weather_outlook(crop, location, args):
    outlook = get_crop_duration_weather_outlook(crop, location, args)

    if not outlook:
        return

    crop_profiles = load_crop_profiles()
    crop_profile = crop_profiles.get(crop)
    duration_input_values = None
    if crop_profile:
        duration_input_values = {
            "N": crop_profile["N"]["mean"],
            "P": crop_profile["P"]["mean"],
            "K": crop_profile["K"]["mean"],
            "temperature": outlook["temperature"],
            "humidity": outlook["humidity"],
            "ph": crop_profile["ph"]["mean"],
            "rainfall": outlook["daily_rainfall_average"],
        }
        duration_fit = evaluate_crop_fit(crop, duration_input_values, crop_profiles)
    else:
        duration_fit = None

    print("\nFull Crop Duration Weather Outlook:")
    print(
        f"Projected crop duration for {crop}: about {outlook['duration_days']} day(s)"
    )
    print("Weather source:", outlook["source"])
    if outlook.get("long_range_city"):
        print("Historical-pattern city used:", outlook["long_range_city"])
    print("Crop window:", outlook["start_date"], "to", outlook["end_date"])
    print("Average temperature across crop cycle:", f"{outlook['temperature']:.2f} C")
    print("Average humidity across crop cycle:", f"{outlook['humidity']:.2f} %")
    print("Total rainfall across crop cycle:", f"{outlook['rainfall']:.2f} mm")
    print(
        "Average daily rainfall across crop cycle:",
        f"{outlook['daily_rainfall_average']:.2f} mm",
    )
    print("Likely weather pattern:", outlook["weather_type"])

    if duration_fit:
        print("\nHow the full season looks for this crop:")
        for item in duration_fit["matches"][:3]:
            print("- Good:", match_reason(item))
        for item in duration_fit["concerns"][:2]:
            print("- Watch:", concern_reason(item, crop))

    print(
        "Season note: this is a full-cycle historical-pattern estimate so the farmer can "
        "review weather from planting to harvest, not just the starting week."
    )


def ask_value(name):
    while True:
        value = input(f"Enter {name}: ").strip()
        try:
            return float(value)
        except ValueError:
            print("Please enter a number.")


def ask_text(prompt, default=None):
    suffix = f" [{default}]" if default is not None else ""
    value = input(f"{prompt}{suffix}: ").strip()

    if not value and default is not None:
        return default

    return value


def ask_choice(name, choices, default=None):
    choices_text = "/".join(choices)

    while True:
        value = ask_text(f"{name} ({choices_text})", default=default).lower()
        if value in choices:
            return value
        print("Choose one of:", ", ".join(choices))


def get_values_from_user():
    print("\nEnter values to test the crop recommendation model:\n")
    return [ask_value(feature) for feature in FEATURES]


def get_soil_values_from_user(args, location=None):
    if args.soil_card:
        values = extract_soil_values_from_card(args.soil_card)

        for feature in SOIL_FEATURES:
            override = getattr(args, feature)
            if override is not None:
                values[feature] = override

        print("\nSoil Health Card Input")
        print("File:", args.soil_card)
        for feature in SOIL_FEATURES:
            print(f"{feature}:", values[feature])

        return values

    return estimate_soil_values(args, location)


def parse_args():
    parser = argparse.ArgumentParser(description="Test the crop recommendation model.")
    parser.add_argument("--N", type=float, help="Nitrogen value")
    parser.add_argument("--P", type=float, help="Phosphorus value")
    parser.add_argument("--K", type=float, help="Potassium value")
    parser.add_argument("--temperature", type=float, help="Temperature in Celsius")
    parser.add_argument("--humidity", type=float, help="Humidity percentage")
    parser.add_argument("--ph", type=float, help="Soil pH value")
    parser.add_argument("--rainfall", type=float, help="Rainfall in mm")
    parser.add_argument(
        "--soil-card",
        help="Path to soil health card PDF/TXT/CSV/image for extracting N, P, K, and pH.",
    )
    parser.add_argument(
        "--manual-mode",
        choices=["auto", "simple"],
        default="auto",
        help="Manual input estimates N/P/K/pH from field details instead of asking for lab values.",
    )
    parser.add_argument(
        "--soil-type",
        choices=sorted(SOIL_DEFAULTS),
        help="Soil type for simple manual mode.",
    )
    parser.add_argument(
        "--is-clayey",
        choices=["yes", "no", "true", "false", "1", "0"],
        help="Whether the soil is clayey.",
    )
    parser.add_argument(
        "--soil-moisture",
        choices=["dry", "normal", "wet"],
        default=None,
        help="Current soil moisture observation.",
    )
    parser.add_argument(
        "--irrigation-regular",
        choices=["yes", "no", "true", "false", "1", "0"],
        help="Whether irrigation is regular in this field.",
    )
    parser.add_argument(
        "--previous-crop",
        help="Previous crop grown in this field, for example rice, maize, mungbean, or none.",
    )
    parser.add_argument(
        "--irrigation-mm",
        type=float,
        help="Irrigation already done or planned during the forecast window, in mm.",
    )
    parser.add_argument(
        "--planting-date",
        help="Future planting date in YYYY-MM-DD format. Defaults to today.",
    )
    parser.add_argument(
        "--auto-weather",
        action="store_true",
        help="Auto-fill temperature, humidity, rainfall, and weather type from location.",
    )
    parser.add_argument(
        "--weather-provider",
        choices=["auto", "openweather", "open-meteo", "kaggle-long-range"],
        default="auto",
        help=(
            "Weather provider. auto uses live forecasts when available and "
            "Kaggle long-range estimates for dates beyond live forecast limits."
        ),
    )
    parser.add_argument(
        "--weather-mode",
        choices=["forecast", "current"],
        default="forecast",
        help="Use forecasted weather or current weather for crop recommendation.",
    )
    parser.add_argument(
        "--forecast-days",
        type=int,
        default=5,
        help="Number of forecast days to use. OpenWeather supports up to 5 days.",
    )
    parser.add_argument(
        "--weather-api-key",
        help="OpenWeather API key. Prefer setting OPENWEATHER_API_KEY instead.",
    )
    parser.add_argument("--city", help="City name for weather lookup, for example: Mumbai")
    parser.add_argument("--latitude", type=float, help="Latitude for weather lookup")
    parser.add_argument("--longitude", type=float, help="Longitude for weather lookup")
    parser.add_argument(
        "--location-type",
        choices=["coastal", "inland", "mountain"],
        default="inland",
        help="Location type used by the trained Kaggle weather model.",
    )
    parser.add_argument(
        "--season",
        choices=["Winter", "Spring", "Summer", "Autumn"],
        help="Season used by the trained Kaggle weather model. Auto-detected by default.",
    )
    parser.add_argument(
        "--uv-index",
        type=float,
        help="UV index used by the trained Kaggle weather model. Estimated by default.",
    )
    parser.add_argument(
        "--compare-crop",
        help="Optional crop name to explain as a weaker or bad choice, for example: rice",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    weather = None
    location = None

    if args.auto_weather:
        location = get_location(args)
        soil_values = get_soil_values_from_user(args, location)
        weather = get_weather(location, args)

        print("\nAuto Weather Input")
        print("Location:", location["name"])
        print("Weather source:", weather["source"])
        print("Weather mode:", weather["mode"])
        if weather.get("forecast_days"):
            print("Forecast days:", weather["forecast_days"])
        if weather.get("start_date"):
            print("Forecast window:", weather["start_date"], "to", weather["end_date"])
        if weather.get("long_range_city"):
            print("Long-range model city:", weather["long_range_city"])
        if weather.get("forecast_points"):
            print("Forecast points used:", weather["forecast_points"])
        print("Temperature:", weather["temperature"], "C")
        print("Humidity:", weather["humidity"], "%")
        print("Rainfall used by model:", weather["rainfall"], "mm")
        print("Rainfall note:", weather["rainfall_note"])
        print("Provider weather type:", weather["weather_type"])

        weather_prediction, weather_top_predictions, weather_sample = predict_weather_type(
            weather,
            location,
            args,
        )

        print("\nKaggle Weather Model Input")
        print(weather_sample.to_string(index=False))

        print("\nTrained Weather Model Prediction:", weather_prediction)
        print("\nTop Weather Predictions:")
        for label, probability in weather_top_predictions:
            print(f"{label} -> {probability:.2f}%")

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
        if args.soil_card or args.manual_mode == "simple" or args.soil_type:
            soil_values = get_soil_values_from_user(args)
            weather_values = {}
            for feature in ["temperature", "humidity", "rainfall"]:
                value = getattr(args, feature)
                weather_values[feature] = value if value is not None else ask_value(feature)
            values = [
                soil_values["N"],
                soil_values["P"],
                soil_values["K"],
                weather_values["temperature"],
                weather_values["humidity"],
                soil_values["ph"],
                weather_values["rainfall"],
            ]
        else:
            values = [getattr(args, feature) for feature in FEATURES]

    if not args.auto_weather and any(value is None for value in values):
        values = get_values_from_user()

    model = load_model()
    sample = pd.DataFrame([values], columns=FEATURES)

    prediction = model.predict(sample)[0]
    probabilities = model.predict_proba(sample)[0]
    classes = model.classes_
    top_indices = np.argsort(probabilities)[-3:][::-1]
    top_predictions = [
        (classes[index], probabilities[index] * 100)
        for index in top_indices
    ]
    input_values = {
        feature: float(value)
        for feature, value in zip(FEATURES, values)
    }

    print("\nRecommended Crop:", prediction)
    print("\nTop 3 Recommendations:")
    for crop, probability in top_predictions:
        print(f"{crop} -> {probability:.2f}%")

    print_recommendation_explanation(
        prediction,
        top_predictions,
        input_values,
        args.compare_crop,
    )

    if location is not None:
        print_crop_duration_weather_outlook(prediction, location, args)

    weather_context = weather if weather is not None else {"rainfall": input_values["rainfall"]}
    print_irrigation_advice(prediction, weather_context, args)
    print_harvest_window(prediction, args)


if __name__ == "__main__":
    main()
