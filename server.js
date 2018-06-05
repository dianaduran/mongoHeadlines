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
mongoose.connect("mongodb://localhost/mongoHeadlines");

app.get('/', function(req, res) {
  res.render('index');
});

// Import routes and give the server access to them.
require("./controllers/articlesControllers.js")(app);


 








// Route for remove a specific Article by id, populate it with it's note
app.delete("/articles/:id", function(req, res) {
  
  db.Article.findByIdAndRemove({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
     res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
  