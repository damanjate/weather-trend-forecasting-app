const express = require("express");
const cors = require("cors");
const axios = require("axios");
const pool = require("./database");

require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/*
==================================================
HELPER FUNCTIONS
==================================================
*/

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

async function getWeatherData(location, start_date, end_date) {
  const geoUrl =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;

  const geoResponse = await axios.get(geoUrl, { timeout: 10000 });

  if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
    return null;
  }

  const place = geoResponse.data.results[0];

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${place.latitude}` +
    `&longitude=${place.longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&start_date=${start_date}` +
    `&end_date=${end_date}` +
    `&timezone=auto`;

  const weatherResponse = await axios.get(weatherUrl, { timeout: 10000 });

  if (!weatherResponse.data.daily) {
    throw new Error("Weather data not available");
  }

  return {
    place,
    current: weatherResponse.data.current,
    daily: weatherResponse.data.daily
  };
}

/*
==================================================
HOME ROUTE
==================================================
*/

app.get("/", (req, res) => {
  res.json({
    message: "Weather Trend Forecasting API",
    author: "Dulce Alberto Manjate",
    assessment: "Tech Assessment #2 - Backend Engineer"
  });
});

/*
==================================================
CREATE WEATHER REQUEST
==================================================
*/

app.post("/weather", async (req, res) => {
  try {
    const { location, start_date, end_date } = req.body;

    if (!location || !start_date || !end_date) {
      return res.status(400).json({
        error: "location, start_date and end_date are required"
      });
    }

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({
        error: "start_date cannot be after end_date"
      });
    }

    const weatherData = await getWeatherData(location, start_date, end_date);

    if (!weatherData) {
      return res.status(404).json({
        error: "Location not found"
      });
    }

    const { place, current, daily } = weatherData;

    const sql = `
      INSERT INTO weather_requests
      (
        location_name,
        latitude,
        longitude,
        start_date,
        end_date,
        max_temperature,
        min_temperature,
        precipitation
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      place.name,
      place.latitude,
      place.longitude,
      start_date,
      end_date,
      JSON.stringify(daily.temperature_2m_max),
      JSON.stringify(daily.temperature_2m_min),
      JSON.stringify(daily.precipitation_sum)
    ];

    const [result] = await pool.execute(sql, values);

    res.status(201).json({
      message: "Weather data saved successfully",
      inserted_id: result.insertId,
      location: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      current,
      forecast: daily
    });

  } catch (error) {
    console.error("POST /weather error:", error.message);

    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
==================================================
READ ALL WEATHER REQUESTS
==================================================
*/

app.get("/weather", async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM weather_requests
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(sql);

    res.status(200).json(rows);

  } catch (error) {
    console.error("GET /weather error:", error.message);

    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
==================================================
UPDATE WEATHER REQUEST
==================================================
*/

app.put("/weather/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { location, start_date, end_date } = req.body;

    if (!location || !start_date || !end_date) {
      return res.status(400).json({
        error: "location, start_date and end_date are required"
      });
    }

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD"
      });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({
        error: "start_date cannot be after end_date"
      });
    }

    const weatherData = await getWeatherData(location, start_date, end_date);

    if (!weatherData) {
      return res.status(404).json({
        error: "Location not found"
      });
    }

    const { place, daily } = weatherData;

    const sql = `
      UPDATE weather_requests
      SET
        location_name = ?,
        latitude = ?,
        longitude = ?,
        start_date = ?,
        end_date = ?,
        max_temperature = ?,
        min_temperature = ?,
        precipitation = ?
      WHERE id = ?
    `;

    const values = [
      place.name,
      place.latitude,
      place.longitude,
      start_date,
      end_date,
      JSON.stringify(daily.temperature_2m_max),
      JSON.stringify(daily.temperature_2m_min),
      JSON.stringify(daily.precipitation_sum),
      id
    ];

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Weather request not found"
      });
    }

    res.status(200).json({
      message: "Weather request updated successfully"
    });

  } catch (error) {
    console.error("PUT /weather/:id error:", error.message);

    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
==================================================
DELETE WEATHER REQUEST
==================================================
*/

app.delete("/weather/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      DELETE FROM weather_requests
      WHERE id = ?
    `;

    const [result] = await pool.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Weather request not found"
      });
    }

    res.status(200).json({
      message: "Weather request deleted successfully"
    });

  } catch (error) {
    console.error("DELETE /weather/:id error:", error.message);

    res.status(500).json({
      error: "Server error"
    });
  }
});

/*
==================================================
EXPORT WEATHER REQUESTS AS JSON
==================================================
*/

app.get("/weather/export/json", async (req, res) => {

  try {

    const sql = `
      SELECT *
      FROM weather_requests
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(sql);

    res.status(200).json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Server error"
    });

  }

});

/*
==================================================
START SERVER
==================================================
*/

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});