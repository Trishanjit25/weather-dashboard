// server.js - simple proxy
require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const app = express();
const PORT = process.env.PORT || 3000;
const KEY = process.env.OPENWEATHER_API_KEY;

if (!KEY) {
  console.error('Missing OPENWEATHER_API_KEY in .env');
  process.exit(1);
}

app.use(express.static('public')); // serve static files if you copy your frontend to /public

// proxy: /api/weather?q=London&units=metric
app.get('/api/weather', async (req, res) => {
  try {
    const q = req.query.q;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const units = req.query.units || 'metric';

    let url;
    if (q) url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=${units}&appid=${KEY}`;
    else if (lat && lon) url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`;
    else return res.status(400).json({error: 'q or lat+lon required'});

    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get('/api/forecast', async (req, res) => {
  try {
    const q = req.query.q;
    const lat = req.query.lat;
    const lon = req.query.lon;
    const units = req.query.units || 'metric';

    let url;
    if (q) url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&units=${units}&appid=${KEY}`;
    else if (lat && lon) url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${KEY}`;
    else return res.status(400).json({error: 'q or lat+lon required'});

    const r = await fetch(url);
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
