const express = require("express");
const bodyParser = require("body-parser");
const route = require("../src/routes/route");
const multer = require("multer")
const app = express();


app.use(bodyParser.json());
app.use(multer().any())
app.use(bodyParser.urlencoded({ extended: true }))




app.use("/", route);


app.listen(process.env.PORT || 3000, function () {
    console.log("Express app is running on " + " " + (process.env.PORT || 3000));
});