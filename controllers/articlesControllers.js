// Requiring our models
var db = require("../models");
var request = require("request");
var cheerio = require("cheerio");

// Routes Articles
// =============================================================
module.exports = function(app) {

    // Scrape data from one site and place it into the mongodb db
    app.get("/scrape", function(req, res) {
    var articles=[];
      // Make a request for the news section 
      request("http://www.echojs.com/", function(error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);
   
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {
            // Save an empty result object
          var result = {};
    
          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this)
            .children("a")
            .text();
          result.link = $(this)
            .children("a")
            .attr("href");
           
            articles.push(result);
       }); 
         res.json(articles);
      });
    });

    // Post a article to the mongoose database
    app.post("/submit", function(req, res) {
    // Save the request body as an object called book
    var article = req.body;
           // Save the Article object as an entry into the article collection in mongo
            db.Article.create(article).then(function(dbArticle) {
                 res.json(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, send it to the client
                return res.json(err);
              });
         });


    //find one article
    app.get("/articles/:name", function(req, res) {
        var name=req.params.name;
        db.Article.findOne({title: name })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function(req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });


    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articlesNote/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        // 
        db.Article.find({_id: req.params.id})
        // ..and populate all of the notes associated with it
        .populate('notes')
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

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

}