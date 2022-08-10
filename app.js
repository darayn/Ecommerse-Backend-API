const express = require('express')
require('dotenv').config();
const app = express();


// importing all the routes

const home = require('./routes/home')


// router middleware
app.use("/api/v1", home);



//exporting app.js
module.exports = app;