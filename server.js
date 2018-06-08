var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


var PORT = process.env.PORT || 3002;

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

//Enviromentally aware DB.
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//Connecting init and handler
mongoose.Promise = Promise;
mongoose.connect(db, function(error){
	//Error
	if(error){
		console.log(error);
	}
	else{
		console.log("mongoose is connected to mongo");
	}
})



// Import routes and give the server access to them.
require("./controllers/router")(app);
require("./controllers/articlesControllers.js")(app);
require("./controllers/noteControllers")(app);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
  