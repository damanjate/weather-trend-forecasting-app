import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [weatherData, setWeatherData] = useState(null);
  const [savedRequests, setSavedRequests] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

  const fetchSavedRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/weather`);
      setSavedRequests(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadSavedRequests = async () => {
      const response = await axios.get(`${API_URL}/weather`);
      setSavedRequests(response.data);
    };

    loadSavedRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const response = await axios.post(`${API_URL}/weather`, {
        location,
        start_date: startDate,
        end_date: endDate
      });

      setWeatherData(response.data);
      fetchSavedRequests();

    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data. Please check the location and dates.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/weather/${id}`);
      fetchSavedRequests();
    } catch (err) {
      console.error(err);
      setError("Failed to delete record.");
    }
  };

  const getWeatherIcon = (precipitation) => {

    if (precipitation > 10) {
      return "🌧️";
    }

    if (precipitation > 0) {
      return "⛅";
    }

    return "☀️";
  };

  const handleExportJson = async () => {
    try {
      const response = await axios.get(`${API_URL}/weather/export/json`);

      const jsonData = JSON.stringify(response.data, null, 2);

      const blob = new Blob([jsonData], {
        type: "application/json"
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "weather_requests.json";
      link.click();

      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      setError("Failed to export JSON data.");
    }
 };

  const chartData = weatherData
    ? weatherData.forecast.time.map((date, index) => ({
        date,
        maxTemp: weatherData.forecast.temperature_2m_max[index],
        minTemp: weatherData.forecast.temperature_2m_min[index],
        precipitation: weatherData.forecast.precipitation_sum[index]
      }))
    : [];

  return (
    <div className="container">
      <h1>Weather Trend Forecasting</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            "Get Weather"
          )}
      </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weatherData && (
        <div className="weather-card">
          <h2>{weatherData.location}</h2>
          <p>Latitude: {weatherData.latitude}</p>
          <p>Longitude: {weatherData.longitude}</p>

          <h3>Temperature Trend</h3>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="maxTemp" name="Max Temp °C" />
                <Line type="monotone" dataKey="minTemp" name="Min Temp °C" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <h3>Precipitation</h3>

          <div className="chart-box">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="precipitation" name="Precipitation mm" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <h3>Forecast Summary</h3>

          <div className="forecast-grid">
            {weatherData.forecast.time.map((date, index) => (
              <div className="forecast-card" key={index}>
                <div className="weather-icon">
                  {getWeatherIcon(weatherData.forecast.precipitation_sum[index])}
                </div>

                <strong>{date}</strong>

                <p>
                  Max: {weatherData.forecast.temperature_2m_max[index]}°C
                </p>

                <p>
                  Min: {weatherData.forecast.temperature_2m_min[index]}°C
                </p>

                <p>
                  Rain: {weatherData.forecast.precipitation_sum[index]} mm
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      <button className="export-button" onClick={handleExportJson}>
        Export JSON
      </button>

      <div className="weather-card">
        <h2>Saved Weather Requests</h2>

        {savedRequests.length === 0 ? (
          <p>No saved requests yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {savedRequests.map((item) => (
                  <tr key={item.id}>
                    <td>{item.location_name}</td>
                    <td>{item.start_date}</td>
                    <td>{item.end_date}</td>
                    <td>{item.created_at}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;