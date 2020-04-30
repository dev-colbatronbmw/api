// contains all my product related routes
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const router = express.Router();
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "us-cdbr-iron-east-01.cleardb.net",
  user: "b08f2140990b49",
  password: "fa587cc0",
  database: "heroku_9f57e5ddb449e39",
});

function getConnection() {
  return pool;
}

//end middleware

router.delete("/product/delete/:prodId", (req, res) => {
  console.log("fetching product " + req.params.prodId);

  const connection = getConnection();
  const qString = "DELETE FROM api WHERE prodId = ?";
  const prodId = req.params.prodId;
  connection.query(qString, [prodId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for products" + err);
      res.sendStatus(500);
      res.end();
      return;
    } else {
      res.send("deleted successfuly");
      res.end();
      return;
    }
    console.log("deleted");
    console.log(prodId);

    //code modification
    const products = rows.map((row) => {
      return {
        ProductName: row.prodName,
        ProductDescription: row.prodDesc,
      };
    });

    res.json(products);
  });
});

router.get("/product/:prodId", (req, res) => {
  console.log("fetching product " + req.params.prodId);

  const connection = getConnection();
  const qString = "SELECT * FROM api WHERE prodId = ?";
  const prodId = req.params.prodId;
  connection.query(qString, [prodId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for products" + err);
      res.sendStatus(500);
      res.end();
      return;
    }
    console.log("success?");
    console.log(prodId);

    //code modification
    const products = rows.map((row) => {
      return {
        prodId: row.prodId,
        prodName: row.prodName,
        prodDesc: row.prodDesc,
        prodPrice: row.prodPrice,
        prodRating: row.prodRating,
      };
    });

    res.json(products);
  });
});

router.get("/product/edit/:prodId", (req, res) => {
  //   console.log(
  //     "fetching product testing this line object is " + req.params.prodId
  //   );

  const connection = getConnection();
  const qString = "SELECT * FROM api WHERE prodId = ?";
  const prodId = req.params.prodId;
  connection.query(qString, [prodId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for products" + err);
      res.sendStatus(500);
      res.end();
      return;
    }

    //code modification
    const product = rows.map((row) => {
      return {
        prodId: row.prodId,
        prodName: row.prodName,
        prodDesc: row.prodDesc,
        prodPrice: row.prodPrice,
        prodRating: row.prodRating,
      };
    });
    res.render("edit", { prod: product[0] });
  });
});

//rest api to update record into mysql database

router.post("/edit_product", (req, res) => {
  const prodId = req.body.prodId;
  console.log(prodId);
  const prodName = req.body.prodName;
  const prodDesc = req.body.prodDesc;
  const prodPrice = req.body.prodPrice;
  const prodRating = req.body.prodRating;
  const prodModifiedDate = new Date();
  const connection = getConnection();
  const qString =
    "UPDATE api SET prodName = ?, prodDesc = ?, prodPrice = ?, prodRating = ?, prodModifiedDate = ? WHERE prodId = ?";
  connection.query(
    qString,
    [prodName, prodDesc, prodPrice, prodRating, prodModifiedDate, prodId],
    (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for products" + err);
        res.sendStatus(500);
        res.end();
        return;
      }

      //code modification

      res.redirect("products");
    }
  );
});

router.post("/edit_product/:prodId", (req, res) => {
  const prodId = req.params.prodId;
  console.log(prodId);
  console.log(req.body);
  console.log(req.body.prodName);
  const prodName = req.body.prodName;
  const prodDesc = req.body.prodDesc;
  const prodPrice = req.body.prodPrice;
  const prodRating = req.body.prodRating;
  const prodModifiedDate = new Date();
  const connection = getConnection();

  const qString =
    "UPDATE api SET prodName = ?, prodDesc = ?, prodPrice = ?, prodRating = ?, prodModifiedDate = ? WHERE prodId = ?";
  connection.query(
    qString,
    [prodName, prodDesc, prodPrice, prodRating, prodModifiedDate, prodId],
    (err, rows, fields) => {
      if (err) {
        console.log("Failed to query for products" + err);
        res.sendStatus(500);
        res.end();
        return;
      }

      //code modification

      res.redirect("products");
    }
  );
});

router.post("/add_product", (req, res) => {
  console.log("adding");
  // validate info
  const prodName = req.body.prodName;
  console.log(req.body);
  console.log(prodName);
  const prodDesc = req.body.prodDesc;
  const prodPrice = req.body.prodPrice;
  const prodRating = req.body.prodRating;
  const createdDate = new Date();

  const queryString =
    "INSERT INTO api (prodName, prodDesc, prodPrice, prodRating, prodCreatedDate) VALUES (?, ?, ?, ?, ?)";
  getConnection().query(
    queryString,
    [prodName, prodDesc, prodPrice, prodRating, createdDate],
    (err, results, fields) => {
      if (err) {
        console.log("failed to insert product" + err);
        res.sendStatus(500);
        return;
      }

      console.log("inserted ");
      res.end();
    }
  );

  res.end();
});

router.get("/products", (req, res) => {
  console.log("fetching product " + req.params.prodId);
  const connection = getConnection();

  const qString = "SELECT * FROM api";
  connection.query(qString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for products" + err);
      res.sendStatus(500);
      res.end();
      return;
    }
    // console.log("success?");
    console.log(rows);

    //code modification
    const products = rows.map((row) => {
      return {
        prodId: row.prodId,
        prodName: row.prodName,
        prodDesc: row.prodDesc,
        prodPrice: row.prodPrice,
        prodRating: row.prodRating,
      };
    });

    res.json(products);
  });
});
router.get("/delete", (req, res) => {
  console.log("fetching product " + req.params.prodId);
  const connection = getConnection();

  const qString = "SELECT * FROM api";
  connection.query(qString, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for products" + err);
      res.sendStatus(500);
      res.end();
      return;
    }
    // console.log("success?");
    console.log(rows);

    //code modification
    const products = rows.map((row) => {
      return {
        prodName: row.prodName,
        prodDesc: row.prodDesc,
        prodPrice: row.prodPrice,
        prodRating: row.prodRating,
      };
    });

    res.json(products);
  });
});

router.get("/add", (req, res) => {
  res.render("add");
});

router.get("/", (req, res) => {
  res.render("index", { title: "API" });
});

module.exports = router;
