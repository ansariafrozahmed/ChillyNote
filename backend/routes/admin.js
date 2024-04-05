const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const authenticate = require("../lib");

//Admin Login API
app.post("/api/adminLogin", async (req, res) => {
  const { email, password } = req.body;
  const getAdminDataQuery = `SELECT * FROM admin_user WHERE user_email = '${email}'`;

  try {
    const result = await pool.query(getAdminDataQuery);

    if (result.rows.length === 0) {
      res.status(400).send("Invalid Email");
      return;
    }

    const storedHashedPassword = result.rows[0].user_password;
    const adminUser = result.rows[0];

    // Compare the provided password with the stored hashed password
    const matchPassword = await bcrypt.compare(password, storedHashedPassword);

    if (!matchPassword) {
      res.status(401).send("Invalid Password");
      return;
    }

    // Return user data upon successful login
    // console.log(adminUser.uid);

    const token = jwt.sign({ id: adminUser.uid }, process.env.SECRET_KEY, {
      expiresIn: "7h", // Token expires in 5 hour
    });
    // Set a cookie with the JWT
    // res.cookie("token", token, { httpOnly: true, secure: false }); // Set secure to true if you're using HTTPS

    // Calculate the expiry time based on the 'expiresIn' option
    const expiryTime = new Date(Date.now() + 7 * 60 * 60 * 1000); // 5 hours from now
    // const expiryTime = new Date(Date.now() + 20 * 1000); // 20 seconds from now

    res.status(200).send({
      status: 200,
      message: "Admin Login successful.",
      token,
      expiryTime,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/getAdminDetails/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const query =
    "SELECT uid, user_name, user_email, role FROM admin_user WHERE uid = $1";

  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Admin details not found");
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).send("Error fetching admin details");
  }
});

module.exports = app;
