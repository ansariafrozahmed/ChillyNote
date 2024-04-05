const express = require("express");
const pool = require("../config/db");
const nodemailer = require("nodemailer");
const app = express();
const authenticate = require("../lib");

//POST Projects Adding API
// app.post("/api/addNewProject", async (req, res) => {
//   const {
//     project_name,
//     project_description,
//     project_start,
//     project_end,
//     assigned_employee_id,
//     modules,
//     note,
//     status,
//   } = req.body;

//   try {
//     const addProjectQuery = `
//   INSERT INTO all_projects (
//     project_name,
//     project_description,
//     project_start_date,
//     project_end_date,
//     assigned_employee_id,
//     modules,
//     additional_note,
//     project_status
//   )
//   VALUES (
//     '${project_name}',
//     '${project_description}',
//     '${project_start}',
//     '${project_end}',
//     '{${assigned_employee_id.join(",")}}',
//     '${JSON.stringify(modules)}',
//     '${note}',
//     '${status}'
//   );
// `;

//     const result = await pool.query(addProjectQuery);

//     res.status(200).send("SUCCESS!");
//   } catch (error) {
//     console.log(error, "INTERNAL SERVER ERROR");
//     res.status(500).send("Internal Server Error");
//   }
// });

//ADD projects and notify employee on mail API
app.post("/api/addNewProjectWithEmail", authenticate, async (req, res) => {
  const {
    project_name,
    project_description,
    project_start,
    project_end,
    assigned_employee_id,
    modules,
    note,
    status,
  } = req.body;

  try {
    // Insert project into all_projects table
    const addProjectQuery = `
      INSERT INTO all_projects (
        project_name, 
        project_description, 
        project_start_date, 
        project_end_date, 
        assigned_employee_id, 
        modules, 
        additional_note, 
        project_status
      )
      VALUES (
        '${project_name}', 
        '${project_description}', 
        '${project_start}', 
        '${project_end}', 
        '{${assigned_employee_id.join(",")}}', 
        '${JSON.stringify(modules)}', 
        '${note}', 
        '${status}'
      );
    `;

    const result = await pool.query(addProjectQuery);

    // Fetch employee emails from all_employees table
    const getEmployeeEmailsQuery = `
      SELECT employee_email 
      FROM all_employees 
      WHERE employee_id = ANY($1)
    `;
    const employeeEmailsResult = await pool.query(getEmployeeEmailsQuery, [
      assigned_employee_id,
    ]);
    const employeeEmails = employeeEmailsResult.rows.map(
      (row) => row.employee_email
    );

    // Send emails using Nodemailer
    const transporter = nodemailer.createTransport({
      /* transporter configuration */
      service: "gmail",
      auth: {
        user: "ansariafroz720@gmail.com",
        pass: "saab jfnz zfrc qgfx",
      },
    });

    const mailOptions = {
      from: "ansariafroz720@gmail.com",
      to: employeeEmails.join(", "), // Joining all employee emails separated by comma
      subject: "New Project Notification",
      html: `
        <html>
          <body>
            <h2>Dear Employee,</h2>
            <h3>A new project <b>"${project_name}"</b> has been assigned to you.</h3>
            <h3>Project Description: ${project_description}</h3>
            <h3>Project Start Date: ${new Date(
              project_start
            ).toLocaleDateString()}</h3>
            <h3>Project End Date: ${new Date(
              project_end
            ).toLocaleDateString()}</h3>
            <h3>Thank you.</h3>
            <b>Kindly login to the panel and know more..</b>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Email sent:", info.response);
        res.status(200).send("SUCCESS!");
      }
    });
  } catch (error) {
    console.log(error, "INTERNAL SERVER ERROR");
    res.status(500).send("Internal Server Error");
  }
});

// GET All Projects API
app.get("/api/getAllProjects", authenticate, async (req, res) => {
  try {
    const getQuery = `
      SELECT 
        p.*, 
        json_agg(e.*) AS assigned_employees
      FROM 
        all_projects p
      LEFT JOIN 
        all_employees e ON e.employee_id = ANY(p.assigned_employee_id)
      GROUP BY 
        p.project_id
    `;
    const result = await pool.query(getQuery);

    res.status(200).send(result.rows);
  } catch (error) {
    console.error("Error fetching all projects:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//DELETE Project API
app.delete("/api/deleteProject/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM all_projects WHERE project_id = ${id}`;
    const result = await pool.query(query);
    res.status(200).send("Project Deleted Successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//DELETE Multiple Project API
app.delete("/api/deleteMultipleProjects", authenticate, async (req, res) => {
  try {
    const { ids } = req.body;

    const query = `DELETE FROM all_projects WHERE project_id = ANY($1)`;

    const result = await pool.query(query, [ids]);

    // Assuming the query was successful
    res.status(200).send("Projects Deleted Successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//UPDATE Project API
app.put("/api/updateProject/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.body);
    const {
      project_name,
      project_description,
      project_start_date,
      project_end_date,
      project_status,
      assigned_employee_id,
      modules,
      additional_note,
    } = req.body;

    // Use parameterized queries to prevent SQL injection
    const updateQuery = {
      text: "UPDATE all_projects SET project_name = $1, project_description = $2, project_start_date = $3, project_end_date = $4, project_status = $5, assigned_employee_id = $6, modules = $7, additional_note = $8 WHERE project_id = $9",
      values: [
        project_name,
        project_description,
        project_start_date,
        project_end_date,
        project_status,
        assigned_employee_id,
        JSON.stringify(modules),
        additional_note,
        id,
      ],
    };

    const result = await pool.query(updateQuery);
    // console.log(result);
    res.status(200).send("SUCCESS!!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//GET Project By Employee ID API
app.get("/api/getProjectById/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const getProjectByIdQuery = `
      SELECT all_projects.*, json_agg(all_employees.*) as assigned_employees
      FROM all_projects
      JOIN all_employees ON all_projects.assigned_employee_id @> ARRAY[all_employees.employee_id]
      WHERE $1 = ANY(all_projects.assigned_employee_id)
      GROUP BY all_projects.project_id
    `;

    const result = await pool.query(getProjectByIdQuery, [id]);

    // Manipulate the result to format the output as desired
    const formattedResult = result.rows.map((row) => ({
      ...row,
      assigned_employees: Array.isArray(row.assigned_employees)
        ? row.assigned_employees
        : [row.assigned_employees],
    }));

    res.status(200).send(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//UPDATE Project Status
app.put("/api/updateProjectStatus/:id", authenticate, async (req, res) => {
  const { project_name, modules, project_status } = req.body.values;
  const { doubtStatus } = req.body;
  const { id } = req.params;

  try {
    const updateProjectStatusQuery = `UPDATE all_projects SET project_status = '${project_status}', modules = '${JSON.stringify(
      modules
    )}' WHERE project_id = ${id};`;

    const result = await pool.query(updateProjectStatusQuery);

    // Send emails using Nodemailer
    const transporter = nodemailer.createTransport({
      /* transporter configuration */
      service: "gmail",
      auth: {
        user: "ansariafroz720@gmail.com",
        pass: "saab jfnz zfrc qgfx",
      },
    });

    const mailOptions = {
      from: "ansariafroz720@gmail.com",
      to: "ansariafroz720@gmail.com",
      subject: "Doubt Alert",
      html: `
        <html>
          <body>
            <h2>Dear Admin,</h2>
            <h3>A new query arrived in project <b>"${project_name}"</b></h3>
            <h3>Thank you.</h3>
            <b>Kindly login to the panel and know more..</b>
          </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        res.status(500).send("Internal Server Error");
      } else {
        console.log("Email sent:", info.response);
        res.status(200).send("SUCCESS!");
      }
    });

    res.status(200).send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//GET Projects List by employee id
app.get(
  "/api/getEmployeesAllProjects/:id",
  authenticate,
  async function (req, res) {
    const { id } = req.params;

    try {
      const employeeQuery = `
      SELECT 
        employee_name,
        employee_email,
        employee_id,
        employee_designation
      FROM 
        all_employees
      WHERE 
        employee_id = ${id}
    `;

      const employeeResult = await pool.query(employeeQuery);

      if (employeeResult.rowCount === 0) {
        console.log("Employee not found");
        return res.status(404).send("Employee not found");
      }

      const projectsQuery = `
      SELECT 
        ap.project_name,
        ap.project_status
      FROM 
        all_projects ap
      JOIN 
        all_employees ae ON ae.employee_id = ANY(ap.assigned_employee_id)
      WHERE 
        ae.employee_id = ${id}
    `;

      const projectsResult = await pool.query(projectsQuery);
      const employeeData = employeeResult.rows[0];
      const projectsData = projectsResult.rows;

      const responseData = {
        employee_name: employeeData.employee_name,
        employee_email: employeeData.employee_email,
        employee_id: employeeData.employee_id,
        employee_designation: employeeData.employee_designation,
        projects: projectsData.map((project) => ({
          project_name: project.project_name,
          project_status: project.project_status,
        })),
      };

      res.json(responseData);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

//GET Project Detail by ID
app.post("/api/projectDetail", authenticate, async (req, res) => {
  const { pid } = req.body;
  try {
    const query = "SELECT * FROM all_projects WHERE project_id=$1";
    const result = await pool.query(query, [pid]);
    if (result.rowCount === 0) {
      return res.status(404).send("Project Not Found");
    }
    res.status(200).send(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = app;
