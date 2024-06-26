const express = require("express");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const app = express();
const jwt = require("jsonwebtoken");
const authenticate = require("../lib");
const sendEmail = require("../lib/email");

//LOGIN Employee API
app.post("/api/EmployeeLogin", async (req, res) => {
  const { email, password } = req.body;
  // Query
  const getEmployeeDataQuery = `SELECT * FROM all_employees WHERE employee_email = '${email}'`;

  try {
    const result = await pool.query(getEmployeeDataQuery);

    if (result.rows.length === 0) {
      res.status(400).send("Invalid Email");
      return;
    }

    const storedHashedPassword = result.rows[0].employee_password;
    const employeeUser = result.rows[0];

    // Compare the provided password with the stored hashed password
    const matchPassword = await bcrypt.compare(password, storedHashedPassword);

    if (!matchPassword) {
      res.status(401).send("Invalid Password");
      return;
    }

    // Return user data upon successful login
    // console.log(adminUser.uid);

    const token = jwt.sign({ id: employeeUser.uid }, process.env.SECRET_KEY, {
      expiresIn: "5h", // Token expires in 5 hour
    });
    // Set a cookie with the JWT
    // res.cookie("token", token, { httpOnly: true, secure: false }); // Set secure to true if you're using HTTPS

    // Calculate the expiry time based on the 'expiresIn' option
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 hour from now

    res.status(200).send({
      status: 200,
      message: "Employee Login successful.",
      token,
      expiryTime,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//ADD Employee API
app.post("/api/addEmployees", authenticate, async (req, res) => {
  const {
    employee_designation,
    employee_email,
    employee_id,
    employee_name,
    employee_password,
    employee_role,
  } = req.body;

  //Hashing Password
  const hashedPassword = await bcrypt.hash(employee_password, 10);

  try {
    const existingEmail = await pool.query(
      `SELECT * FROM all_employees WHERE employee_email = '${employee_email}'`
    );
    if (existingEmail.rows.length > 0) {
      return res.status(400).send("Email Already Exists");
    }

    const existingEmployeeId = await pool.query(
      `SELECT * FROM all_employees WHERE employee_id = '${employee_id}'`
    );
    if (existingEmployeeId.rows.length > 0) {
      return res.status(401).send("Employee ID already Exist");
    }

    //Insert Query
    const addEmployeeQuery = `INSERT INTO all_employees (employee_name, employee_email, employee_password, employee_designation, employee_id, employee_role) VALUES ($1, $2, $3, $4, $5, $6)`;

    await pool.query(addEmployeeQuery, [
      employee_name,
      employee_email,
      hashedPassword,
      employee_designation,
      employee_id,
      employee_role,
    ]);

    // Send email notification with login credentials
    const emailSubject = "Welcome to the Company!";
    const emailContent = `
      <p>Dear ${employee_name},</p>
      <p>You have been successfully added as an employee. Here are your login credentials:</p>
      <p>Email: ${employee_email}</p>
      <p>Password: ${employee_password}</p>
      <p>Employee Id: ${employee_id}</p>
      <p>Designation: ${employee_designation}</p>
      <p>Role: ${employee_role}</p>
      <p>Please keep your credentials safe and do not share them with anyone.</p>
      <p><a href=${process.env.FRONTEND_URL}/employee-login>login to your employee account</a></p>
      <p>Best regards,<br>Your Company</p>
    `;

    const emailResponse = await sendEmail(
      employee_email,
      emailSubject,
      emailContent
    );

    if (emailResponse.success) {
      res.status(200).send("Employee added successfully and email sent!");
    } else {
      res.status(500).send("Failed to send email");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//GET Employee Api
app.get("/api/getAllEmployees", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT uid, employee_name, employee_email, employee_designation, employee_id, employee_role FROM all_employees`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("INTERNAL SERVER ERROR");
  }
});

//DELETE Employee Api
app.delete("/api/deleteEmployee/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM all_employees WHERE uid = ${id}`;
    const result = await pool.query(query);
    res.status(200).send("Employee Deleted Successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//UPDATE Employee APi
app.put("/api/updateEmployee/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employee_designation,
      employee_email,
      employee_id,
      employee_name,
      employee_role,
    } = req.body;

    // Use parameterized queries to prevent SQL injection
    const updateQuery = {
      text: "UPDATE all_employees SET employee_name = $1, employee_email = $2, employee_designation = $3, employee_id = $4, employee_role = $5 WHERE uid = $6",
      values: [
        employee_name,
        employee_email,
        employee_designation,
        employee_id,
        employee_role,
        id,
      ],
    };

    const result = await pool.query(updateQuery);

    const emailSubject = "Profile Updated";
    const emailContent = `
    <p>Dear ${employee_name},</p>
    <p>Your profile has been successfully updated. Here are your updated details:</p>
    <p>Name: ${employee_name}</p>
    <p>Email: ${employee_email}</p>
    <p>Designation: ${employee_designation}</p>
    <p>Employee ID: ${employee_id}</p>
    <p>Role: ${employee_role}</p>
    <p>Please review the changes and let us know if anything needs further adjustment.</p>
    <p><a href=${process.env.FRONTEND_URL}/employee-login>login to your employee account</a></p>
    <p>Best regards,<br>Your Company</p>
    `;

    // Send email to the updated email address
    const emailResponse = await sendEmail(
      employee_email,
      emailSubject,
      emailContent
    );

    if (emailResponse.success) {
      res
        .status(200)
        .send("Employee profile updated successfully and email sent!");
    } else {
      res.status(500).send("Failed to send email");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//GET Employee Details
app.get("/api/getEmployeeDetails/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const query =
    "SELECT uid, employee_name, employee_email, employee_designation FROM all_employees WHERE uid = $1";

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
