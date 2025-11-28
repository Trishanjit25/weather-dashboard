// ===== CONFIG =====
// Replace with your API key or use a proxy (see Node proxy section)
const API_KEY = 'f583c209aec9217ffa679ed72c774cc4'; // <-- replace

// endpoints
const CURRENT_URL = (city, units) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;

const CURRENT_BY_COORDS = (lat, lon, units) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

// 5 day / 3 hour forecast
const FORECAST_URL = (city, units) =>
  `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;

const FORECAST_BY_COORDS = (lat, lon, units) =>
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

// ===== DOM =====
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const unitsSelect = document.getElementById('units');

const currentSection = document.getElementById('current');
const cityNameEl = document.getElementById('cityName');
const timeEl = document.getElementById('time');
const weatherIcon = document.getElementById('weatherIcon');
const tempEl = document.getElementById('temp');
const descEl = document.getElementById('description');
const detailsEl = document.getElementById('details');

const forecastSection = document.getElementById('forecast');
const forecastCards = document.getElementById('forecastCards');

const errorBox = document.getElementById('error');

let currentUnits = unitsSelect.value || 'metric';

// ===== helpers =====
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove('hidden');
}

function clearError() {
  errorBox.classList.add('hidden');
  errorBox.textContent = '';
}

function showElement(el) { el.classList.remove('hidden'); }
function hideElement(el) { el.classList.add('hidden'); }

function iconUrl(iconCode) {
  // OWM icon set
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function formatLocalTime(ts, timezoneOffsetSeconds) {
  // ts is unix (seconds)
  const date = new Date((ts + timezoneOffsetSeconds) * 1000);
  return date.toLocaleString();
}

// pick daily snapshots from 5-day / 3-hour forecast
function extractDailyForecast(list) {
  // list: array of items every 3 hours. We'll choose approx one per day (midday).
  const days = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toISOString().slice(0,10);
    // choose item closest to 12:00
    const hour = date.getUTCHours();
    if (!days[day]) days[day] = { item, diff: Math.abs(hour - 12) };
    else {
      const d = Math.abs(hour - 12);
      if (d < days[day].diff) days[day] = { item, diff: d };
    }
  });
  return Object.values(days).map(d => d.item).slice(0,5); // 5 days
}

// ===== rendering =====
function renderCurrent(data, units) {
  clearError();
  showElement(currentSection);

  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  timeEl.textContent = formatLocalTime(data.dt, data.timezone);
  weatherIcon.src = iconUrl(data.weather[0].icon);
  weatherIcon.alt = data.weather[0].description;
  tempEl.textContent = `${Math.round(data.main.temp)} ${units === 'metric' ? '°C' : '°F'}`;
  descEl.textContent = data.weather[0].description;

  detailsEl.innerHTML = `
    <li>Humidity: ${data.main.humidity}%</li>
    <li>Wind: ${data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}</li>
    <li>Pressure: ${data.main.pressure} hPa</li>
  `;
}

function renderForecast(list, units) {
  showElement(forecastSection);
  forecastCards.innerHTML = '';
  const days = extractDailyForecast(list);
  days.forEach(item => {
    const date = new Date(item.dt * 1000);
    const el = document.createElement('div');
    el.className = 'forecast-card';
    el.innerHTML = `
      <div>${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
      <img src="${iconUrl(item.weather[0].icon)}" alt="${item.weather[0].description}">
      <div><strong>${Math.round(item.main.temp_max)} / ${Math.round(item.main.temp_min)} ${units === 'metric' ? '°C' : '°F'}</strong></div>
      <div class="muted">${item.weather[0].description}</div>
    `;
    forecastCards.appendChild(el);
  });
}

// ===== fetch =====
async function fetchWeatherByCity(city, units = currentUnits) {
  try {
    clearError();
    hideElement(currentSection);
    hideElement(forecastSection);

    const [currentRes, forecastRes] = await Promise.all([
      fetch(CURRENT_URL(city, units)),
      fetch(FORECAST_URL(city, units))
    ]);

    if (!currentRes.ok) throw new Error('City not found');
    if (!forecastRes.ok) throw new Error('Forecast not available');

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    renderCurrent(currentData, units);
    renderForecast(forecastData.list, units);
  } catch (err) {
    showError(err.message || 'Failed to fetch weather');
  }
}

async function fetchWeatherByCoords(lat, lon, units = currentUnits) {
  try {
    clearError();
    hideElement(currentSection);
    hideElement(forecastSection);

    const [currentRes, forecastRes] = await Promise.all([
      fetch(CURRENT_BY_COORDS(lat, lon, units)),
      fetch(FORECAST_BY_COORDS(lat, lon, units))
    ]);

    if (!currentRes.ok) throw new Error('Location weather not found');
    if (!forecastRes.ok) throw new Error('Forecast not available');

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    renderCurrent(currentData, units);
    renderForecast(forecastData.list, units);
  } catch (err) {
    showError(err.message || 'Failed to fetch weather');
  }
}

// ===== user interactions =====
searchBtn.addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (!city) return showError('Please enter a city name');
  fetchWeatherByCity(city);
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) return showError('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    err => showError('Unable to get location: ' + err.message)
  );
});

unitsSelect.addEventListener('change', () => {
  currentUnits = unitsSelect.value;
  // if we have a city currently shown, re-fetch (simple approach: read city name)
  const city = cityNameEl.textContent.split(',')[0];
  if (city) {
    // small safety: if there is no city shown, do nothing
    if (city.trim()) fetchWeatherByCity(city.trim());
  }
});

// show a starter weather (optional)
window.addEventListener('load', () => {
  // try a default city for quick demo
  fetchWeatherByCity('New York');
});
