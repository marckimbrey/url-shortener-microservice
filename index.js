const express = require('express');
const app = express();
const mongo = require("mongodb").MongoClient;
var bodyParser = require('body-parser');
var shortId = require('shortid');
var validUrl = require('valid-url').isWebUri;

app.use(bodyParser.json());

app.get('/', function(req, res) {// get homepage
  res.send('load homepage');
})

const dburl = "mongodb://localhost:27017/urls"

app.get('/', function(req, res) { // homepage

});


app.get('/new/:address(*)' , function (req, res) { // url to shorten
  if (!validUrl(req.params.address)) {
    res.end(JSON.stringify({error: 'URL is Invalid!'}))
  }


  mongo.connect(dburl, function (err, db) {
    if (err)  throw err
    db.collection('urls').findOne(
      {fullUrl: req.params.address}, function (err, data) {
      if (err) throw err;

      if (data) { // if aready in db
              console.log('data is not null');
        db.close()

        res.end(JSON.stringify(data));
      } else { // add to db
        var newEntry = {
          fullUrl: req.params.address,
          shortUrl: shortId.generate(req.params.address)
        };
        db.collection('urls').insert(newEntry, function (err, result) {
          db.close()
          res.end(Json.stringify(newEntry));
        });
      }

    });
  });
  //res.end(shortId.generate(req.params.address))
});

app.get('/:address(*)', function (req, res) { // if shortened url
  // if (!validUrl(req.params.address)) {
  //   res.end(JSON.stringify({error: 'URL is Invalid!'}))
  // }

  mongo.connect(dburl, function (err, db) {
    if (err)  throw err
    db.collection('urls').findOne(
      {shortUrl: req.params.address}, function (err, data) {
      if (err) throw err;

      if (data) { // if aready in db
        db.close()
        console.log('fullURL', data.fullUrl)
        res.redirect(data.fullUrl);
      } else { // add to db
        res.end('That shortened URL is not in the database. To add use /new/')
      }

    });
  });
  // search db for shorturl

  // if exists redirect to full url
});


app.listen(process.env.PORT || 3000);
