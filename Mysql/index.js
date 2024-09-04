const con = require("./config");
const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const sendMail = require("./sendMail");

app.use(express.json());
app.use(cors());
app.listen(3000, () => {
  console.log("Server started on port 3000");
});

// get
app.get("/", (req, resp) => {
  con.query(
    "select e.*, ea.* FROM Employee e INNER JOIN EmpAddress ea ON e.id =  ea.userID",
    (err, result) => {
      err ? resp.status("error", err) : resp.send(result);
    }
  );
});

// TempName, Body, Subject, html

// from: "noreply",
// to: emailAddress,
// subject: Subject,
// text: Body,
// html: `${html}`,

app.post("/api/send", sendMail, (req, res) => {
  console.log(req.body.firstName);
  con.query(
    "SELECT Subject, TempName, Body, html FROM MailTemplate",
    (err, result) => {
      if (err) {
        res.status(500).send({ message: "Error fetching email Template" });
      } else {
        const BodyMail = result[0].Body;
        const Subject = result[0].Subject;
        const html = result[0].html;

        sendMail(BodyMail, Subject, html, req, res, (error, info) => {
          if (error) {
            res.status(500).send({ message: "Error sending email" });
          } else {
            res.send({ message: "Email sent successfully", info });
          }
        });
      }
    }
  );
});

// app.post("/", (req, res) => {
//   const data = req.body;
//   const query = "INSERT INTO Employee SET ?";
//   con.query(query, data, (err, result, fields) => {
//     if (err) {
//       console.log(req.body);
//       res.status(500).send({ message: "Error inserting data", error: err });
//     } else {
//       const employeeId = result.id;
//       const address = req.body;
//       req.body.userID = employeeId;
//       const query2 = "INSERT INTO EmpAddress SET ?";
//       con.query(query2, address, (err, result) => {
//         if (err) {
//           console.log(req.body);
//           res.send(500).send({ message: "Error inserting data", error: err });
//         } else {
//           res.send(200).send({ message: "Data inserted successfully" });
//         }
//       });
//       res.send(result);
//     }
// });
// });

app.post("/api/insert", (req, res) => {
  const {
    firstName,
    lastName,
    password,
    gender,
    dateOfBirth,
    dateOfJoining,
    personalEmail,
    officeEmail,
    mobile,
    panNo,
    aadharNo,
    presentAddress,
    permanentAddress,
  } = req.body;

  // Insert into Employee table
  const employeeQuery = `INSERT INTO Employee (
      firstName,
      lastName,
      password,
      gender,
      dateOfBirth,
      dateOfJoining,
      personalEmail,
      officeEmail,
      mobile,
      panNo,
      aadharNo
    ) VALUES (
    ?,?,?,?,?,?,?,?,?,?,?
    )`;

  con.query(
    employeeQuery,
    [
      firstName,
      lastName,
      password,
      gender,
      dateOfBirth,
      dateOfJoining,
      personalEmail,
      officeEmail,
      mobile,
      panNo,
      aadharNo,
    ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: "Error inserting employee data" });
        return;
      }

      const employeeId = results.insertId;

      // Insert into EmpAddress table (Present Address)
      const presentAddressQuery = `INSERT INTO EmpAddress (
        employeeId,
        addressType,
        streetNo,
        city,
        state,
        pinCode
      ) VALUES (
      ?,?,?,?,?,?
      )`;

      con.query(
        presentAddressQuery,
        [
          employeeId,
          "Present",
          presentAddress.streetNo,
          presentAddress.city,
          presentAddress.state,
          presentAddress.pinCode,
        ],
        (err) => {
          if (err) {
            console.error(err);
            res
              .status(500)
              .send({ message: "Error inserting present address" });
            return;
          }

          // Insert into EmpAddress table (Permanent Address)
          const permanentAddressQuery = `INSERT INTO EmpAddress (
          employeeId,
          addressType,
          streetNo,
          city,
          state,
          pinCode
        ) VALUES (
        ?,?,?,?,?,?
        )`;

          con.query(
            permanentAddressQuery,
            [
              employeeId,
              "Permanent",
              permanentAddress.streetNo,
              permanentAddress.city,
              permanentAddress.state,
              permanentAddress.pinCode,
            ],
            (err) => {
              if (err) {
                console.error(err);
                res
                  .status(500)
                  .send({ message: "Error inserting permanent address" });
                return;
              }

              res.send({ message: "Data inserted successfully" });
            }
          );
        }
      );
    }
  );
});

app.get("/api/getData", (req, res) => {
  con.query(
    `
  SELECT 
    e.*, 
    e.id, 
    e.deptId AS deptId, 
    e.roleId AS roleId, 
    e.manager AS manager, 
    e.firstName, 
    e.lastName, 
    e.mobile, 
    dm.departName AS deptName, 
    rm.name AS roleName, 
    CONCAT(em.firstName, ' ', em.lastName) AS managerName ,
     rm.hierarchyLevel AS hierarchy
  FROM 
    Employee e 
    LEFT JOIN rolemaster rm ON e.roleId = rm.id 
    LEFT JOIN departmentmaster dm ON e.deptId = dm.id 
    LEFT JOIN Employee em ON e.manager = em.id
`,
    (err, result) => {
      if (err) {
        res.send("Error while fetching data");
      } else {
        res.send(result);
      }
    }
  );
});

app.put("/api/insert/:id", (req, res) => {
  const data = [
    req.body.firstName,
    req.body.lastName,
    req.body.mobile,
    req.params.id,
  ];
  con.query(
    "UPDATE Employee SET firstName = ?,lastName = ?, mobile = ? where id = ?",
    data,
    (err, result, fields) => {
      if (err) {
        res.send("Error while updating data");
      } else {
        res.send("Data updated successfully");
      }
    }
  );
});

app.put("/api/deactivate/:id", (req, res) => {
  const data = [false, req.params.id];
  con.query(
    "UPDATE Employee SET isActive = ? where id = ?",
    data,
    (err, result, fields) => {
      if (err) {
        res.send("Error while updating data");
      } else {
        res.send("User Deactivated successfully");
      }
    }
  );
});

app.get("/api/employees/:id", (req, res) => {
  const id = req.params.id;
  const query = ` SELECT 
  e.*,
    pa.streetNo AS presentStreetNo,
    pa.city AS presentCity,
    pa.state AS presentState,
    pa.pinCode AS presentPinCode,
    pe.streetNo AS permanentStreetNo,
    pe.city AS permanentCity,
    pe.state AS permanentState,
    pe.pinCode AS permanentPinCode
  FROM 
    Employee e
  LEFT JOIN 
    EmpAddress pa ON e.id = pa.employeeId AND pa.addressType = 'Present'
  LEFT JOIN 
    EmpAddress pe ON e.id = pe.employeeId AND pe.addressType = 'Permanent'
  WHERE 
    e.id =?`;

  con.query(query, id, (err, result, fields) => {
    if (err) {
      console.error(err); // log the error to the console
      res
        .status(500)
        .send({ message: "Error while Fetching data", error: err.message });
    } else {
      res.send(result);
    }
  });
});

// app.get("/api/departments/:empId", async (req, res) => {
//   const roleNamesCache = {};
//   const empId = req.params.empId;
//   const query = "SELECT deptId from Employee WHERE id=?";

//   con.query(query, empId, (err, results) => {
//     if (err) {
//       console.error(err); // log the error to the console
//       res.status(500).send({ error: "Failed to retrieve the department Id" });
//     } else {
//       const deptIds = results.map((result) => result.deptId);
//             const query2 = "SELECT name from roleMaster WHERE deptId = ?";
//       con.query(query2, deptIds, (err, results) => {
//         if (err) {
//           res
//             .status(500)
//             .send({ error: "Failed to retrieve the department Id" });
//         } else {
//           const roleNames = results.map((result) => result.name);
//           // console.log(roleNames);
//           roleNamesCache[empId] = roleNames; // Store the roleNames in the cache

//           res.send({ deptIds, roleNames });
//         }
//       });
//     }
//   });
// });

// Query for getting department id From database
app.get("/api/departments", async (req, res) => {
  const query = "SELECT  id, departName FROM DepartmentMaster";
  con.query(query, (err, results) => {
    if (err) {
      console.error(err); // log the error to the console
      res.status(500).send({ error: "Failed to retrieve the department Id" });
    } else {
      res.send(results);
    }
  });
});

// Passing the department id from the department table and then passing it to the Roles to get the roles and showing the dropdown .
app.get("/api/roles/:deptId", async (req, res) => {
  const deptId = req.params.deptId;
  const query =
    "SELECT id,name , hierarchyLevel FROM  RoleMaster Where deptId = ?";
  con.query(query, deptId, (err, results) => {
    if (err) {
      console.error(err); // log the error to the console
      res.status(500).send({ error: "Failed to retrieve roles" });
    } else {
      res.send(results);
    }
  });
});

// Query when we have deptId,roleId from the front end and then the dropdown will be created where the roles of higher heirarchy will able to manage the hierarchy of lower hierarchy

app.get("/api/manager/:deptId/:hierarchyLevel", async (req, res) => {
  const deptId = parseInt(req.params.deptId);
  const hierarchyLevel = parseInt(req.params.hierarchyLevel);

  // "Select * from e Employee  Join DepartmentMaster dm ON e.deptId = dm.id JOIN roleMaster rh ON e.roleId = rh.id JOIN roleMaster rh2 ON dm.id = rh2.deptId AND rh2.hierarchyLevel > rh.hierarchyLevel AND e.isAdmin = 1";
  var query = "";
  if (hierarchyLevel <= 2) {
    query =
      "SELECT e.id as EmpId , Concat(e.firstName , ' ', e.lastName) as EmpName, rM.hierarchyLevel as hierarchy FROM employee e JOIN rolemaster rM ON E.roleId = rM.id JOIN departmentmaster dm On e.deptId = dm.id Where rm.hierarchyLevel < ? And e.isActive  = 1  ";
  } else {
    query =
      "SELECT e.id as EmpId , Concat(e.firstName , ' ', e.lastName) as EmpName, rM.hierarchyLevel as hierarchy FROM employee e JOIN rolemaster rM ON E.roleId = rM.id JOIN departmentmaster dm On e.deptId = dm.id Where dm.id = ? and rm.hierarchyLevel < ? And e.isActive  = 1";
  }
  // execute the query with parameters.
  con.query(query, [deptId, hierarchyLevel], (err, result) => {
    if (err) {
      console.error(err); // log the error to the console
      res.status(500).send({ message: "Error fetching managers" });
    } else {
      res.send(result);
    }
  });
});

app.get("/api/this", async (req, res) => {
  console.log("this");
  res.send("Hello from /api/this");
});

app.put(
  "/api/updateEmp/:id/:deptId/:roleId/:hierarchyLevel",
  async (req, res) => {
    // console.log("Route handler reached!");
    const id = req.params.id;
    const deptId = req.params.deptId;
    const roleId = req.params.roleId;
    const hierarchyLevel = req.params.hierarchyLevel;

    try {
      // Make API request to managerApi to get manager's name
      const managerApiUrl = `http://localhost:3000/api/manager/${deptId}/${hierarchyLevel}`;
      const response = await axios.get(managerApiUrl);
      // console.log(managerApiUrl);
      const managers = response.data;
      // console.log(managers);
      let empId = [];
      if (managers && managers.length > 0) {
        managers.forEach((manager) => {
          if (manager && manager.EmpName) {
            const empName = manager.EmpName;
            empId += manager.EmpId + ", ";
            // console.log(empId);
          }
        });
      } else {
        console.log("No Managers Found");
      }

      // Update the employee record in the database
      const updateQuery =
        "UPDATE Employee SET deptId = ?, roleId = ?, manager = ?   WHERE id = ?";
      const updatedValues = [deptId, roleId, empId, id];

      con.query(updateQuery, updatedValues, (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).send({ message: "Error updating employee record" });
        } else {
          res.send({ message: "Employee record updated successfully" });
        }
      });
    } catch (error) {
      console.error("Error updating employee record:", error);
      res.status(500).send({ message: "Error updating employee record" });
    }
  }
);

app.get("/api/getNames/:id", (req, res) => {
  const id = req.params.id;
  const query = `SELECT d.departName as deptName, r.name as roleName, 
       (SELECT CONCAT(e2.firstName,' ', e2.lastName) 
        FROM employee e2 
        WHERE e2.id = e.manager) as EmpManager
FROM Employee e 
JOIN departmentMaster d ON e.deptId = d.id 
JOIN roleMaster r ON e.roleId = r.id 
WHERE e.id =?`;
  con.query(query, id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching employee details" });
    } else {
      if (results.length > 0) {
        const employee = results[0];
        res.json({
          department: { name: employee.deptName },
          role: { name: employee.roleName },
          manager: { name: employee.EmpManager },
        });
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    }
  });
});
