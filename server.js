var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var PORT = 3002;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require all models
var db = require("./models");

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/mongoHeadlines");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



// Import routes and give the server access to them.
require("./controllers/router")(app);
require("./controllers/articlesControllers.js")(app);
require("./controllers/noteControllers")(app);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
  