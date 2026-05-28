const mysql = require("mysql2/promise");

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1234",
      database: "weather_trend_db"
    });

    console.log("Connected successfully");
    await connection.end();

  } catch (error) {
    console.log("Connection failed:");
    console.log(error.message);
  }
}

testConnection();