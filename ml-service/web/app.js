const sessionStorageKey = "krishimitra-user-id";

const state = {
  sessionId: "",
  mode: "simple",
  selectedSoil: "red",
  selectedWater: "yes",
  selectedTime: "now",
  latitude: null,
  longitude: null,
  activePredictionId: null,
  locationType: "inland",
};

const elements = {
  landingView: document.getElementById("landingView"),
  modeView: document.getElementById("modeView"),
  formView: document.getElementById("formView"),
  startBtn: document.getElementById("startBtn"),
  backToLandingBtn: document.getElementById("backToLandingBtn"),
  backToModeBtn: document.getElementById("backToModeBtn"),
  simpleModeCard: document.getElementById("simpleModeCard"),
  advancedModeCard: document.getElementById("advancedModeCard"),
  continueModeBtn: document.getElementById("continueModeBtn"),
  modePill: document.getElementById("modePill"),
  formTitle: document.getElementById("formTitle"),
  formSubtitle: document.getElementById("formSubtitle"),
  simpleSoilSection: document.getElementById("simpleSoilSection"),
  advancedUploadSection: document.getElementById("advancedUploadSection"),
  useLocationBtn: document.getElementById("useLocationBtn"),
  districtInput: document.getElementById("districtInput"),
  locationStatus: document.getElementById("locationStatus"),
  soilCardInput: document.getElementById("soilCardInput"),
  soilCardName: document.getElementById("soilCardName"),
  cultivationDateInput: document.getElementById("cultivationDateInput"),
  irrigationMmInput: document.getElementById("irrigationMmInput"),
  previousCropSelect: document.getElementById("previousCropSelect"),
  predictionForm: document.getElementById("predictionForm"),
  submitButton: document.getElementById("submitButton"),
  statusMessage: document.getElementById("statusMessage"),
  resultSection: document.getElementById("resultSection"),
  resultContent: document.getElementById("resultContent"),
  refreshHistoryBtn: document.getElementById("refreshHistoryBtn"),
  historyStatus: document.getElementById("historyStatus"),
  historyList: document.getElementById("historyList"),
  soilCards: Array.from(document.querySelectorAll("[data-soil]")),
  waterCards: Array.from(document.querySelectorAll("[data-water]")),
  timeCards: Array.from(document.querySelectorAll("[data-time]")),
  languageChips: Array.from(document.querySelectorAll(".language-chip")),
};

document.addEventListener("DOMContentLoaded", () => {
  initialiseSession();
  initialiseInteractions();
  initialiseDefaults();
  renderMode();
  renderSelections();
  loadHistory();
});

function initialiseSession() {
  const existingId = window.localStorage.getItem(sessionStorageKey);
  state.sessionId = existingId || createSessionId();
  window.localStorage.setItem(sessionStorageKey, state.sessionId);
}

function initialiseInteractions() {
  elements.startBtn.addEventListener("click", () => showView("mode"));
  elements.backToLandingBtn.addEventListener("click", () => showView("landing"));
  elements.backToModeBtn.addEventListener("click", () => showView("mode"));

  elements.simpleModeCard.addEventListener("click", () => setMode("simple"));
  elements.advancedModeCard.addEventListener("click", () => setMode("advanced"));
  elements.continueModeBtn.addEventListener("click", () => showView("form"));

  elements.languageChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      elements.languageChips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
    });
  });

  elements.useLocationBtn.addEventListener("click", useCurrentLocation);
  elements.predictionForm.addEventListener("submit", handleSubmit);
  elements.refreshHistoryBtn.addEventListener("click", loadHistory);

  elements.soilCardInput?.addEventListener("change", () => {
    const file = elements.soilCardInput.files?.[0];
    elements.soilCardName.textContent = file ? file.name : "No file selected";
  });

  elements.soilCards.forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedSoil = card.dataset.soil;
      renderSelections();
    });
  });

  elements.waterCards.forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedWater = card.dataset.water;
      renderSelections();
    });
  });

  elements.timeCards.forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedTime = card.dataset.time;
      applyTimePreset(state.selectedTime);
      renderSelections();
    });
  });
}

function initialiseDefaults() {
  applyTimePreset("now");
}

function createSessionId() {
  const suffix = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `farmer-${suffix}`;
}

function showView(view) {
  elements.landingView.hidden = view !== "landing";
  elements.modeView.hidden = view !== "mode";
  elements.formView.hidden = view !== "form";
}

function setMode(mode) {
  state.mode = mode;
  renderMode();
}

function renderMode() {
  const simple = state.mode === "simple";

  elements.simpleModeCard.classList.toggle("selected", simple);
  elements.advancedModeCard.classList.toggle("selected", !simple);

  elements.continueModeBtn.textContent = simple
    ? "Continue with Simple Mode"
    : "Continue with Advanced Mode";

  elements.modePill.textContent = simple ? "Simple Mode" : "Advanced Mode";
  elements.formTitle.textContent = simple
    ? "Tell us about your farm"
    : "Upload your soil card";
  elements.formSubtitle.textContent = simple
    ? "The original hackathon form style is preserved while the trained backend handles the prediction."
    : "Use your soil health card and the same trained backend will fill in the nutrient values for you.";

  elements.simpleSoilSection.hidden = !simple;
  elements.advancedUploadSection.hidden = simple;
}

function renderSelections() {
  elements.soilCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.soil === state.selectedSoil);
  });

  elements.waterCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.water === state.selectedWater);
  });

  elements.timeCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.time === state.selectedTime);
  });
}

function applyTimePreset(timeKey) {
  const date = new Date();

  if (timeKey === "1-month") {
    date.setDate(date.getDate() + 30);
  } else if (timeKey === "2-3-months") {
    date.setDate(date.getDate() + 75);
  }

  elements.cultivationDateInput.value = date.toISOString().slice(0, 10);
}

async function useCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported in this browser.", true);
    return;
  }

  elements.useLocationBtn.disabled = true;
  elements.locationStatus.textContent = "Detecting your current location...";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      state.latitude = position.coords.latitude;
      state.longitude = position.coords.longitude;

      try {
        const location = await requestJson(
          `/location/reverse?latitude=${encodeURIComponent(state.latitude)}&longitude=${encodeURIComponent(state.longitude)}`,
          { method: "GET" },
        );

        const label = location.area || location.city || location.display_name || "";
        const city = location.city || label;

        elements.districtInput.value = label;
        state.locationType = inferLocationType(location);
        elements.locationStatus.textContent = city
          ? `Current location detected: ${city}`
          : "Current coordinates captured. You can still type your city manually.";
      } catch (error) {
        elements.districtInput.value = `${state.latitude.toFixed(4)}, ${state.longitude.toFixed(4)}`;
        state.locationType = "inland";
        elements.locationStatus.textContent =
          "Coordinates captured, but place lookup failed. You can still continue or type your city manually.";
      } finally {
        elements.useLocationBtn.disabled = false;
      }
    },
    (error) => {
      elements.useLocationBtn.disabled = false;
      elements.locationStatus.textContent = `Location permission failed: ${error.message}`;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000,
    },
  );
}

function inferLocationType(location) {
  const coastalHints = [
    "mumbai",
    "goa",
    "chennai",
    "kochi",
    "mangalore",
    "visakhapatnam",
    "kolkata",
    "pondicherry",
    "kerala",
    "coast",
  ];
  const mountainHints = [
    "shimla",
    "darjeeling",
    "dehradun",
    "sikkim",
    "manali",
    "uttarakhand",
    "himachal",
    "mountain",
  ];
  const haystack = [
    location.area,
    location.city,
    location.state,
    location.display_name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (coastalHints.some((hint) => haystack.includes(hint))) {
    return "coastal";
  }

  if (mountainHints.some((hint) => haystack.includes(hint))) {
    return "mountain";
  }

  return "inland";
}

async function handleSubmit(event) {
  event.preventDefault();

  setStatus("Running prediction...", false);
  elements.submitButton.disabled = true;

  try {
    const document = state.mode === "advanced"
      ? await submitAdvancedMode()
      : await submitSimpleMode();

    state.activePredictionId = document.id;
    renderPrediction(document);
    await loadHistory();
    setStatus(`Prediction saved successfully as ${document.id}.`, false);
  } catch (error) {
    setStatus(error.message || "Prediction failed.", true);
  } finally {
    elements.submitButton.disabled = false;
  }
}

async function submitSimpleMode() {
  const payload = buildCommonPayload();
  payload.soil_type = state.selectedSoil;
  payload.is_clayey = state.selectedSoil === "clayey" ? "yes" : "no";

  return requestJson("/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

async function submitAdvancedMode() {
  const file = elements.soilCardInput.files?.[0];
  if (!file) {
    throw new Error("Please choose a soil health card file first.");
  }

  const payload = buildCommonPayload();
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });
  formData.append("soil_card", file);

  return requestJson("/predictions/soil-card", {
    method: "POST",
    body: formData,
  });
}

function buildCommonPayload() {
  const city = elements.districtInput.value.trim();
  const previousCrop = elements.previousCropSelect.value.trim();
  const hasRegularWater = state.selectedWater === "yes";

  return {
    user_id: state.sessionId,
    manual_mode: "auto",
    city: city || null,
    latitude: state.latitude,
    longitude: state.longitude,
    location_type: state.locationType,
    soil_moisture: hasRegularWater ? "normal" : "dry",
    irrigation_regular: hasRegularWater ? "yes" : "no",
    irrigation_mm: elements.irrigationMmInput.value.trim() || (hasRegularWater ? 25 : 0),
    previous_crop: previousCrop || "none",
    planting_date: elements.cultivationDateInput.value,
    auto_weather: true,
    weather_provider: "auto",
    weather_mode: "forecast",
    forecast_days: 5,
    compare_crop: previousCrop || null,
  };
}

async function loadHistory() {
  elements.historyStatus.textContent = "Loading saved predictions...";

  try {
    const documents = await requestJson(
      `/predictions?user_id=${encodeURIComponent(state.sessionId)}&limit=8`,
      { method: "GET" },
    );

    if (!Array.isArray(documents) || documents.length === 0) {
      elements.historyList.innerHTML = '<div class="history-empty">No saved recommendations yet on this device.</div>';
      elements.historyStatus.textContent = "Nothing saved yet.";
      return;
    }

    elements.historyStatus.textContent = `${documents.length} saved recommendation${documents.length === 1 ? "" : "s"}`;
    elements.historyList.innerHTML = documents.map(renderHistoryCard).join("");

    elements.historyList.querySelectorAll("[data-prediction-id]").forEach((button) => {
      button.addEventListener("click", async () => {
        try {
          const predictionId = button.dataset.predictionId;
          const document = await requestJson(`/predictions/${predictionId}`, { method: "GET" });
          state.activePredictionId = predictionId;
          renderPrediction(document);
          highlightActiveHistoryCard();
        } catch (error) {
          setStatus(error.message || "Could not load that saved recommendation.", true);
        }
      });
    });

    highlightActiveHistoryCard();
  } catch (error) {
    elements.historyStatus.textContent = "Could not load saved history.";
    elements.historyList.innerHTML = `<div class="history-empty">${escapeHtml(error.message || "Unknown error")}</div>`;
  }
}

function renderHistoryCard(document) {
  const crop = titleCase(document?.prediction?.crop_prediction?.recommended_crop || "Unknown");
  const weather = document?.prediction?.weather?.forecast?.weather_type
    || document?.prediction?.weather?.trained_weather_prediction
    || "Weather pending";
  const date = document?.created_at ? formatDateTime(document.created_at) : "Unknown time";

  return `
    <button class="history-card" type="button" data-prediction-id="${escapeHtml(document.id)}">
      <strong>${escapeHtml(crop)}</strong>
      <div class="history-card-meta">${escapeHtml(date)}</div>
      <div class="history-card-meta">${escapeHtml(weather)}</div>
    </button>
  `;
}

function highlightActiveHistoryCard() {
  elements.historyList.querySelectorAll(".history-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.predictionId === state.activePredictionId);
  });
}

function renderPrediction(document) {
  const prediction = document.prediction || {};
  const cropPrediction = prediction.crop_prediction || {};
  const weather = prediction.weather || {};
  const forecast = weather.forecast || {};
  const irrigation = prediction.irrigation || {};
  const harvest = prediction.harvest || {};
  const duration = prediction.duration_weather_outlook || {};
  const durationSummary = duration.summary || {};

  elements.resultSection.hidden = false;
  elements.resultContent.innerHTML = `
    <div class="result-hero-card">
      <h3>${escapeHtml(titleCase(cropPrediction.recommended_crop || "Unknown crop"))}</h3>
      <p class="result-subcopy">
        Saved as ${escapeHtml(document.id)} on ${escapeHtml(formatDateTime(document.created_at))}
      </p>
      <div class="result-meta-row">
        <span class="result-meta-pill">${escapeHtml(forecast.weather_type || weather.trained_weather_prediction || "Weather pending")}</span>
        <span class="result-meta-pill">${escapeHtml(forecast.source || "Forecast source pending")}</span>
        <span class="result-meta-pill">${escapeHtml(formatHarvest(harvest))}</span>
      </div>
    </div>

    <div class="result-grid">
      <div class="result-card">
        <h4>Why this crop fits</h4>
        ${renderList(cropPrediction.strengths, "No fit notes returned.")}
        ${renderHighlight("Things to watch", cropPrediction.watchouts, "warn")}
      </div>

      <div class="result-card">
        <h4>Top crop probabilities</h4>
        ${renderProbabilityList(cropPrediction.top_predictions)}
      </div>

      <div class="result-card">
        <h4>Weather and irrigation</h4>
        <ul class="weather-list">
          <li>Temperature: ${escapeHtml(formatMetric(forecast.temperature, "C"))}</li>
          <li>Humidity: ${escapeHtml(formatMetric(forecast.humidity, "%"))}</li>
          <li>Rainfall: ${escapeHtml(formatMetric(forecast.rainfall, "mm"))}</li>
          <li>Water advice: ${escapeHtml(irrigation.advice || "No irrigation advice returned.")}</li>
        </ul>
      </div>

      <div class="result-card">
        <h4>Expected harvest</h4>
        <ul class="weather-list">
          <li>Planting date: ${escapeHtml(harvest.planting_date || "Unknown")}</li>
          <li>Harvest start: ${escapeHtml(harvest.harvest_start || "Unknown")}</li>
          <li>Harvest end: ${escapeHtml(harvest.harvest_end || "Unknown")}</li>
          <li>Approximate duration: ${escapeHtml(formatMetric(harvest.duration_days, "days"))}</li>
        </ul>
      </div>

      <div class="result-card">
        <h4>Full crop duration weather</h4>
        <ul class="weather-list">
          <li>Window: ${escapeHtml(durationSummary.start_date || "Unknown")} to ${escapeHtml(durationSummary.end_date || "Unknown")}</li>
          <li>Average temperature: ${escapeHtml(formatMetric(durationSummary.temperature, "C"))}</li>
          <li>Average humidity: ${escapeHtml(formatMetric(durationSummary.humidity, "%"))}</li>
          <li>Total rainfall: ${escapeHtml(formatMetric(durationSummary.rainfall, "mm"))}</li>
        </ul>
        ${renderHighlight("Season notes", duration.fit?.watchouts || [], "warn")}
      </div>

      <div class="result-card">
        <h4>Why another crop is weaker</h4>
        ${renderAlternatives(cropPrediction)}
      </div>
    </div>
  `;
}

function renderProbabilityList(items) {
  if (!items || items.length === 0) {
    return '<div class="result-highlight">No probability breakdown available.</div>';
  }

  return `
    <div class="probability-list">
      ${items.map((item) => {
        const label = titleCase(item.crop || item.label || "Unknown");
        const probability = Math.max(0, Math.min(100, Number(item.probability || 0)));
        return `
          <div class="probability-row">
            <div class="probability-label">
              <span>${escapeHtml(label)}</span>
              <span>${escapeHtml(probability.toFixed(2))}%</span>
            </div>
            <div class="probability-track">
              <div class="probability-fill" style="width:${probability}%"></div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderAlternatives(cropPrediction) {
  if (cropPrediction.compared_crop) {
    return renderHighlight(
      titleCase(cropPrediction.compared_crop.crop),
      cropPrediction.compared_crop.reasons,
      "warn",
    );
  }

  if (!cropPrediction.alternatives || cropPrediction.alternatives.length === 0) {
    return '<div class="result-highlight">No weaker alternative notes were returned.</div>';
  }

  return cropPrediction.alternatives
    .map((item) => renderHighlight(titleCase(item.crop), item.reasons, "warn"))
    .join("");
}

function renderHighlight(title, items, kind = "") {
  if (!items || items.length === 0) {
    return "";
  }

  return `
    <div class="result-highlight ${kind}">
      <strong>${escapeHtml(title)}</strong>
      ${renderList(items, "")}
    </div>
  `;
}

function renderList(items, emptyMessage) {
  if (!items || items.length === 0) {
    return emptyMessage ? `<div class="result-highlight">${escapeHtml(emptyMessage)}</div>` : "";
  }

  return `<ul class="insight-list">${items.map((item) => `<li>${escapeHtml(String(item))}</li>`).join("")}</ul>`;
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.detail || "Request failed.");
  }

  return payload;
}

function setStatus(message, isError) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.toggle("error", Boolean(isError));
}

function formatMetric(value, unit) {
  if (value === null || value === undefined || value === "") {
    return "Unknown";
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return String(value);
  }

  const formatted = Math.abs(numeric) >= 100 ? numeric.toFixed(0) : numeric.toFixed(2);
  return unit ? `${formatted} ${unit}` : formatted;
}

function formatHarvest(harvest) {
  if (!harvest?.harvest_start || !harvest?.harvest_end) {
    return "Harvest window pending";
  }

  return `${harvest.harvest_start} to ${harvest.harvest_end}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function titleCase(value) {
  return String(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
