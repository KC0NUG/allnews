var express = require("express");
var expressHandlebars = require('express-handlebars');
// var express_handlebars_sections = require('express-handlebars-sections');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios"); var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure view engine to use handlebars
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/allnews", {
  useMongoClient: true
});

// Routes
var articles = require('./routes/AmericanArticleRoutes');
app.use('/american/articles', articles);
var AmericanArticleModel = require('./models/AmericanArticleModel');

function saveArticle(author, summary, excerpt, url, urlmore) {
  return new Promise(function(resolve, reject) {
      var AmericanArticle = new AmericanArticleModel({
        author : author,
        summary : summary,
        excerpt : excerpt,
        url : url,
        urlmore : urlmore
      });

      AmericanArticle.save(function (err, AmericanArticle) {
          if (err) {
              reject({
                  message: 'Error when creating AmericanArticle',
                  error: err
              });
          }

          console.log(AmericanArticle);
          resolve(AmericanArticle);
      });
  });
}

//
// Default route to our web application
//
app.get('/', function (req, res) {

    // Grab every document in the Articles collection
    AmericanArticleModel
      .find({})
      .then(function(dbArticle) {
        console.log(dbArticle);
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);
        // if a callback is specified, the rendered HTML string has to be sent explicitly
        res.render('home', dbArticle, function(err, html) {
          res.send(html);
        });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
    // res.render('home');
    // res.render('home', {layout: false});
});

// A GET route for scraping the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.americanthinker.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    var promises = [];

    // Now, we grab every h2 within an article tag, and do the following:
    $("div[class=home_entry]").each(function(i, element) {
      // Save an empty result object

      // Add the text and href of every link, and save them as properties of the result object
      var author = $(this)  
        .children("span[class=home_author]")
        .text();
      var summary = $(this)
        .children("a")
        .text();
      var excerpt = $(this) 
        .children("span[class=home_excerpt]")
        .text();
      var url = $(this)
        .children("a")
        .attr("href");
      var urlmore = $(this) 
        .children("span[class=home_excerpt]")
        .children("a[class=more]")
        .attr("href");

      var promise = saveArticle(author, summary, excerpt, url, urlmore)

      promises.push(promise);
    });

    Promise.all(promises).then(articles => { 
      res.json(articles);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  AmericanArticleModel
    .find({})
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
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  AmericanArticleModel
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  console.log(req.body);
  // Create a new note and pass the req.body to the entry
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return AmericanArticleModel.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(americanArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(americanArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for deleting an Article's associated Note
app.delete("/articles/:id", function(req, res) {
  console.log(req.body);
  // Create a new note and pass the req.body to the entry
  db.Note
    .remove(req.body)
    .then(function(dbNote) {
      // If a Note was delete successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      //return AmericanArticleModel.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(americanArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(americanArticle);
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
