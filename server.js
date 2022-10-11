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
  host: "b9z0ryhnra16h6oi7fiu-mysql.services.clever-cloud.com",
  user: "uzwh6iipjqdzjgtv",
  password: "Rj95lB6BE0uHyRn9Ug7j",
  database: "b9z0ryhnra16h6oi7fiu",
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
  let Category = req.body.Category;
  let PartNo = req.body.PartNo;
  let Value = req.body.Value;
  let quantity = req.body.quantity;

  if (!Category || !PartNo || !Value || !quantity ) {
    return res.status(400).send({ message: "not infor" });
  } else {
    dbCon.query(
      "INSERT INTO stock(Category, PartNo, Value, quantity) VALUES(?, ?, ?, ?)",
      [Category, PartNo, Value, quantity],
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
//-----------------------------------update----------------------------------------------------------------
app.post('/update', (req, res) => {
  let id = req.body.id;
  let Category = req.body.Category;
  let PartNo = req.body.PartNo;
  let Value = req.body.Value;
  let quantity = req.body.quantity;

  // validation
  if ( !id || !Category || !PartNo || !Value || !quantity ) {
      return res.status(400).send({ message: 'not information'});
  } else {
      dbCon.query('UPDATE stock SET Category = ?, PartNo = ?, Value = ?, quantity = ? WHERE id = ?', 
      [Category, PartNo, Value, quantity, id], (error, results, fields) => {
          if (error) throw error;

          let message = "";
          if (results.changedRows === 0) {
              message = "not found or data are same";
          } else {
              message = "successfully updated";
          }

          return res.send({data: results, message: message })
      })
  }
})
//--------------------------------------------Update Qty-----------------------------------------------------
app.post('/updateqty', (req, res) => {
  let id = req.body.id;
  let quantity = req.body.quantity;

  // validation
  if ( !id || !quantity ) {
      return res.status(400).send({ message: 'not information'});
  } else {
      dbCon.query('UPDATE stock SET quantity = ? WHERE id = ?', 
      [quantity , id], (error, results, fields) => {
          if (error) throw error;

          let message = "";
          if (results.changedRows === 0) {
              message = "not found or data are same";
          } else {
              message = "successfully updated";
          }

          return res.send({data: results, message: message })
      })
  }
})
//---------------------------------------------------------------------------------------------------
app.post("/stockuser", (req, res) => {
  dbCon.query("SELECT * FROM inputuser", (error, results, fields) => {
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
//---------------------------------------------------------------------------------------------------

app.post("/insertuser", (req, res) => {
  let Category = req.body.Category;
  let PartNo = req.body.PartNo;
  let Value = req.body.Value;
  let quantity = req.body.quantity;
  let user = req.body.user;

  if (!Category || !PartNo || !Value || !quantity || !user ) {
    return res.status(400).send({ message: "not infor" });
  } else {
    dbCon.query(
      "INSERT INTO inputuser(Category, PartNo, Value, quantity, user) VALUES(?, ?, ?, ?, ?)",
      [Category, PartNo, Value, quantity, user ],
      (error, results, fields) => {
        if (error) throw error;
        return res.send({ data: results, message: "successfully" });
      }
    );
  }
});

app.listen(3000, () => {
  console.log("connect successfully on port 3000");
});

module.exports = app;
