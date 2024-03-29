const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//swaggers docs related
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
// const swaggerDocument = YAML.load("./swagger.yaml");

console.log("__dirname:", __dirname);

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies and file middleware

app.use(cookieparser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// temp Check
app.set("view engine", "ejs");

// morgan middleware
app.use(morgan("tiny"));

// importing all the routes
const home = require("./routes/home");
const user = require("./routes/user");
const product = require("./routes/product");
const payment = require("./routes/payment");
const order = require("./routes/order");

// router middleware
app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1", order);

app.get("/signuptest", (req, res) => {
  res.render("signupTest");
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome Ecommerse API",
  });
});

//exporting app.js
module.exports = app;
