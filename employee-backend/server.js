const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Create MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Admin@123",
  database: "COMPANY"
});

// 🔹 Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});


// 🔹 GET ALL DESIGNATIONS
app.get("/designations", (req, res) => {

  const sql = "SELECT * FROM designation";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Designation Fetch Error:", err);
      return res.status(500).send("Database Error");
    }

    res.json(result);
  });

});


// 🔹 INSERT EMPLOYEE
app.post("/add-employee", (req, res) => {

  const {
    employee_id,
    full_name,
    department_name,
    designation_id,
    communication_address,
    permanent_address
  } = req.body;

  const sql = `
    INSERT INTO employee 
    (employee_id, full_name, department_name, designation_id, communication_address, permanent_address) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      employee_id,
      full_name,
      department_name,
      designation_id,
      communication_address,
      permanent_address
    ],
    (err, result) => {
      if (err) {
        console.log("Insert Error:", err);
        return res.status(500).send("Database Error");
      }

      res.send("Employee inserted successfully");
    }
  );

});


// 🔹 GET ALL EMPLOYEES (JOIN DESIGNATION)
app.get("/employees", (req, res) => {

  const sql = `
    SELECT 
      e.employee_id,
      e.full_name,
      e.department_name,
      d.designation_title,
      e.communication_address,
      e.permanent_address
    FROM employee e
    JOIN designation d
    ON e.designation_id = d.designation_id
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log("Fetch Error:", err);
      return res.status(500).send("Database Error");
    }

    res.json(result);

  });

});


// 🔹 UPDATE EMPLOYEE
app.put("/update-employee/:id", (req, res) => {

  const id = req.params.id;

  const {
    full_name,
    department_name,
    designation_id,
    communication_address,
    permanent_address
  } = req.body;

  const sql = `
    UPDATE employee 
    SET full_name=?, department_name=?, designation_id=?, 
        communication_address=?, permanent_address=? 
    WHERE employee_id=?
  `;

  db.query(
    sql,
    [
      full_name,
      department_name,
      designation_id,
      communication_address,
      permanent_address,
      id
    ],
    (err, result) => {

      if (err) {
        console.log("Update Error:", err);
        return res.status(500).send("Database Error");
      }

      res.send("Employee updated successfully");

    }
  );

});


// 🔹 DELETE EMPLOYEE
app.delete("/delete-employee/:id", (req, res) => {

  const id = req.params.id;

  const sql = "DELETE FROM employee WHERE employee_id=?";

  db.query(sql, [id], (err, result) => {

    if (err) {
      console.log("Delete Error:", err);
      return res.status(500).send("Database Error");
    }

    res.send("Employee deleted successfully");

  });

});


// 🔹 START SERVER
app.listen(3001, () => {
  console.log("Server started on port 3001");
});