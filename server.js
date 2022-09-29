let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mysql = require("mysql");
let cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// homepage route
app.get("/", (req, res) => {
  return res.send({
    message: "Welcome to RESTful CRUD API with NodeJS, Express, MYSQL",
    written_by: "nattanon",
  });
});
// connection to mysql database
let dbCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stocksystem",
});
dbCon.connect();
//----------------------------------------show-----------------------------------------------
app.post("/stock", (req, res) => {
  dbCon.query("SELECT * FROM stock", (error, results, fields) => {
    if (error) throw error;

    let message = "";
    if (results === undefined || results.length == 0) {
      message = "not information";
    } else {
      message = "Successfully";
    }
    return res.json(results);
  });
});
//-------------------------------------------select--------------------------------------------------------
app.get("/select/:id", (req, res) => {
  let id = req.params.id;

  if (!id) {
      return res.status(400).send({message: "Please provide id"});
  } else {
      dbCon.query("SELECT * FROM stock WHERE id = ?", [id], (error, results, fields) => {
          if (error) throw error;
          let message = "";
          if (results === undefined || results.length == 0) {
              message = "not found";
          } else {
              message = "Successfully";
          }

          return res.send({data: results[0], message: message })
      })
  }
})
//-------------------------------------------insert--------------------------------------------------------
app.post("/insert", (req, res) => {
  let name = req.body.name;
  let code = req.body.code;
  let qty = req.body.qty;
  if (!name || !code || !qty) {
    return res.status(400).send({ message: "not infor" });
  } else {
    dbCon.query(
      "INSERT INTO stock (name, code, qty) VALUES(?, ?, ?)",
      [name, code, qty],
      (error, results, fields) => {
        if (error) throw error;
        return res.send({ data: results, message: "successfully" });
      }
    );
  }
});
//-----------------------------------------------delete----------------------------------------------------
app.delete("/delete", (req, res) => {
  let id = req.body.id
  if (!id) {
      return res.stas(400).send({message: "Please provide id"});
  } else {
      dbCon.query('DELETE FROM stock WHERE stock.id = ?', [id], (error, results, fields) => {
          if (error) throw error;
          let message = "";
          if (results.affectedRows === 0) {
              message = "not information";
          } else {
              message = "successfully deleted";
          }

          return res.send({data: results, message: message })
      })
  }
})
//---------------------------------------------------------------------------------------------------
app.listen(3000, () => {
  console.log("connect successfully on port 3000");
});

module.exports = app;
