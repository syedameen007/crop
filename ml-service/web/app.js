const sessionStorageKey = "krishimitra-user-id";
const languageStorageKey = "krishimitra-language";

const translations = {
  en: {
    common: {
      back: "Go back",
    },
    languageNames: {
      en: "English",
      kn: "Kannada",
      hi: "Hindi",
    },
    landing: {
      subtitle: "Smart crop decisions made simple",
      chips: {
        soil: "Soil-aware",
        weather: "Weather smart",
        easy: "Easy to use",
      },
      chooseLanguage: "CHOOSE YOUR LANGUAGE",
      start: "Start Recommendation",
      footer: "Free | No registration | Works with saved history",
    },
    mode: {
      header: "Smart Farming",
      heading: "How would you like to proceed?",
      subheading: "Choose what fits you best. You can change this anytime.",
      simple: {
        title: "Simple Mode",
        description: "No soil report needed. Answer quick questions and get crop advice.",
        badge: "Recommended",
        time: "Takes about 1 minute",
      },
      advanced: {
        title: "Advanced Mode",
        description: "Upload your soil health card for more accurate suggestions from the trained model.",
        time: "Needs soil report",
      },
      info: "Both modes use your trained crop model, weather outlook, irrigation checks, and saved prediction history.",
      continueSimple: "Continue with Simple Mode",
      continueAdvanced: "Continue with Advanced Mode",
    },
    form: {
      header: "Smart Farming",
      simpleTitle: "Tell us about your farm",
      simpleSubtitle: "Answer simply. The recommendation engine and MongoDB history are already connected underneath.",
      advancedTitle: "Upload your soil card",
      advancedSubtitle: "Use your soil health card and the same trained backend will fill in the nutrient values for you.",
      simpleMode: "Simple Mode",
      advancedMode: "Advanced Mode",
      sessionSaved: "Saved on this device",
      districtTitle: "Your district",
      useLocation: "Use Current Location",
      districtPlaceholder: "Your area or city will appear here",
      locationHelp: "Use current location to auto-fill your area, or type your city manually.",
      soilTitle: "What does your soil look like?",
      soil: {
        redTitle: "Red soil",
        redDesc: "Reddish, common in dry areas",
        blackTitle: "Black soil",
        blackDesc: "Dark and rich, holds moisture longer",
        sandyTitle: "Sandy soil",
        sandyDesc: "Loose, drains quickly",
        clayTitle: "Clay soil",
        clayDesc: "Heavy, sticky, and water-holding",
      },
      uploadTitle: "Upload soil health card",
      uploadCardTitle: "Choose soil card",
      noFileSelected: "No file selected",
      waterTitle: "Do you have regular water for farming?",
      water: {
        yesTitle: "Yes, regular water",
        yesDesc: "Borewell, canal, or drip irrigation",
        rainTitle: "No, depends on rainfall",
        rainDesc: "Mainly rain-fed farming",
      },
      timeTitle: "When do you want to start farming?",
      time: {
        nowTitle: "Now",
        nowDesc: "Immediately",
        monthTitle: "1 month",
        monthDesc: "Soon",
        laterTitle: "2-3 months",
        laterDesc: "Later",
      },
      irrigationPlaceholder: "Planned irrigation in mm (optional)",
      previousCropTitle: "Previous crop (optional)",
      previousCropPlaceholder: "Select if you remember",
      continue: "Continue",
      newRecommendation: "New Recommendation",
    },
    analysis: {
      header: "Smart Farming",
      title: "Recommendation analysis",
      subtitle: "Review the crop suggestion, reasons, full-season weather outlook, and saved prediction history on a separate page.",
      pill: "Analysis Page",
      resultTitle: "Recommendation Result",
      historyTitle: "Saved recommendations",
      historyCount: "{{count}} saved recommendations",
      refresh: "Refresh",
      heroSaved: "Saved as {{id}} on {{date}}",
      sections: {
        whyFit: "Why this crop fits",
        watch: "Things to watch",
        topProbabilities: "Top crop probabilities",
        weatherIrrigation: "Weather and irrigation",
        expectedHarvest: "Expected harvest",
        fullDuration: "Full crop duration weather",
        seasonNotes: "Season notes",
        whyWeaker: "Why another crop is weaker",
      },
      labels: {
        temperature: "Temperature",
        humidity: "Humidity",
        rainfall: "Rainfall",
        waterAdvice: "Water advice",
        plantingDate: "Planting date",
        harvestStart: "Harvest start",
        harvestEnd: "Harvest end",
        approxDuration: "Approximate duration",
        window: "Window",
        avgTemperature: "Average temperature",
        avgHumidity: "Average humidity",
        totalRainfall: "Total rainfall",
      },
      empty: {
        noFitNotes: "No fit notes returned.",
        noProbability: "No probability breakdown available.",
        noWeaker: "No weaker alternative notes were returned.",
        noHistory: "No saved recommendations yet on this device.",
      },
      pending: {
        weather: "Weather pending",
        forecastSource: "Forecast source pending",
        harvest: "Harvest window pending",
        unknown: "Unknown",
        noIrrigationAdvice: "No irrigation advice returned.",
      },
    },
    status: {
      geolocationUnsupported: "Geolocation is not supported in this browser.",
      detectingLocation: "Detecting your current location...",
      locationDetected: "Current location detected: {{city}}",
      locationLookupFailed: "Coordinates captured, but place lookup failed. You can still continue or type your city manually.",
      locationPermissionFailed: "Location permission failed: {{message}}",
      runningPrediction: "Running prediction...",
      chooseSoilCard: "Please choose a soil health card file first.",
      predictionSaved: "Prediction saved successfully as {{id}}.",
      predictionFailed: "Prediction failed.",
      loadingHistory: "Loading saved predictions...",
      nothingSaved: "Nothing saved yet.",
      historyLoadFailed: "Could not load saved history.",
      recommendationLoadFailed: "Could not load that saved recommendation.",
    },
    previousCrops: {
      "": "Select if you remember",
      rice: "Rice",
      wheat: "Wheat",
      cotton: "Cotton",
      ragi: "Ragi",
      maize: "Maize",
      mungbean: "Mungbean",
      chickpea: "Chickpea",
      none: "None",
    },
    crops: {
      rice: "Rice",
      maize: "Maize",
      chickpea: "Chickpea",
      kidneybeans: "Kidneybeans",
      pigeonpeas: "Pigeonpeas",
      mothbeans: "Mothbeans",
      mungbean: "Mungbean",
      blackgram: "Blackgram",
      lentil: "Lentil",
      pomegranate: "Pomegranate",
      banana: "Banana",
      mango: "Mango",
      grapes: "Grapes",
      watermelon: "Watermelon",
      muskmelon: "Muskmelon",
      apple: "Apple",
      orange: "Orange",
      papaya: "Papaya",
      coconut: "Coconut",
      cotton: "Cotton",
      jute: "Jute",
      coffee: "Coffee",
      ragi: "Ragi",
      wheat: "Wheat",
      none: "None",
    },
    weatherLabels: {
      Cloudy: "Cloudy",
      Sunny: "Sunny",
      Snowy: "Snowy",
      Rainy: "Rainy",
      "Rainy historical pattern": "Rainy historical pattern",
      "Open-Meteo current weather": "Open-Meteo current weather",
      "OpenWeather current weather": "OpenWeather current weather",
      "Kaggle historical-pattern long-range weather model": "Kaggle historical-pattern long-range weather model",
    },
    dynamic: {
      match: "{{feature}} is {{value}}, inside the common {{min}} to {{max}} range seen in the crop dataset",
      concern: "{{feature}} is {{value}}, which is too {{direction}} for {{crop}}; its common dataset range is {{min}} to {{max}}",
      tooHigh: "high",
      tooLow: "low",
      irrigation: {
        tooMuch: "Irrigation may be too much; avoid extra watering and check drainage.",
        proper: "Irrigation looks proper for the planting window.",
        adequate: "Forecast rainfall looks adequate; irrigate only if soil dries.",
        tooWet: "Do not add irrigation now; focus on drainage.",
      },
    },
    features: {
      nitrogen: "nitrogen",
      phosphorus: "phosphorus",
      potassium: "potassium",
      temperature: "temperature",
      humidity: "humidity",
      rainfall: "rainfall",
      "soil pH": "soil pH",
    },
  },
  kn: {
    common: {
      back: "ಹಿಂದೆ ಹೋಗಿ",
    },
    languageNames: {
      en: "English",
      kn: "ಕನ್ನಡ",
      hi: "हिंदी",
    },
    landing: {
      subtitle: "ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ನಿರ್ಧಾರಗಳನ್ನು ಸುಲಭಗೊಳಿಸಿ",
      chips: {
        soil: "ಮಣ್ಣಿಗೆ ಹೊಂದುವದು",
        weather: "ಹವಾಮಾನ ತಿಳಿವು",
        easy: "ಬಳಸಲು ಸುಲಭ",
      },
      chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
      start: "ಶಿಫಾರಸು ಪ್ರಾರಂಭಿಸಿ",
      footer: "ಉಚಿತ | ನೋಂದಣಿ ಬೇಡ | ಉಳಿಸಿದ ಇತಿಹಾಸದೊಂದಿಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    },
    mode: {
      header: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ",
      heading: "ನೀವು ಹೇಗೆ ಮುಂದುವರಿಯಲು ಬಯಸುತ್ತೀರಿ?",
      subheading: "ನಿಮಗೆ ಸೂಕ್ತವಾದುದನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಬೇಕಾದಾಗ ಬದಲಿಸಬಹುದು.",
      simple: {
        title: "ಸರಳ ವಿಧಾನ",
        description: "ಮಣ್ಣಿನ ವರದಿ ಬೇಡ. ಕೆಲವು ಸರಳ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ ಬೆಳೆ ಸಲಹೆ ಪಡೆಯಿರಿ.",
        badge: "ಶಿಫಾರಸು",
        time: "ಸುಮಾರು 1 ನಿಮಿಷ",
      },
      advanced: {
        title: "ಸುಧಾರಿತ ವಿಧಾನ",
        description: "ಹೆಚ್ಚು ನಿಖರ ಸಲಹೆಗಾಗಿ ನಿಮ್ಮ ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ.",
        time: "ಮಣ್ಣಿನ ವರದಿ ಬೇಕು",
      },
      info: "ಎರಡೂ ವಿಧಾನಗಳು ತರಬೇತಿ ಪಡೆದ ಬೆಳೆ ಮಾದರಿ, ಹವಾಮಾನ ದೃಷ್ಟಿಕೋನ, ನೀರಾವರಿ ಪರಿಶೀಲನೆ ಮತ್ತು ಉಳಿಸಿದ ಇತಿಹಾಸವನ್ನು ಬಳಸುತ್ತವೆ.",
      continueSimple: "ಸರಳ ವಿಧಾನದಿಂದ ಮುಂದುವರಿಸಿ",
      continueAdvanced: "ಸುಧಾರಿತ ವಿಧಾನದಿಂದ ಮುಂದುವರಿಸಿ",
    },
    form: {
      header: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ",
      simpleTitle: "ನಿಮ್ಮ ಜಮೀನಿನ ಬಗ್ಗೆ ತಿಳಿಸಿ",
      simpleSubtitle: "ಸರಳವಾಗಿ ಉತ್ತರಿಸಿ. ಶಿಫಾರಸು ಎಂಜಿನ್ ಮತ್ತು MongoDB ಇತಿಹಾಸ ಈಗಾಗಲೇ ಸಂಪರ್ಕಗೊಂಡಿವೆ.",
      advancedTitle: "ನಿಮ್ಮ ಮಣ್ಣಿನ ಕಾರ್ಡ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
      advancedSubtitle: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಬಳಸಿ ಅದೇ ತರಬೇತಿ ಪಡೆದ ಬ್ಯಾಕೆಂಡ್ ಪೋಷಕಾಂಶ ಮೌಲ್ಯಗಳನ್ನು ತುಂಬುತ್ತದೆ.",
      simpleMode: "ಸರಳ ವಿಧಾನ",
      advancedMode: "ಸುಧಾರಿತ ವಿಧಾನ",
      sessionSaved: "ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ",
      districtTitle: "ನಿಮ್ಮ ಪ್ರದೇಶ",
      useLocation: "ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ",
      districtPlaceholder: "ನಿಮ್ಮ ಪ್ರದೇಶ ಅಥವಾ ನಗರ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ",
      locationHelp: "ಪ್ರಸ್ತುತ ಸ್ಥಳದಿಂದ ಪ್ರದೇಶವನ್ನು ತುಂಬಿ ಅಥವಾ ನಗರವನ್ನು ಕೈಯಾರೆ ನಮೂದಿಸಿ.",
      soilTitle: "ನಿಮ್ಮ ಮಣ್ಣು ಹೇಗೆ ಕಾಣುತ್ತದೆ?",
      soil: {
        redTitle: "ಕೆಂಪು ಮಣ್ಣು",
        redDesc: "ಕೆಂಪು ಬಣ್ಣದ, ಒಣ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸಾಮಾನ್ಯ",
        blackTitle: "ಕಪ್ಪು ಮಣ್ಣು",
        blackDesc: "ಗಾಢ ಬಣ್ಣದ, ಹೆಚ್ಚು ತೇವ ಉಳಿಸಿಕೊಳ್ಳುತ್ತದೆ",
        sandyTitle: "ಮರಳು ಮಣ್ಣು",
        sandyDesc: "ಸಡಿಲ, ನೀರು ಬೇಗ ಹೊರಹೋಗುತ್ತದೆ",
        clayTitle: "ಜೇಡಿ ಮಣ್ಣು",
        clayDesc: "ಭಾರಿ, ಅಂಟುವ, ನೀರನ್ನು ಹಿಡಿದುಕೊಳ್ಳುತ್ತದೆ",
      },
      uploadTitle: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
      uploadCardTitle: "ಮಣ್ಣಿನ ಕಾರ್ಡ್ ಆಯ್ಕೆ ಮಾಡಿ",
      noFileSelected: "ಯಾವ ಫೈಲೂ ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ",
      waterTitle: "ಕೃಷಿಗಾಗಿ ನಿಯಮಿತ ನೀರು ಇದೆಯೆ?",
      water: {
        yesTitle: "ಹೌದು, ನಿಯಮಿತ ನೀರು",
        yesDesc: "ಬೋರ್‌ವೆಲ್, ಕಾಲುವೆ ಅಥವಾ ಡ್ರಿಪ್ ನೀರಾವರಿ",
        rainTitle: "ಇಲ್ಲ, ಮಳೆಯ ಮೇಲೆ ಅವಲಂಬನೆ",
        rainDesc: "ಮುಖ್ಯವಾಗಿ ಮಳೆಯಾಧಾರಿತ ಕೃಷಿ",
      },
      timeTitle: "ನೀವು ಕೃಷಿ ಯಾವಾಗ ಆರಂಭಿಸಲು ಬಯಸುತ್ತೀರಿ?",
      time: {
        nowTitle: "ಈಗ",
        nowDesc: "ತಕ್ಷಣ",
        monthTitle: "1 ತಿಂಗಳು",
        monthDesc: "ಶೀಘ್ರದಲ್ಲೇ",
        laterTitle: "2-3 ತಿಂಗಳು",
        laterDesc: "ನಂತರ",
      },
      irrigationPlaceholder: "ಯೋಜಿತ ನೀರಾವರಿ ಮಿಮೀ (ಐಚ್ಛಿಕ)",
      previousCropTitle: "ಹಿಂದಿನ ಬೆಳೆ (ಐಚ್ಛಿಕ)",
      previousCropPlaceholder: "ಗೊತ್ತಿದ್ದರೆ ಆಯ್ಕೆ ಮಾಡಿ",
      continue: "ಮುಂದುವರಿಸಿ",
      newRecommendation: "ಹೊಸ ಶಿಫಾರಸು",
    },
    analysis: {
      header: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ",
      title: "ಶಿಫಾರಸು ವಿಶ್ಲೇಷಣೆ",
      subtitle: "ಬೆಳೆ ಸಲಹೆ, ಕಾರಣಗಳು, ಸಂಪೂರ್ಣ ಹಂಗಾಮಿನ ಹವಾಮಾನ ದೃಷ್ಟಿಕೋನ ಮತ್ತು ಉಳಿಸಿದ ಇತಿಹಾಸವನ್ನು ಪ್ರತ್ಯೇಕ ಪುಟದಲ್ಲಿ ನೋಡಿ.",
      pill: "ವಿಶ್ಲೇಷಣೆ ಪುಟ",
      resultTitle: "ಶಿಫಾರಸು ಫಲಿತಾಂಶ",
      historyTitle: "ಉಳಿಸಿದ ಶಿಫಾರಸುಗಳು",
      historyCount: "{{count}} ಉಳಿಸಿದ ಶಿಫಾರಸುಗಳು",
      refresh: "ಮತ್ತೆ ಲೋಡ್ ಮಾಡಿ",
      heroSaved: "{{date}} ರಂದು {{id}} ಎಂದು ಉಳಿಸಲಾಗಿದೆ",
      sections: {
        whyFit: "ಈ ಬೆಳೆ ಯಾಕೆ ಹೊಂದುತ್ತದೆ",
        watch: "ಗಮನಿಸಬೇಕಾದವು",
        topProbabilities: "ಮುಖ್ಯ ಬೆಳೆ ಸಾಧ್ಯತೆಗಳು",
        weatherIrrigation: "ಹವಾಮಾನ ಮತ್ತು ನೀರಾವರಿ",
        expectedHarvest: "ಅಂದಾಜು ಕಟಾವು",
        fullDuration: "ಪೂರ್ಣ ಬೆಳೆ ಅವಧಿಯ ಹವಾಮಾನ",
        seasonNotes: "ಹಂಗಾಮಿನ ಟಿಪ್ಪಣಿಗಳು",
        whyWeaker: "ಇನ್ನೊಂದು ಬೆಳೆ ಯಾಕೆ ದುರ್ಬಲ ಆಯ್ಕೆ",
      },
      labels: {
        temperature: "ತಾಪಮಾನ",
        humidity: "ಆರ್ದ್ರತೆ",
        rainfall: "ಮಳೆ",
        waterAdvice: "ನೀರಾವರಿ ಸಲಹೆ",
        plantingDate: "ನೆಡುವ ದಿನಾಂಕ",
        harvestStart: "ಕಟಾವು ಪ್ರಾರಂಭ",
        harvestEnd: "ಕಟಾವು ಅಂತ್ಯ",
        approxDuration: "ಅಂದಾಜು ಅವಧಿ",
        window: "ಅವಧಿ",
        avgTemperature: "ಸರಾಸರಿ ತಾಪಮಾನ",
        avgHumidity: "ಸರಾಸರಿ ಆರ್ದ್ರತೆ",
        totalRainfall: "ಒಟ್ಟು ಮಳೆ",
      },
      empty: {
        noFitNotes: "ಹೊಂದಾಣಿಕೆ ಟಿಪ್ಪಣಿಗಳು ಲಭ್ಯವಿಲ್ಲ.",
        noProbability: "ಸಾಧ್ಯತೆ ವಿವರ ಲಭ್ಯವಿಲ್ಲ.",
        noWeaker: "ದುರ್ಬಲ ಪರ್ಯಾಯದ ಟಿಪ್ಪಣಿಗಳು ಲಭ್ಯವಿಲ್ಲ.",
        noHistory: "ಈ ಸಾಧನದಲ್ಲಿ ಉಳಿಸಿದ ಶಿಫಾರಸುಗಳಿಲ್ಲ.",
      },
      pending: {
        weather: "ಹವಾಮಾನ ಬಾಕಿಯಿದೆ",
        forecastSource: "ಮುನ್ಸೂಚನೆ ಮೂಲ ಬಾಕಿಯಿದೆ",
        harvest: "ಕಟಾವು ಅವಧಿ ಬಾಕಿಯಿದೆ",
        unknown: "ಅಪರಿಚಿತ",
        noIrrigationAdvice: "ನೀರಾವರಿ ಸಲಹೆ ಲಭ್ಯವಿಲ್ಲ.",
      },
    },
    status: {
      geolocationUnsupported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಜಿಯೋಲೊಕೇಶನ್ ಬೆಂಬಲಿತವಲ್ಲ.",
      detectingLocation: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗುತ್ತಿದೆ...",
      locationDetected: "ಪ್ರಸ್ತುತ ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ: {{city}}",
      locationLookupFailed: "ಸ್ಥಳದ ಕೋಆರ್ಡಿನೇಟ್‌ಗಳು ದೊರಕಿವೆ, ಆದರೆ ಸ್ಥಳದ ಹೆಸರು ಪತ್ತೆಯಾಗಲಿಲ್ಲ. ನೀವು ಮುಂದುವರಿಸಬಹುದು ಅಥವಾ ನಗರವನ್ನು ನಮೂದಿಸಬಹುದು.",
      locationPermissionFailed: "ಸ್ಥಳ ಅನುಮತಿ ವಿಫಲವಾಗಿದೆ: {{message}}",
      runningPrediction: "ಶಿಫಾರಸು ಮಾಡಲಾಗುತ್ತಿದೆ...",
      chooseSoilCard: "ದಯವಿಟ್ಟು ಮೊದಲು ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಆಯ್ಕೆ ಮಾಡಿ.",
      predictionSaved: "{{id}} ಎಂದು ಶಿಫಾರಸು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ.",
      predictionFailed: "ಶಿಫಾರಸು ವಿಫಲವಾಗಿದೆ.",
      loadingHistory: "ಉಳಿಸಿದ ಶಿಫಾರಸುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      nothingSaved: "ಇನ್ನೂ ಏನೂ ಉಳಿಸಲಾಗಿಲ್ಲ.",
      historyLoadFailed: "ಉಳಿಸಿದ ಇತಿಹಾಸವನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
      recommendationLoadFailed: "ಆ ಉಳಿಸಿದ ಶಿಫಾರಸನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
    previousCrops: {
      "": "ಗೊತ್ತಿದ್ದರೆ ಆಯ್ಕೆ ಮಾಡಿ",
      rice: "ಅಕ್ಕಿ",
      wheat: "ಗೋಧಿ",
      cotton: "ಹತ್ತಿ",
      ragi: "ರಾಗಿ",
      maize: "ಮೆಕ್ಕೆಜೋಳ",
      mungbean: "ಹೆಸರುಕಾಳು",
      chickpea: "ಕಡಲೆ",
      none: "ಇಲ್ಲ",
    },
    crops: {
      rice: "ಅಕ್ಕಿ",
      maize: "ಮೆಕ್ಕೆಜೋಳ",
      chickpea: "ಕಡಲೆ",
      kidneybeans: "ರಾಜ್ಮಾ",
      pigeonpeas: "ತೊಗರಿ",
      mothbeans: "ಮೋತ್ ಬೀನ್",
      mungbean: "ಹೆಸರುಕಾಳು",
      blackgram: "ಉದ್ದಿನಕಾಳು",
      lentil: "ಮಸೂರ",
      pomegranate: "ದಾಳಿಂಬೆ",
      banana: "ಬಾಳೆ",
      mango: "ಮಾವು",
      grapes: "ದ್ರಾಕ್ಷಿ",
      watermelon: "ಕಲ್ಲಂಗಡಿ",
      muskmelon: "ಖರ್ಬುಜ",
      apple: "ಸೇಬು",
      orange: "ಕಿತ್ತಳೆ",
      papaya: "ಪಪ್ಪಾಯಿ",
      coconut: "ತೆಂಗು",
      cotton: "ಹತ್ತಿ",
      jute: "ಜ್ಯೂಟ್",
      coffee: "ಕಾಫಿ",
      ragi: "ರಾಗಿ",
      wheat: "ಗೋಧಿ",
      none: "ಇಲ್ಲ",
    },
    weatherLabels: {
      Cloudy: "ಮೋಡಾವೃತ",
      Sunny: "ಬಿಸಿಲು",
      Snowy: "ಹಿಮಪಾತ",
      Rainy: "ಮಳೆಯ",
      "Rainy historical pattern": "ಐತಿಹಾಸಿಕ ಮಳೆಯ ಮಾದರಿ",
      "Open-Meteo current weather": "Open-Meteo ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
      "OpenWeather current weather": "OpenWeather ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
      "Kaggle historical-pattern long-range weather model": "Kaggle ದೀರ್ಘಾವಧಿ ಐತಿಹಾಸಿಕ ಹವಾಮಾನ ಮಾದರಿ",
    },
    dynamic: {
      match: "{{feature}} {{value}} ಆಗಿದ್ದು, ಬೆಳೆ ಡೇಟಾಸೆಟ್‌ನಲ್ಲಿ ಕಂಡುಬರುವ ಸಾಮಾನ್ಯ {{min}} ರಿಂದ {{max}} ವರೆಗೆ ಇರುವ ಶ್ರೇಣಿಯೊಳಗೆ ಇದೆ",
      concern: "{{feature}} {{value}} ಆಗಿದ್ದು, {{crop}} ಗೆ ಇದು ತುಂಬಾ {{direction}}; ಅದರ ಸಾಮಾನ್ಯ ಡೇಟಾಸೆಟ್ ಶ್ರೇಣಿ {{min}} ರಿಂದ {{max}} ವರೆಗೆ ಇದೆ",
      tooHigh: "ಹೆಚ್ಚು",
      tooLow: "ಕಡಿಮೆ",
      irrigation: {
        tooMuch: "ನೀರಾವರಿ ಹೆಚ್ಚು ಆಗಿರಬಹುದು; ಹೆಚ್ಚುವರಿ ನೀರು ಬಿಡಬೇಡಿ ಮತ್ತು ನೀರು ನಿಂತುಕೊಳ್ಳದಂತೆ ನೋಡಿ.",
        proper: "ನೆಡುವ ಅವಧಿಗೆ ನೀರಾವರಿ ಸರಿಹೊಂದುತ್ತದೆ.",
        adequate: "ಮುನ್ಸೂಚನೆಯ ಮಳೆ ಸಾಕಷ್ಟು ಇದೆ; ಮಣ್ಣು ಒಣಗಿದರೆ ಮಾತ್ರ ನೀರಾವರಿ ಮಾಡಿ.",
        tooWet: "ಈಗ ನೀರಾವರಿ ಮಾಡಬೇಡಿ; ನೀರು ನಿಂತುಕೊಳ್ಳದಂತೆ ಗಮನಿಸಿ.",
      },
    },
    features: {
      nitrogen: "ನೈಟ್ರೋಜನ್",
      phosphorus: "ಫಾಸ್ಫರಸ್",
      potassium: "ಪೊಟ್ಯಾಸಿಯಂ",
      temperature: "ತಾಪಮಾನ",
      humidity: "ಆರ್ದ್ರತೆ",
      rainfall: "ಮಳೆ",
      "soil pH": "ಮಣ್ಣಿನ pH",
    },
  },
  hi: {
    common: {
      back: "वापस जाएं",
    },
    languageNames: {
      en: "English",
      kn: "ಕನ್ನಡ",
      hi: "हिंदी",
    },
    landing: {
      subtitle: "स्मार्ट फसल निर्णय अब आसान",
      chips: {
        soil: "मिट्टी के अनुसार",
        weather: "मौसम समझदार",
        easy: "उपयोग में आसान",
      },
      chooseLanguage: "अपनी भाषा चुनें",
      start: "सिफारिश शुरू करें",
      footer: "मुफ्त | रजिस्ट्रेशन नहीं | सेव की गई हिस्ट्री के साथ काम करता है",
    },
    mode: {
      header: "स्मार्ट खेती",
      heading: "आप कैसे आगे बढ़ना चाहते हैं?",
      subheading: "जो आपके लिए सही हो, वही चुनें। आप इसे कभी भी बदल सकते हैं।",
      simple: {
        title: "सरल मोड",
        description: "मिट्टी की रिपोर्ट की जरूरत नहीं। कुछ आसान सवालों के जवाब दें और फसल सलाह पाएं।",
        badge: "अनुशंसित",
        time: "लगभग 1 मिनट",
      },
      advanced: {
        title: "उन्नत मोड",
        description: "ज्यादा सटीक सुझाव के लिए अपना सॉइल हेल्थ कार्ड अपलोड करें।",
        time: "मिट्टी की रिपोर्ट चाहिए",
      },
      info: "दोनों मोड आपके प्रशिक्षित क्रॉप मॉडल, मौसम आउटलुक, सिंचाई जांच और सेव की गई हिस्ट्री का उपयोग करते हैं।",
      continueSimple: "सरल मोड के साथ जारी रखें",
      continueAdvanced: "उन्नत मोड के साथ जारी रखें",
    },
    form: {
      header: "स्मार्ट खेती",
      simpleTitle: "अपने खेत के बारे में बताइए",
      simpleSubtitle: "सरल तरीके से जवाब दें। सिफारिश इंजन और MongoDB हिस्ट्री पहले से जुड़ी हुई है।",
      advancedTitle: "अपना सॉइल कार्ड अपलोड करें",
      advancedSubtitle: "सॉइल हेल्थ कार्ड का उपयोग करें, बाकी पोषक मान प्रशिक्षित बैकएंड भर देगा।",
      simpleMode: "सरल मोड",
      advancedMode: "उन्नत मोड",
      sessionSaved: "इस डिवाइस पर सेव",
      districtTitle: "आपका क्षेत्र",
      useLocation: "वर्तमान स्थान उपयोग करें",
      districtPlaceholder: "आपका क्षेत्र या शहर यहां दिखाई देगा",
      locationHelp: "वर्तमान स्थान से क्षेत्र भरें या शहर खुद लिखें।",
      soilTitle: "आपकी मिट्टी कैसी दिखती है?",
      soil: {
        redTitle: "लाल मिट्टी",
        redDesc: "लाल रंग की, सूखे क्षेत्रों में सामान्य",
        blackTitle: "काली मिट्टी",
        blackDesc: "गहरी और उपजाऊ, नमी ज्यादा रोकती है",
        sandyTitle: "रेतीली मिट्टी",
        sandyDesc: "ढीली, पानी जल्दी निकल जाता है",
        clayTitle: "चिकनी मिट्टी",
        clayDesc: "भारी, चिपचिपी और पानी रोकती है",
      },
      uploadTitle: "सॉइल हेल्थ कार्ड अपलोड करें",
      uploadCardTitle: "सॉइल कार्ड चुनें",
      noFileSelected: "कोई फ़ाइल चयनित नहीं",
      waterTitle: "क्या खेती के लिए नियमित पानी उपलब्ध है?",
      water: {
        yesTitle: "हाँ, नियमित पानी",
        yesDesc: "बोरवेल, नहर या ड्रिप सिंचाई",
        rainTitle: "नहीं, बारिश पर निर्भर",
        rainDesc: "मुख्य रूप से वर्षा आधारित खेती",
      },
      timeTitle: "आप खेती कब शुरू करना चाहते हैं?",
      time: {
        nowTitle: "अभी",
        nowDesc: "तुरंत",
        monthTitle: "1 महीना",
        monthDesc: "जल्द",
        laterTitle: "2-3 महीने",
        laterDesc: "बाद में",
      },
      irrigationPlaceholder: "योजना की गई सिंचाई मिमी में (वैकल्पिक)",
      previousCropTitle: "पिछली फसल (वैकल्पिक)",
      previousCropPlaceholder: "यदि याद हो तो चुनें",
      continue: "जारी रखें",
      newRecommendation: "नई सिफारिश",
    },
    analysis: {
      header: "स्मार्ट खेती",
      title: "सिफारिश विश्लेषण",
      subtitle: "फसल सुझाव, कारण, पूरे मौसम का मौसम आउटलुक और सेव की गई हिस्ट्री को अलग पेज पर देखें।",
      pill: "विश्लेषण पेज",
      resultTitle: "सिफारिश परिणाम",
      historyTitle: "सेव की गई सिफारिशें",
      historyCount: "{{count}} सेव की गई सिफारिशें",
      refresh: "रिफ्रेश",
      heroSaved: "{{date}} को {{id}} के रूप में सेव किया गया",
      sections: {
        whyFit: "यह फसल क्यों उपयुक्त है",
        watch: "ध्यान देने योग्य बातें",
        topProbabilities: "मुख्य फसल संभावनाएँ",
        weatherIrrigation: "मौसम और सिंचाई",
        expectedHarvest: "अनुमानित कटाई",
        fullDuration: "पूरी फसल अवधि का मौसम",
        seasonNotes: "मौसमी नोट्स",
        whyWeaker: "दूसरी फसल क्यों कमजोर विकल्प है",
      },
      labels: {
        temperature: "तापमान",
        humidity: "आर्द्रता",
        rainfall: "वर्षा",
        waterAdvice: "सिंचाई सलाह",
        plantingDate: "बुवाई की तारीख",
        harvestStart: "कटाई शुरू",
        harvestEnd: "कटाई समाप्त",
        approxDuration: "अनुमानित अवधि",
        window: "अवधि",
        avgTemperature: "औसत तापमान",
        avgHumidity: "औसत आर्द्रता",
        totalRainfall: "कुल वर्षा",
      },
      empty: {
        noFitNotes: "उपयुक्तता संबंधी नोट्स उपलब्ध नहीं हैं।",
        noProbability: "संभावना विवरण उपलब्ध नहीं है।",
        noWeaker: "कमजोर विकल्प संबंधी नोट्स उपलब्ध नहीं हैं।",
        noHistory: "इस डिवाइस पर अभी कोई सेव की गई सिफारिश नहीं है।",
      },
      pending: {
        weather: "मौसम लंबित",
        forecastSource: "पूर्वानुमान स्रोत लंबित",
        harvest: "कटाई अवधि लंबित",
        unknown: "अज्ञात",
        noIrrigationAdvice: "सिंचाई सलाह उपलब्ध नहीं है।",
      },
    },
    status: {
      geolocationUnsupported: "इस ब्राउज़र में जियोलोकेशन उपलब्ध नहीं है।",
      detectingLocation: "आपका वर्तमान स्थान पता लगाया जा रहा है...",
      locationDetected: "वर्तमान स्थान मिला: {{city}}",
      locationLookupFailed: "निर्देशांक मिल गए, लेकिन स्थान का नाम नहीं मिल सका। आप जारी रख सकते हैं या शहर खुद लिख सकते हैं।",
      locationPermissionFailed: "स्थान अनुमति विफल: {{message}}",
      runningPrediction: "सिफारिश तैयार की जा रही है...",
      chooseSoilCard: "कृपया पहले सॉइल हेल्थ कार्ड फ़ाइल चुनें।",
      predictionSaved: "{{id}} के रूप में सिफारिश सफलतापूर्वक सेव हुई।",
      predictionFailed: "सिफारिश विफल हुई।",
      loadingHistory: "सेव की गई सिफारिशें लोड हो रही हैं...",
      nothingSaved: "अभी तक कुछ सेव नहीं हुआ है।",
      historyLoadFailed: "सेव की गई हिस्ट्री लोड नहीं हो सकी।",
      recommendationLoadFailed: "वह सेव की गई सिफारिश लोड नहीं हो सकी।",
    },
    previousCrops: {
      "": "यदि याद हो तो चुनें",
      rice: "चावल",
      wheat: "गेहूं",
      cotton: "कपास",
      ragi: "रागी",
      maize: "मक्का",
      mungbean: "मूंग",
      chickpea: "चना",
      none: "कोई नहीं",
    },
    crops: {
      rice: "चावल",
      maize: "मक्का",
      chickpea: "चना",
      kidneybeans: "राजमा",
      pigeonpeas: "अरहर",
      mothbeans: "मौठ",
      mungbean: "मूंग",
      blackgram: "उड़द",
      lentil: "मसूर",
      pomegranate: "अनार",
      banana: "केला",
      mango: "आम",
      grapes: "अंगूर",
      watermelon: "तरबूज",
      muskmelon: "खरबूजा",
      apple: "सेब",
      orange: "संतरा",
      papaya: "पपीता",
      coconut: "नारियल",
      cotton: "कपास",
      jute: "जूट",
      coffee: "कॉफी",
      ragi: "रागी",
      wheat: "गेहूं",
      none: "कोई नहीं",
    },
    weatherLabels: {
      Cloudy: "बादल छाए हुए",
      Sunny: "धूप",
      Snowy: "बर्फीला",
      Rainy: "बारिश",
      "Rainy historical pattern": "ऐतिहासिक वर्षा पैटर्न",
      "Open-Meteo current weather": "Open-Meteo वर्तमान मौसम",
      "OpenWeather current weather": "OpenWeather वर्तमान मौसम",
      "Kaggle historical-pattern long-range weather model": "Kaggle दीर्घकालिक ऐतिहासिक मौसम मॉडल",
    },
    dynamic: {
      match: "{{feature}} {{value}} है, जो क्रॉप डाटासेट में दिखने वाली सामान्य {{min}} से {{max}} सीमा के भीतर है",
      concern: "{{feature}} {{value}} है, जो {{crop}} के लिए बहुत {{direction}} है; इसकी सामान्य डाटासेट सीमा {{min}} से {{max}} है",
      tooHigh: "ज्यादा",
      tooLow: "कम",
      irrigation: {
        tooMuch: "सिंचाई ज्यादा हो सकती है; अतिरिक्त पानी न दें और निकास पर ध्यान दें।",
        proper: "बुवाई अवधि के लिए सिंचाई ठीक लगती है।",
        adequate: "पूर्वानुमानित वर्षा पर्याप्त है; मिट्टी सूखने पर ही सिंचाई करें।",
        tooWet: "अभी सिंचाई न करें; पानी की निकासी पर ध्यान दें।",
      },
    },
    features: {
      nitrogen: "नाइट्रोजन",
      phosphorus: "फॉस्फोरस",
      potassium: "पोटैशियम",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      rainfall: "वर्षा",
      "soil pH": "मिट्टी का pH",
    },
  },
};

const state = {
  sessionId: "",
  language: "en",
  mode: "simple",
  selectedSoil: "red",
  selectedWater: "yes",
  selectedTime: "now",
  latitude: null,
  longitude: null,
  activePredictionId: null,
  locationType: "inland",
  historyDocuments: [],
  currentPrediction: null,
  locationMessage: {
    key: "form.locationHelp",
    vars: null,
    fallback: "",
  },
  formStatus: {
    message: "",
    key: "",
    vars: null,
    isError: false,
  },
};

const elements = {
  landingView: document.getElementById("landingView"),
  modeView: document.getElementById("modeView"),
  formView: document.getElementById("formView"),
  analysisView: document.getElementById("analysisView"),
  startBtn: document.getElementById("startBtn"),
  backToLandingBtn: document.getElementById("backToLandingBtn"),
  backToModeBtn: document.getElementById("backToModeBtn"),
  backToFormBtn: document.getElementById("backToFormBtn"),
  newRecommendationBtn: document.getElementById("newRecommendationBtn"),
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
  landingSubtitle: document.getElementById("landingSubtitle"),
  featureChipSoil: document.getElementById("featureChipSoil"),
  featureChipWeather: document.getElementById("featureChipWeather"),
  featureChipEasy: document.getElementById("featureChipEasy"),
  landingLanguageLabel: document.getElementById("landingLanguageLabel"),
  landingFooter: document.getElementById("landingFooter"),
  modeHeaderTitle: document.getElementById("modeHeaderTitle"),
  modeHeading: document.getElementById("modeHeading"),
  modeSubheading: document.getElementById("modeSubheading"),
  simpleModeTitle: document.getElementById("simpleModeTitle"),
  simpleModeDescription: document.getElementById("simpleModeDescription"),
  simpleModeBadge: document.getElementById("simpleModeBadge"),
  simpleModeTime: document.getElementById("simpleModeTime"),
  advancedModeTitle: document.getElementById("advancedModeTitle"),
  advancedModeDescription: document.getElementById("advancedModeDescription"),
  advancedModeTime: document.getElementById("advancedModeTime"),
  modeInfoBanner: document.getElementById("modeInfoBanner"),
  formPageHeader: document.getElementById("formPageHeader"),
  sessionPill: document.getElementById("sessionPill"),
  districtSectionTitle: document.getElementById("districtSectionTitle"),
  soilSectionTitle: document.getElementById("soilSectionTitle"),
  soilRedTitle: document.getElementById("soilRedTitle"),
  soilRedDesc: document.getElementById("soilRedDesc"),
  soilBlackTitle: document.getElementById("soilBlackTitle"),
  soilBlackDesc: document.getElementById("soilBlackDesc"),
  soilSandyTitle: document.getElementById("soilSandyTitle"),
  soilSandyDesc: document.getElementById("soilSandyDesc"),
  soilClayTitle: document.getElementById("soilClayTitle"),
  soilClayDesc: document.getElementById("soilClayDesc"),
  uploadSectionTitle: document.getElementById("uploadSectionTitle"),
  uploadCardTitle: document.getElementById("uploadCardTitle"),
  waterSectionTitle: document.getElementById("waterSectionTitle"),
  waterYesTitle: document.getElementById("waterYesTitle"),
  waterYesDesc: document.getElementById("waterYesDesc"),
  waterRainTitle: document.getElementById("waterRainTitle"),
  waterRainDesc: document.getElementById("waterRainDesc"),
  timeSectionTitle: document.getElementById("timeSectionTitle"),
  timeNowTitle: document.getElementById("timeNowTitle"),
  timeNowDesc: document.getElementById("timeNowDesc"),
  timeMonthTitle: document.getElementById("timeMonthTitle"),
  timeMonthDesc: document.getElementById("timeMonthDesc"),
  timeLaterTitle: document.getElementById("timeLaterTitle"),
  timeLaterDesc: document.getElementById("timeLaterDesc"),
  previousCropTitle: document.getElementById("previousCropTitle"),
  previousCropPlaceholder: document.getElementById("previousCropPlaceholder"),
  analysisPageHeader: document.getElementById("analysisPageHeader"),
  analysisTitle: document.getElementById("analysisTitle"),
  analysisSubtitle: document.getElementById("analysisSubtitle"),
  analysisPill: document.getElementById("analysisPill"),
  resultSectionTitle: document.getElementById("resultSectionTitle"),
  historyTitle: document.getElementById("historyTitle"),
};

document.addEventListener("DOMContentLoaded", () => {
  initialiseSession();
  initialiseLanguage();
  initialiseInteractions();
  initialiseDefaults();
  renderMode();
  renderSelections();
  applyTranslations();
  loadHistory();
});

function initialiseSession() {
  const existingId = window.localStorage.getItem(sessionStorageKey);
  state.sessionId = existingId || createSessionId();
  window.localStorage.setItem(sessionStorageKey, state.sessionId);
}

function initialiseLanguage() {
  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  if (savedLanguage && translations[savedLanguage]) {
    state.language = savedLanguage;
  }
}

function initialiseInteractions() {
  elements.startBtn.addEventListener("click", () => showView("mode"));
  elements.backToLandingBtn.addEventListener("click", () => showView("landing"));
  elements.backToModeBtn.addEventListener("click", () => showView("mode"));
  elements.backToFormBtn.addEventListener("click", () => showView("form"));
  elements.newRecommendationBtn.addEventListener("click", () => showView("form"));

  elements.simpleModeCard.addEventListener("click", () => setMode("simple"));
  elements.advancedModeCard.addEventListener("click", () => setMode("advanced"));
  elements.continueModeBtn.addEventListener("click", () => showView("form"));

  elements.languageChips.forEach((chip) => {
    chip.addEventListener("click", () => setLanguage(chip.dataset.lang || "en"));
  });

  elements.useLocationBtn.addEventListener("click", useCurrentLocation);
  elements.predictionForm.addEventListener("submit", handleSubmit);
  elements.refreshHistoryBtn.addEventListener("click", loadHistory);

  elements.soilCardInput?.addEventListener("change", () => {
    const file = elements.soilCardInput.files?.[0];
    elements.soilCardName.textContent = file ? file.name : t("form.noFileSelected");
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
  setLocationMessage("form.locationHelp");
}

function setLanguage(language) {
  if (!translations[language]) {
    return;
  }

  state.language = language;
  window.localStorage.setItem(languageStorageKey, language);
  applyTranslations();

  if (state.currentPrediction) {
    renderPrediction(state.currentPrediction);
  }

  renderHistoryList();
}

function applyTranslations() {
  document.documentElement.lang = state.language;

  elements.languageChips.forEach((chip) => {
    const chipLanguage = chip.dataset.lang || "en";
    chip.classList.toggle("active", chipLanguage === state.language);
    chip.textContent = t(`languageNames.${chipLanguage}`);
  });

  elements.backToLandingBtn.setAttribute("aria-label", t("common.back"));
  elements.backToModeBtn.setAttribute("aria-label", t("common.back"));
  elements.backToFormBtn.setAttribute("aria-label", t("common.back"));

  elements.landingSubtitle.textContent = t("landing.subtitle");
  elements.featureChipSoil.textContent = t("landing.chips.soil");
  elements.featureChipWeather.textContent = t("landing.chips.weather");
  elements.featureChipEasy.textContent = t("landing.chips.easy");
  elements.landingLanguageLabel.textContent = t("landing.chooseLanguage");
  elements.startBtn.textContent = t("landing.start");
  elements.landingFooter.textContent = t("landing.footer");

  elements.modeHeaderTitle.textContent = t("mode.header");
  elements.modeHeading.textContent = t("mode.heading");
  elements.modeSubheading.textContent = t("mode.subheading");
  elements.simpleModeTitle.textContent = t("mode.simple.title");
  elements.simpleModeDescription.textContent = t("mode.simple.description");
  elements.simpleModeBadge.textContent = t("mode.simple.badge");
  elements.simpleModeTime.textContent = t("mode.simple.time");
  elements.advancedModeTitle.textContent = t("mode.advanced.title");
  elements.advancedModeDescription.textContent = t("mode.advanced.description");
  elements.advancedModeTime.textContent = t("mode.advanced.time");
  elements.modeInfoBanner.textContent = t("mode.info");

  elements.formPageHeader.textContent = t("form.header");
  elements.sessionPill.textContent = t("form.sessionSaved");
  elements.districtSectionTitle.textContent = t("form.districtTitle");
  elements.useLocationBtn.textContent = t("form.useLocation");
  elements.districtInput.placeholder = t("form.districtPlaceholder");
  applyLocationMessage();
  elements.soilSectionTitle.textContent = t("form.soilTitle");
  elements.soilRedTitle.textContent = t("form.soil.redTitle");
  elements.soilRedDesc.textContent = t("form.soil.redDesc");
  elements.soilBlackTitle.textContent = t("form.soil.blackTitle");
  elements.soilBlackDesc.textContent = t("form.soil.blackDesc");
  elements.soilSandyTitle.textContent = t("form.soil.sandyTitle");
  elements.soilSandyDesc.textContent = t("form.soil.sandyDesc");
  elements.soilClayTitle.textContent = t("form.soil.clayTitle");
  elements.soilClayDesc.textContent = t("form.soil.clayDesc");
  elements.uploadSectionTitle.textContent = t("form.uploadTitle");
  elements.uploadCardTitle.textContent = t("form.uploadCardTitle");
  if (!elements.soilCardInput.files?.length) {
    elements.soilCardName.textContent = t("form.noFileSelected");
  }
  elements.waterSectionTitle.textContent = t("form.waterTitle");
  elements.waterYesTitle.textContent = t("form.water.yesTitle");
  elements.waterYesDesc.textContent = t("form.water.yesDesc");
  elements.waterRainTitle.textContent = t("form.water.rainTitle");
  elements.waterRainDesc.textContent = t("form.water.rainDesc");
  elements.timeSectionTitle.textContent = t("form.timeTitle");
  elements.timeNowTitle.textContent = t("form.time.nowTitle");
  elements.timeNowDesc.textContent = t("form.time.nowDesc");
  elements.timeMonthTitle.textContent = t("form.time.monthTitle");
  elements.timeMonthDesc.textContent = t("form.time.monthDesc");
  elements.timeLaterTitle.textContent = t("form.time.laterTitle");
  elements.timeLaterDesc.textContent = t("form.time.laterDesc");
  elements.irrigationMmInput.placeholder = t("form.irrigationPlaceholder");
  elements.previousCropTitle.textContent = t("form.previousCropTitle");
  elements.previousCropPlaceholder.textContent = t("form.previousCropPlaceholder");
  updatePreviousCropOptions();

  elements.analysisPageHeader.textContent = t("analysis.header");
  elements.analysisTitle.textContent = t("analysis.title");
  elements.analysisSubtitle.textContent = t("analysis.subtitle");
  elements.analysisPill.textContent = t("analysis.pill");
  elements.newRecommendationBtn.textContent = t("form.newRecommendation");
  elements.resultSectionTitle.textContent = t("analysis.resultTitle");
  elements.historyTitle.textContent = t("analysis.historyTitle");
  elements.refreshHistoryBtn.textContent = t("analysis.refresh");

  renderStoredStatus();
  renderMode();
}

function updatePreviousCropOptions() {
  Array.from(elements.previousCropSelect.options).forEach((option) => {
    option.textContent = t(`previousCrops.${option.value}`);
  });
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
  elements.analysisView.hidden = view !== "analysis";
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
    ? t("mode.continueSimple")
    : t("mode.continueAdvanced");
  elements.modePill.textContent = simple
    ? t("form.simpleMode")
    : t("form.advancedMode");
  elements.formTitle.textContent = simple
    ? t("form.simpleTitle")
    : t("form.advancedTitle");
  elements.formSubtitle.textContent = simple
    ? t("form.simpleSubtitle")
    : t("form.advancedSubtitle");
  elements.simpleSoilSection.hidden = !simple;
  elements.advancedUploadSection.hidden = simple;
  elements.submitButton.textContent = t("form.continue");
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
    setLocationMessage("status.geolocationUnsupported");
    return;
  }

  elements.useLocationBtn.disabled = true;
  setLocationMessage("status.detectingLocation");

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
        if (city) {
          setLocationMessage("status.locationDetected", { city });
        } else {
          setLocationMessage("form.locationHelp");
        }
      } catch (error) {
        elements.districtInput.value = `${state.latitude.toFixed(4)}, ${state.longitude.toFixed(4)}`;
        state.locationType = "inland";
        setLocationMessage("status.locationLookupFailed");
      } finally {
        elements.useLocationBtn.disabled = false;
      }
    },
    (error) => {
      elements.useLocationBtn.disabled = false;
      setLocationMessage("status.locationPermissionFailed", { message: error.message });
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 },
  );
}

function inferLocationType(location) {
  const coastalHints = ["mumbai", "goa", "chennai", "kochi", "mangalore", "visakhapatnam", "kolkata", "pondicherry", "kerala", "coast"];
  const mountainHints = ["shimla", "darjeeling", "dehradun", "sikkim", "manali", "uttarakhand", "himachal", "mountain"];
  const haystack = [location.area, location.city, location.state, location.display_name]
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
  setStatusFromKey("status.runningPrediction");
  elements.submitButton.disabled = true;

  try {
    const document = state.mode === "advanced"
      ? await submitAdvancedMode()
      : await submitSimpleMode();

    state.activePredictionId = document.id;
    state.currentPrediction = document;
    renderPrediction(document);
    await loadHistory();
    setStatusFromKey("status.predictionSaved", { id: document.id });
    showView("analysis");
  } catch (error) {
    setStatus(error.message || t("status.predictionFailed"), true);
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
    throw new Error(t("status.chooseSoilCard"));
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
  elements.historyStatus.textContent = t("status.loadingHistory");

  try {
    const documents = await requestJson(
      `/predictions?user_id=${encodeURIComponent(state.sessionId)}&limit=8`,
      { method: "GET" },
    );
    state.historyDocuments = Array.isArray(documents) ? documents : [];
    renderHistoryList();
  } catch (error) {
    state.historyDocuments = [];
    elements.historyStatus.textContent = t("status.historyLoadFailed");
    elements.historyList.innerHTML = `<div class="history-empty">${escapeHtml(error.message || t("status.historyLoadFailed"))}</div>`;
  }
}

function renderHistoryList() {
  if (!state.historyDocuments || state.historyDocuments.length === 0) {
    elements.historyStatus.textContent = t("status.nothingSaved");
    elements.historyList.innerHTML = `<div class="history-empty">${escapeHtml(t("analysis.empty.noHistory"))}</div>`;
    return;
  }

  elements.historyStatus.textContent = t("analysis.historyCount", {
    count: state.historyDocuments.length,
  });
  elements.historyList.innerHTML = state.historyDocuments.map(renderHistoryCard).join("");

  elements.historyList.querySelectorAll("[data-prediction-id]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        const predictionId = button.dataset.predictionId;
        const document = await requestJson(`/predictions/${predictionId}`, { method: "GET" });
        state.activePredictionId = predictionId;
        state.currentPrediction = document;
        renderPrediction(document);
        highlightActiveHistoryCard();
        showView("analysis");
      } catch (error) {
        setStatus(error.message || t("status.recommendationLoadFailed"), true);
      }
    });
  });

  highlightActiveHistoryCard();
}

function renderHistoryCard(document) {
  const crop = translateCropName(document?.prediction?.crop_prediction?.recommended_crop || "Unknown");
  const weather = translateWeatherLabel(
    document?.prediction?.weather?.forecast?.weather_type
      || document?.prediction?.weather?.trained_weather_prediction
      || t("analysis.pending.weather"),
  );
  const date = document?.created_at ? formatDateTime(document.created_at) : t("analysis.pending.unknown");

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
  state.currentPrediction = document;

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
      <h3>${escapeHtml(translateCropName(cropPrediction.recommended_crop || t("analysis.pending.unknown")))}</h3>
      <p class="result-subcopy">${escapeHtml(t("analysis.heroSaved", { id: document.id, date: formatDateTime(document.created_at) }))}</p>
      <div class="result-meta-row">
        <span class="result-meta-pill">${escapeHtml(translateWeatherLabel(forecast.weather_type || weather.trained_weather_prediction || t("analysis.pending.weather")))}</span>
        <span class="result-meta-pill">${escapeHtml(translateWeatherLabel(forecast.source || t("analysis.pending.forecastSource")))}</span>
        <span class="result-meta-pill">${escapeHtml(formatHarvest(harvest))}</span>
      </div>
    </div>

    <div class="result-grid">
      <div class="result-card">
        <h4>${escapeHtml(t("analysis.sections.whyFit"))}</h4>
        ${renderList((cropPrediction.strengths || []).map(translateDynamicText), t("analysis.empty.noFitNotes"))}
        ${renderHighlight(t("analysis.sections.watch"), (cropPrediction.watchouts || []).map(translateDynamicText), "warn")}
      </div>

      <div class="result-card">
        <h4>${escapeHtml(t("analysis.sections.topProbabilities"))}</h4>
        ${renderProbabilityList(cropPrediction.top_predictions)}
      </div>

      <div class="result-card">
        <h4>${escapeHtml(t("analysis.sections.weatherIrrigation"))}</h4>
        <ul class="weather-list">
          <li>${escapeHtml(t("analysis.labels.temperature"))}: ${escapeHtml(formatMetric(forecast.temperature, "C"))}</li>
          <li>${escapeHtml(t("analysis.labels.humidity"))}: ${escapeHtml(formatMetric(forecast.humidity, "%"))}</li>
          <li>${escapeHtml(t("analysis.labels.rainfall"))}: ${escapeHtml(formatMetric(forecast.rainfall, "mm"))}</li>
          <li>${escapeHtml(t("analysis.labels.waterAdvice"))}: ${escapeHtml(translateDynamicText(irrigation.advice || t("analysis.pending.noIrrigationAdvice")))}</li>
        </ul>
      </div>

      <div class="result-card">
        <h4>${escapeHtml(t("analysis.sections.expectedHarvest"))}</h4>
        <ul class="weather-list">
          <li>${escapeHtml(t("analysis.labels.plantingDate"))}: ${escapeHtml(harvest.planting_date || t("analysis.pending.unknown"))}</li>
          <li>${escapeHtml(t("analysis.labels.harvestStart"))}: ${escapeHtml(harvest.harvest_start || t("analysis.pending.unknown"))}</li>
          <li>${escapeHtml(t("analysis.labels.harvestEnd"))}: ${escapeHtml(harvest.harvest_end || t("analysis.pending.unknown"))}</li>
          <li>${escapeHtml(t("analysis.labels.approxDuration"))}: ${escapeHtml(formatMetric(harvest.duration_days, "days"))}</li>
        </ul>
      </div>

      <div class="result-card">
        <h4>${escapeHtml(t("analysis.sections.fullDuration"))}</h4>
        <ul class="weather-list">
          <li>${escapeHtml(t("analysis.labels.window"))}: ${escapeHtml(durationSummary.start_date || t("analysis.pending.unknown"))} to ${escapeHtml(durationSummary.end_date || t("analysis.pending.unknown"))}</li>
          <li>${escapeHtml(t("analysis.labels.avgTemperature"))}: ${escapeHtml(formatMetric(durationSummary.temperature, "C"))}</li>
          <li>${escapeHtml(t("analysis.labels.avgHumidity"))}: ${escapeHtml(formatMetric(durationSummary.humidity, "%"))}</li>
          <li>${escapeHtml(t("analysis.labels.totalRainfall"))}: ${escapeHtml(formatMetric(durationSummary.rainfall, "mm"))}</li>
        </ul>
        ${renderHighlight(t("analysis.sections.seasonNotes"), (duration.fit?.watchouts || []).map(translateDynamicText), "warn")}
      </div>

      <div class="result-card">
        <h4>${escapeHtml(t("analysis.sections.whyWeaker"))}</h4>
        ${renderAlternatives(cropPrediction)}
      </div>
    </div>
  `;

  elements.resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderProbabilityList(items) {
  if (!items || items.length === 0) {
    return `<div class="result-highlight">${escapeHtml(t("analysis.empty.noProbability"))}</div>`;
  }

  return `
    <div class="probability-list">
      ${items.map((item) => {
        const label = translateCropName(item.crop || item.label || t("analysis.pending.unknown"));
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
      translateCropName(cropPrediction.compared_crop.crop),
      (cropPrediction.compared_crop.reasons || []).map(translateDynamicText),
      "warn",
    );
  }

  if (!cropPrediction.alternatives || cropPrediction.alternatives.length === 0) {
    return `<div class="result-highlight">${escapeHtml(t("analysis.empty.noWeaker"))}</div>`;
  }

  return cropPrediction.alternatives
    .map((item) => renderHighlight(translateCropName(item.crop), (item.reasons || []).map(translateDynamicText), "warn"))
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

function translateCropName(name) {
  if (!name) {
    return t("analysis.pending.unknown");
  }
  const key = String(name).toLowerCase();
  return t(`crops.${key}`, null, titleCase(name));
}

function translateWeatherLabel(label) {
  if (!label) {
    return t("analysis.pending.unknown");
  }
  return t(`weatherLabels.${label}`, null, label);
}

function translateFeatureLabel(label) {
  const key = String(label).trim().toLowerCase();
  return t(`features.${key}`, null, label);
}

function translateDynamicText(text) {
  if (!text || state.language === "en") {
    return text;
  }

  const adviceMap = {
    "Irrigation may be too much; avoid extra watering and check drainage.": t("dynamic.irrigation.tooMuch"),
    "Irrigation looks proper for the planting window.": t("dynamic.irrigation.proper"),
    "Forecast rainfall looks adequate; irrigate only if soil dries.": t("dynamic.irrigation.adequate"),
    "Do not add irrigation now; focus on drainage.": t("dynamic.irrigation.tooWet"),
  };
  if (adviceMap[text]) {
    return adviceMap[text];
  }

  const matchPattern = /^(.+?) is (.+?), inside the common (.+?) to (.+?) range seen in the crop dataset$/;
  const concernPattern = /^(.+?) is (.+?), which is too (high|low) for (.+?); its common dataset range is (.+?) to (.+?)$/;

  const matchParts = text.match(matchPattern);
  if (matchParts) {
    return t("dynamic.match", {
      feature: translateFeatureLabel(matchParts[1]),
      value: matchParts[2],
      min: matchParts[3],
      max: matchParts[4],
    });
  }

  const concernParts = text.match(concernPattern);
  if (concernParts) {
    return t("dynamic.concern", {
      feature: translateFeatureLabel(concernParts[1]),
      value: concernParts[2],
      direction: concernParts[3] === "high" ? t("dynamic.tooHigh") : t("dynamic.tooLow"),
      crop: translateCropName(concernParts[4]),
      min: concernParts[5],
      max: concernParts[6],
    });
  }

  return text
    .replaceAll("temperature", translateFeatureLabel("temperature"))
    .replaceAll("humidity", translateFeatureLabel("humidity"))
    .replaceAll("rainfall", translateFeatureLabel("rainfall"))
    .replaceAll("nitrogen", translateFeatureLabel("nitrogen"))
    .replaceAll("phosphorus", translateFeatureLabel("phosphorus"))
    .replaceAll("potassium", translateFeatureLabel("potassium"))
    .replaceAll("soil pH", translateFeatureLabel("soil pH"));
}

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || t("status.predictionFailed"));
  }
  return payload;
}

function setStatus(message, isError) {
  state.formStatus = {
    message,
    key: "",
    vars: null,
    isError: Boolean(isError),
  };
  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.toggle("error", Boolean(isError));
}

function setStatusFromKey(key, vars = null, isError = false, fallback = "") {
  state.formStatus = {
    message: "",
    key,
    vars,
    isError: Boolean(isError),
  };
  elements.statusMessage.textContent = t(key, vars, fallback);
  elements.statusMessage.classList.toggle("error", Boolean(isError));
}

function renderStoredStatus() {
  if (state.formStatus.key) {
    elements.statusMessage.textContent = t(state.formStatus.key, state.formStatus.vars);
    elements.statusMessage.classList.toggle("error", state.formStatus.isError);
    return;
  }

  elements.statusMessage.textContent = state.formStatus.message || "";
  elements.statusMessage.classList.toggle("error", state.formStatus.isError);
}

function setLocationMessage(key, vars = null, fallback = "") {
  state.locationMessage = { key, vars, fallback };
  applyLocationMessage();
}

function applyLocationMessage() {
  const key = state.locationMessage?.key || "form.locationHelp";
  elements.locationStatus.textContent = t(
    key,
    state.locationMessage?.vars || null,
    state.locationMessage?.fallback || "",
  );
}

function formatMetric(value, unit) {
  if (value === null || value === undefined || value === "") {
    return t("analysis.pending.unknown");
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
    return t("analysis.pending.harvest");
  }
  return `${harvest.harvest_start} to ${harvest.harvest_end}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  const localeMap = { en: "en-US", kn: "kn-IN", hi: "hi-IN" };
  return new Intl.DateTimeFormat(localeMap[state.language] || "en-US", {
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

function t(path, vars = null, fallback = "") {
  const raw = path.split(".").reduce((current, part) => (current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : undefined), translations[state.language]);
  const value = raw === undefined ? fallback : raw;
  if (typeof value !== "string") {
    return value ?? fallback ?? path;
  }
  if (!vars) {
    return value;
  }
  return Object.entries(vars).reduce(
    (text, [key, replacement]) => text.replaceAll(`{{${key}}}`, String(replacement)),
    value,
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
