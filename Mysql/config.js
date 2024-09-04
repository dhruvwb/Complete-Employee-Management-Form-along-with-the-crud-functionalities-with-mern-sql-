const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localHost",
  user: "root",
  password: "",
  database: "Employee Management",
});

con.connect((err) => {
  err ? console.warn("error", err) : console.log("Connected");
});

module.exports = con;
