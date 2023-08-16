const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const server = express();
server.use(bodyParser.json());

const cors = require("cors");
server.use(cors());
// database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dotlist",
});

db.connect(function (error) {
  if (error) {
    console.log("Error Connecting to DB  :--" + error);
  } else {
    console.log("successfully Connected to DB!... ");
  }
});

server.listen(8080, function check(error) {
  if (error) {
    console.log("Error.... in port !");
  } else {
    console.log("Started.port 8080");
  }
});

//Create the Records
server.post("/api/dolist/add", (req, res) => {
  let details = {
    title: req.body.title,
    status: req.body.status,
  };

  let sql = "INSERT INTO dolist SET ?";
  db.query(sql, details, (error) => {
    if (error) {
      res.send({ status: false, message: "task created Failed" });
    } else {
      res.send({ status: true, message: "task created successfully" });
    }
  });
});

//view the Records
server.get("/api/dolist", (req, res) => {
  var sql = "SELECT * FROM dolist";
  db.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});

//Search the Records
server.get("/api/dolist/:id", (req, res) => {
  var Taskid = req.params.id;
  console.log("Fetching task with ID:", Taskid);

  var sql = "SELECT * FROM dolist WHERE id=" + Taskid;
  db.query(sql, function (error, result) {
    if (error) {
      console.error("Error querying database:", error);
      res.send({ status: false, error: "Error querying database" });
    } else {
      console.log("Retrieved task data:", result);
      res.send({ status: true, data: result });
    }
  });
});

//Update the Records
server.put("/api/task/update/:id", (req, res) => {
  let sql =
    "UPDATE dolist SET status='" +
    req.body.status +
    "'  WHERE id=" +
    req.params.id;

  let a = db.query(sql, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Task Updated Failed" });
    } else {
      res.send({ status: true, message: "Task Updated successfully" });
    }
  });
});

//Delete the Records
server.delete("/api/dolist/delete/:id", (req, res) => {
  let sql = "DELETE FROM dolist WHERE id=?";
  let query = db.query(sql, [req.params.id], (error) => {
    if (error) {
      res.send({ status: false, message: "Task deletion failed" });
    } else {
      res.send({ status: true, message: "Task deleted successfully" });
    }
  });
});
