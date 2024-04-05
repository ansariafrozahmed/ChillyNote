const express = require("express");
const cors = require("cors");
const app = express();
const admin = require("./routes/admin");
const employee = require("./routes/employee");
const projects = require("./routes/projects");
const authenticate = require("./lib");
const pool = require("./config/db");
const PORT = 4000;

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://projectmanagement.sagartech.co.in",
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

require("dotenv").config();

//All Routes
app.use(admin);
app.use(employee);
app.use(projects);

//Error Handling Middleware
app.get("/api/auth", authenticate, async (req, res) => {
  try {
    const query = "SELECT * FROM admin_user";
    const result = await pool.query(query);
    if (result.rows.length > 0) {
      res.status(200).send("Success");
    } else {
      res.status(404).send("No data found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));
