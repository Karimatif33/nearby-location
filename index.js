
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const AllRoutes = require("./routes/AllRoutes")

const app = express();

app.use(bodyParser.json()); 
app.use(express.json());
app.use(morgan("dev"));


app.use(AllRoutes)


module.exports = app
