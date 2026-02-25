// // ===== CONFIG =====
// // Using proxy server to protect API key
// const API_BASE = ''; // Uses same origin as page

// // Proxy the endpoints (served by server.js)
// const CURRENT_URL = (city, units) =>
//   API_BASE + '/api/weather?q=' + encodeURIComponent(city) + '&units=' + units;

// const CURRENT_BY_COORDS = (lat, lon, units) =>
//   API_BASE + '/api/weather?lat=' + lat + '&lon=' + lon + '&units=' + units;

// const FORECAST_URL = (city, units) =>
//   API_BASE + '/api/forecast?q=' + encodeURIComponent(city) + '&units=' + units;

// const FORECAST_BY_COORDS = (lat, lon, units) =>
//   API_BASE + '/api/forecast?lat=' + lat + '&lon=' + lon + '&units=' + units;

// // ===== DOM =====
// var searchInput = document.getElementById('searchInput');
// var searchBtn = document.getElementById('searchBtn');
// var geoBtn = document.getElementById('geoBtn');
// var unitsSelect = document.getElementById('units');
// var retryBtn = document.getElementById('retryBtn');

// var currentSection = document.getElementById('current');
// var cityNameEl = document.getElementById('cityName');
// var timeEl = document.getElementById('time');
// var lastUpdatedEl = document.getElementById('lastUpdated');
// var weatherIcon = document.getElementById('weatherIcon');
// var tempEl = document.getElementById('temp');
// var feelsLikeEl = document.getElementById('feelsLike');
// var descEl = document.getElementById('description');
// var detailsEl = document.getElementById('details');

// var forecastSection = document.getElementById('forecast');
// var forecastCards = document.getElementById('forecastCards');

// var errorBox = document.getElementById('error');
// var errorMessage = document.getElementById('errorMessage');

// var loader = document.getElementById('loader');

// var bgGradient = document.querySelector('.bg-gradient');

// var currentUnits = unitsSelect.value || 'metric';
// var lastCity = '';

// // ===== SVG Icons =====
// var icons = {
//   humidity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
//   wind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
//   pressure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
//   visibility: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
//   clouds: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
//   sunrise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><circle cx="12" cy="12" r="4"/></svg>',
//   sunset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18a5 5 0 0 0-10 0"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
// };

// // ===== helpers =====
// function showError(msg) {
//   errorMessage.textContent = msg;
//   errorBox.classList.remove('hidden');
//   hideElement(currentSection);
//   hideElement(forecastSection);
//   hideElement(loader);
// }

// function clearError() {
//   errorBox.classList.add('hidden');
//   errorMessage.textContent = '';
// }

// function showElement(el) { el.classList.remove('hidden'); }
// function hideElement(el) { el.classList.add('hidden'); }

// function showLoader() {
//   hideElement(currentSection);
//   hideElement(forecastSection);
//   hideElement(errorBox);
//   showElement(loader);
// }

// function hideLoader() {
//   hideElement(loader);
// }

// function iconUrl(iconCode) {
//   return 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
// }

// function formatLocalTime(ts, timezoneOffsetSeconds) {
//   try {
//     // Handle invalid timestamps
//     if (!ts || ts === 0) {
//       return new Date().toLocaleString();
//     }
//     var date = new Date(ts * 1000);
//     if (isNaN(date.getTime())) {
//       return new Date().toLocaleString();
//     }
//     return date.toLocaleString(undefined, {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   } catch (e) {
//     return new Date().toLocaleString();
//   }
// }

// function getRelativeTime(timestamp) {
//   try {
//     if (!timestamp) return 'Unknown';
//     var now = Math.floor(Date.now() / 1000);
//     var diff = now - timestamp;
    
//     if (diff < 60) return 'Just now';
//     if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
//     if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
//     return Math.floor(diff / 86400) + ' days ago';
//   } catch (e) {
//     return 'Unknown';
//   }
// }

// function getWeatherBackground(weatherId, isNight) {
//   if (isNight) return 'night';
//   if (weatherId >= 200 && weatherId < 300) return 'rainy';
//   if (weatherId >= 300 && weatherId < 400) return 'rainy';
//   if (weatherId >= 500 && weatherId < 600) return 'rainy';
//   if (weatherId >= 600 && weatherId < 700) return 'snow';
//   if (weatherId >= 700 && weatherId < 800) return 'cloudy';
//   if (weatherId === 800) return 'sunny';
//   if (weatherId > 800) return 'cloudy';
  
//   return '';
// }

// function updateBackground(weatherId, isNight) {
//   if (!bgGradient) return;
//   var weatherClass = getWeatherBackground(weatherId, isNight);
//   bgGradient.className = 'bg-gradient';
//   if (weatherClass) {
//     bgGradient.classList.add(weatherClass);
//   }
// }

// function extractDailyForecast(list) {
//   if (!list || !Array.isArray(list)) return [];
//   var days = {};
//   list.forEach(function(item) {
//     if (!item || !item.dt) return;
//     var date = new Date(item.dt * 1000);
//     var day = date.toISOString().slice(0,10);
//     var hour = date.getUTCHours();
//     if (!days[day]) days[day] = { item: item, diff: Math.abs(hour - 12) };
//     else {
//       var d = Math.abs(hour - 12);
//       if (d < days[day].diff) days[day] = { item: item, diff: d };
//     }
//   });
//   return Object.values(days).map(function(d) { return d.item; }).slice(0,5);
// }

// // ===== rendering =====
// function renderCurrent(data, units) {
//   if (!data || !data.main) {
//     showError('Invalid weather data received');
//     return;
//   }
  
//   clearError();
//   showElement(currentSection);
  
//   // Handle missing data gracefully
//   var cityName = data.name || 'Unknown';
//   var country = (data.sys && data.sys.country) ? data.sys.country : '';
//   cityNameEl.textContent = country ? cityName + ', ' + country : cityName;
  
//   // Format time safely
//   var dt = data.dt || Math.floor(Date.now() / 1000);
//   var timezone = data.timezone || 0;
//   timeEl.textContent = formatLocalTime(dt, timezone);
//   lastUpdatedEl.textContent = 'Updated ' + getRelativeTime(dt);
  
//   // Handle weather icon
//   if (data.weather && data.weather[0]) {
//     weatherIcon.src = iconUrl(data.weather[0].icon);
//     weatherIcon.alt = data.weather[0].description || 'Weather icon';
//   }
  
//   var unitSymbol = units === 'metric' ? '°C' : '°F';
//   var temp = data.main.temp ? Math.round(data.main.temp) : '--';
//   tempEl.textContent = temp + unitSymbol;
  
//   var feelsLike = data.main.feels_like ? Math.round(data.main.feels_like) : temp;
//   feelsLikeEl.textContent = 'Feels like ' + feelsLike + unitSymbol;
  
//   var description = data.weather && data.weather[0] ? data.weather[0].description : 'No description';
//   descEl.textContent = description;
  
//   // Check for night time
//   var now = dt;
//   var sunrise = data.sys && data.sys.sunrise ? data.sys.sunrise : 0;
//   var sunset = data.sys && data.sys.sunset ? data.sys.sunset : 0;
//   var isNight = now < sunrise || now > sunset;
  
//   var weatherId = data.weather && data.weather[0] ? data.weather[0].id : 800;
//   updateBackground(weatherId, isNight);
  
//   // Format details safely
//   var visibilityKm = data.visibility ? (data.visibility / 1000).toFixed(1) : '--';
//   var windUnit = units === 'metric' ? 'm/s' : 'mph';
//   var windSpeed = data.wind && data.wind.speed !== undefined ? data.wind.speed : '--';
//   var pressure = data.main && data.main.pressure ? data.main.pressure : '--';
//   var humidity = data.main && data.main.humidity !== undefined ? data.main.humidity : '--';
//   var clouds = data.clouds && data.clouds.all !== undefined ? data.clouds.all : '--';
  
//   var sunriseTime = '--';
//   var sunsetTime = '--';
//   try {
//     if (sunrise) {
//       sunriseTime = new Date(sunrise * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
//     }
//     if (sunset) {
//       sunsetTime = new Date(sunset * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
//     }
//   } catch (e) {
//     // Keep default values
//   }
  
//   detailsEl.innerHTML = '<li>' + icons.humidity + '<span>Humidity</span><strong>' + humidity + '%</strong></li>' +
//     '<li>' + icons.wind + '<span>Wind</span><strong>' + windSpeed + ' ' + windUnit + '</strong></li>' +
//     '<li>' + icons.pressure + '<span>Pressure</span><strong>' + pressure + ' hPa</strong></li>' +
//     '<li>' + icons.visibility + '<span>Visibility</span><strong>' + visibilityKm + ' km</strong></li>' +
//     '<li>' + icons.clouds + '<span>Clouds</span><strong>' + clouds + '%</strong></li>' +
//     '<li>' + icons.sunrise + '<span>Sunrise</span><strong>' + sunriseTime + '</strong></li>' +
//     '<li>' + icons.sunset + '<span>Sunset</span><strong>' + sunsetTime + '</strong></li>';
// }

// function renderForecast(list, units) {
//   if (!list || !Array.isArray(list)) {
//     hideElement(forecastSection);
//     return;
//   }
  
//   showElement(forecastSection);
//   forecastCards.innerHTML = '';
//   var days = extractDailyForecast(list);
//   var unitSymbol = units === 'metric' ? '°C' : '°F';
  
//   if (days.length === 0) {
//     hideElement(forecastSection);
//     return;
//   }
  
//   days.forEach(function(item, index) {
//     if (!item || !item.dt || !item.main || !item.weather) return;
    
//     var date = new Date(item.dt * 1000);
//     var el = document.createElement('div');
//     el.className = 'forecast-card';
//     el.style.animationDelay = (0.1 + index * 0.05) + 's';
    
//     var dayStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
//     var icon = iconUrl(item.weather[0].icon);
//     var desc = item.weather[0].description;
//     var tempMax = item.main.temp_max ? Math.round(item.main.temp_max) : '--';
//     var tempMin = item.main.temp_min ? Math.round(item.main.temp_min) : '--';
//     var tempStr = tempMax + '° / ' + tempMin + '°' + unitSymbol;
    
//     el.innerHTML = '<div class="date">' + dayStr + '</div>' +
//       '<img src="' + icon + '" alt="' + desc + '">' +
//       '<div class="temp"><strong>' + tempStr + '</strong></div>' +
//       '<div class="desc">' + desc + '</div>';
    
//     forecastCards.appendChild(el);
//   });
// }

// // ===== fetch =====
// async function fetchWeatherByCity(city, units) {
//   if (!units) units = currentUnits;
//   showLoader();
//   lastCity = city;
  
//   try {
//     var currentRes = await fetch(CURRENT_URL(city, units));
//     var forecastRes = await fetch(FORECAST_URL(city, units));

//     if (!currentRes.ok) {
//       var errData = await currentRes.json();
//       throw new Error(errData.error || 'City not found. Please check the city name.');
//     }
//     if (!forecastRes.ok) throw new Error('Forecast not available');

//     var currentData = await currentRes.json();
//     var forecastData = await forecastRes.json();

//     hideLoader();
//     renderCurrent(currentData, units);
//     renderForecast(forecastData.list || forecastData, units);
    
//     currentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   } catch (err) {
//     hideLoader();
//     // Show more helpful error message
//     var errorMsg = err.message || 'Failed to fetch weather data.';
//     if (errorMsg.includes('Failed to fetch')) {
//       errorMsg = 'Cannot connect to server. Make sure the server is running (node server.js)';
//     }
//     showError(errorMsg);
//   }
// }

// async function fetchWeatherByCoords(lat, lon, units) {
//   if (!units) units = currentUnits;
//   showLoader();
  
//   try {
//     var currentRes = await fetch(CURRENT_BY_COORDS(lat, lon, units));
//     var forecastRes = await fetch(FORECAST_BY_COORDS(lat, lon, units));

//     if (!currentRes.ok) {
//       var errData = await currentRes.json();
//       throw new Error(errData.error || 'Weather data not found for this location.');
//     }
//     if (!forecastRes.ok) throw new Error('Forecast not available');

//     var currentData = await currentRes.json();
//     var forecastData = await forecastRes.json();

//     hideLoader();
//     renderCurrent(currentData, units);
//     renderForecast(forecastData.list || forecastData, units);
    
//     searchInput.value = currentData.name;
//     lastCity = currentData.name;
    
//     currentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   } catch (err) {
//     hideLoader();
//     var errorMsg = err.message || 'Failed to fetch weather data.';
//     if (errorMsg.includes('Failed to fetch')) {
//       errorMsg = 'Cannot connect to server. Make sure the server is running (node server.js)';
//     }
//     showError(errorMsg);
//   }
// }

// // ===== user interactions =====
// function handleSearch() {
//   var city = searchInput.value.trim();
//   if (!city) {
//     showError('Please enter a city name');
//     searchInput.focus();
//     return;
//   }
//   fetchWeatherByCity(city);
// }

// searchBtn.addEventListener('click', handleSearch);

// searchInput.addEventListener('keypress', function(e) {
//   if (e.key === 'Enter') {
//     handleSearch();
//   }
// });

// geoBtn.addEventListener('click', function() {
//   if (!navigator.geolocation) {
//     showError('Geolocation is not supported by your browser');
//     return;
//   }
  
//   showLoader();
  
//   navigator.geolocation.getCurrentPosition(
//     function(pos) { fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude); },
//     function(err) {
//       hideLoader();
//       showError('Unable to get your location. Please enable location access or search manually.');
//     }
//   );
// });

// unitsSelect.addEventListener('change', function() {
//   currentUnits = unitsSelect.value;
//   if (lastCity) {
//     fetchWeatherByCity(lastCity);
//   }
// });

// retryBtn.addEventListener('click', function() {
//   if (lastCity) {
//     fetchWeatherByCity(lastCity);
//   } else {
//     var city = searchInput.value.trim();
//     if (city) {
//       fetchWeatherByCity(city);
//     } else {
//       // Default to New York
//       fetchWeatherByCity('New York');
//     }
//   }
// });

// window.addEventListener('load', function() {
//   searchInput.focus();
//   // Show a message to start the server if not running
//   showError('Please start the server: Run "node server.js" in terminal, then refresh this page');
//   hideLoader();
// });

// document.addEventListener('keydown', function(e) {
//   if (e.key === 'Escape' && !errorBox.classList.contains('hidden')) {
//     clearError();
//     searchInput.focus();
//   }
// });





/* =====================================================
   WEATHER DASHBOARD — FRONTEND (PROXY BASED)
   No API key exposed — uses /api routes
===================================================== */

// ===== API ENDPOINTS VIA BACKEND =====
const CURRENT_URL = (city, units) =>
  `/api/weather?q=${encodeURIComponent(city)}&units=${units}`;

const CURRENT_BY_COORDS = (lat, lon, units) =>
  `/api/weather?lat=${lat}&lon=${lon}&units=${units}`;

const FORECAST_URL = (city, units) =>
  `/api/forecast?q=${encodeURIComponent(city)}&units=${units}`;

const FORECAST_BY_COORDS = (lat, lon, units) =>
  `/api/forecast?lat=${lat}&lon=${lon}&units=${units}`;


// ===== DOM =====
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const unitsSelect = document.getElementById("units");
const retryBtn = document.getElementById("retryBtn");

const currentSection = document.getElementById("current");
const forecastSection = document.getElementById("forecast");

const cityNameEl = document.getElementById("cityName");
const timeEl = document.getElementById("time");
const lastUpdatedEl = document.getElementById("lastUpdated");
const weatherIcon = document.getElementById("weatherIcon");
const tempEl = document.getElementById("temp");
const feelsLikeEl = document.getElementById("feelsLike");
const descEl = document.getElementById("description");
const detailsEl = document.getElementById("details");

const forecastCards = document.getElementById("forecastCards");

const errorBox = document.getElementById("error");
const errorMessage = document.getElementById("errorMessage");
const loader = document.getElementById("loader");

let currentUnits = unitsSelect.value || "metric";
let lastCity = "";


// ===== HELPERS =====
function show(el){ el.classList.remove("hidden"); }
function hide(el){ el.classList.add("hidden"); }

function showError(msg){
  errorMessage.textContent = msg;
  show(errorBox);
}

function clearError(){
  hide(errorBox);
}

function showLoader(){
  hide(currentSection);
  hide(forecastSection);
  show(loader);
}

function hideLoader(){
  hide(loader);
}

function iconUrl(code){
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}


/* =====================================================
   DAILY FORECAST AGGREGATION (REAL MIN/MAX)
===================================================== */
function extractDailyForecast(list){

  if(!list || !Array.isArray(list)) return [];

  const map = {};

  list.forEach(item => {

    const date = item.dt_txt.split(" ")[0];

    if(!map[date]){
      map[date] = {
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        desc: item.weather[0].description
      };
    }else{
      map[date].min = Math.min(map[date].min, item.main.temp_min);
      map[date].max = Math.max(map[date].max, item.main.temp_max);
    }

  });

  return Object.keys(map)
    .slice(0,5)
    .map(date => ({ date, ...map[date] }));
}


/* =====================================================
   RENDER CURRENT WEATHER
===================================================== */
function renderCurrent(data, units){

  if(!data || !data.main){
    showError("Invalid weather data");
    return;
  }

  clearError();
  show(currentSection);

  cityNameEl.textContent =
    `${data.name}, ${data.sys.country}`;

  timeEl.textContent =
    new Date().toLocaleString();

  lastUpdatedEl.textContent =
    "Updated just now";

  weatherIcon.src =
    iconUrl(data.weather[0].icon);

  const unit = units === "metric" ? "°C" : "°F";

  tempEl.textContent =
    Math.round(data.main.temp) + unit;

  feelsLikeEl.textContent =
    "Feels like " +
    Math.round(data.main.feels_like) +
    unit;

  descEl.textContent =
    data.weather[0].description;

  detailsEl.innerHTML = `
    <li>Humidity: ${data.main.humidity}%</li>
    <li>Wind: ${data.wind.speed} ${units==="metric"?"m/s":"mph"}</li>
    <li>Pressure: ${data.main.pressure} hPa</li>
  `;
}


/* =====================================================
   RENDER FORECAST
===================================================== */
function renderForecast(list, units){

  const days = extractDailyForecast(list);

  if(!days.length){
    hide(forecastSection);
    return;
  }

  show(forecastSection);
  forecastCards.innerHTML = "";

  const unit = units === "metric" ? "°C" : "°F";

  days.forEach(day => {

    const el = document.createElement("div");
    el.className = "forecast-card";

    el.innerHTML = `
      <div>${new Date(day.date).toDateString()}</div>
      <img src="${iconUrl(day.icon)}">
      <div><strong>
        ${Math.round(day.max)} /
        ${Math.round(day.min)} ${unit}
      </strong></div>
      <div>${day.desc}</div>
    `;

    forecastCards.appendChild(el);
  });
}


/* =====================================================
   FETCH WEATHER
===================================================== */
async function fetchWeatherByCity(city, units=currentUnits){

  showLoader();
  lastCity = city;

  try{

    const [cRes,fRes] = await Promise.all([
      fetch(CURRENT_URL(city,units)),
      fetch(FORECAST_URL(city,units))
    ]);

    if(!cRes.ok) throw new Error("City not found");
    if(!fRes.ok) throw new Error("Forecast unavailable");

    const currentData = await cRes.json();
    const forecastData = await fRes.json();

    hideLoader();

    renderCurrent(currentData,units);
    renderForecast(forecastData.list,units);

  }catch(err){

    hideLoader();

    if(err.message.includes("Failed to fetch")){
      showError(
        "Cannot connect to backend server. Run node server.js"
      );
    }else{
      showError(err.message);
    }
  }
}


/* =====================================================
   GEOLOCATION
===================================================== */
geoBtn.onclick = () => {

  if(!navigator.geolocation)
    return showError("Geolocation not supported");

  navigator.geolocation.getCurrentPosition(
    pos => {
      fetchWeatherByCity(
        `${pos.coords.latitude},${pos.coords.longitude}`
      );
    },
    () => showError("Location access denied")
  );
};


/* =====================================================
   EVENTS
===================================================== */
searchBtn.onclick = () => {
  const city = searchInput.value.trim();
  if(!city) return showError("Enter city name");
  fetchWeatherByCity(city);
};

unitsSelect.onchange = () => {
  currentUnits = unitsSelect.value;
  if(lastCity) fetchWeatherByCity(lastCity);
};

retryBtn.onclick = () => {
  if(lastCity) fetchWeatherByCity(lastCity);
};


/* =====================================================
   DEFAULT LOAD
===================================================== */
window.onload = () => {
  fetchWeatherByCity("New York");
};