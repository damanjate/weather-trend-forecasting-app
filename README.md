# Weather Trend Forecasting App

## Project Overview

Weather Trend Forecasting is a full-stack weather application developed using React, Vite, Node.js, Express, MySQL, Open-Meteo API, and Google Maps integration.

The application allows users to search weather information by location and date range, view current weather conditions, analyze weather trends through charts, store weather requests in a database, export data as JSON, and visualize locations on Google Maps.

This project was developed as part of the AI Engineer Internship Technical Assessment.

---

## Features

### Weather Search

* Search weather by city and date range
* Validate location and date inputs
* Retrieve real-time weather information using Open-Meteo API

### Current Weather

* Current temperature
* Humidity
* Wind speed
* Precipitation

### Weather Forecast

* 5-day weather forecast
* Daily maximum temperature
* Daily minimum temperature
* Daily precipitation

### Data Visualization

* Temperature trend line chart
* Precipitation bar chart
* Forecast summary cards with weather icons

### Database Persistence

* Save weather requests into MySQL
* View all previous weather requests
* Track total weather requests

### CRUD Operations

* Create weather requests
* Read weather requests
* Update weather requests
* Delete weather requests

### Additional API Integration

* Google Maps integration
* View searched locations directly on Google Maps

### Data Export

* Export stored weather requests as JSON

### User Experience

* Responsive design
* Loading spinner
* Error handling and validation
* User-friendly dashboard interface

---

## Technologies Used

### Frontend

* React
* Vite
* Axios
* Recharts
* CSS

### Backend

* Node.js
* Express.js
* MySQL
* Open-Meteo API

### External Integrations

* Open-Meteo API
* Google Maps

---

## System Architecture

Frontend (React)
↓
REST API (Express)
↓
Open-Meteo API
↓
MySQL Database

---

## API Endpoints

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | /                    | Home Route             |
| POST   | /weather             | Create Weather Request |
| GET    | /weather             | Read Weather Requests  |
| PUT    | /weather/:id         | Update Weather Request |
| DELETE | /weather/:id         | Delete Weather Request |
| GET    | /weather/export/json | Export Data as JSON    |

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd weather-trend-app
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

Create a MySQL database:

```sql
CREATE DATABASE weather_trend_db;
```

Update database credentials inside:

```text
backend/database.js
```

---

## Project Structure

```text
weather-trend-app
│
├── backend
│   ├── server.js
│   ├── database.js
│   ├── package.json
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│
├── README.md
├── .gitignore
```

---

## PM Accelerator

This project was developed as part of the AI Engineer Internship Technical Assessment.

PM Accelerator helps aspiring professionals gain practical experience through real-world projects, mentorship, and career development opportunities in Product Management, Artificial Intelligence, Technology, and Innovation.

---

## Future Improvements

* User authentication
* Weather notifications
* Dark mode
* Advanced forecasting analytics
* Historical weather analysis
* Mobile application version

---

## Author

**Dulce Alberto Manjate**

Software Engineer | AI & Machine Learning Researcher

Mozambique
