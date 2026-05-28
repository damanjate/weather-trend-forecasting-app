# Weather Trend Forecasting App

## Project Overview

Weather Trend Forecasting is a full-stack weather application built using React, Node.js, Express, MySQL, and Open-Meteo API.

The application allows users to search weather forecasts by location and date range, visualize temperature and precipitation trends, save weather requests into a MySQL database, and export data as JSON.

---

## Features

* Search weather forecasts by city and date range
* Save weather requests into MySQL
* Full CRUD operations
* Temperature and precipitation charts
* Weather icons
* Loading spinner
* Export saved requests as JSON
* Responsive frontend design
* Error handling and validation

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

---

## API Endpoints

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | /                    | Home route               |
| POST   | /weather             | Create weather request   |
| GET    | /weather             | Get all weather requests |
| PUT    | /weather/:id         | Update weather request   |
| DELETE | /weather/:id         | Delete weather request   |
| GET    | /weather/export/json | Export data as JSON      |

---

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
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

## Future Improvements

* User authentication
* Weather notifications
* Dark mode
* Advanced forecasting analytics
* Mobile app version

---

## Author

Dulce Alberto Manjate
