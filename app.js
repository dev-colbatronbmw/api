const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
const mysql = require("mysql");
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cool = require("cool-ascii-faces");

const router = require("./routes/products.js");
app.use(router);

app.use(morgan("tiny"));

express()
  .use(express.static(path.join(__dirname, "public")))
  .get("/cool", (req, res) => res.send(cool()));

app.use(
  "/css",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/jquery/dist"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "/node_modules/popper.js/dist"))
);
app.set("views", "./src/views");
// app.set("view engine", "pug");
app.set("view engine", "ejs");

app.listen(PORT, () => {
  debug(`listening at port ${chalk.green(PORT)}`);
});
