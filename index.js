const express = require('express');
const app = express();
const mongo = require("mongodb").MongoClient;
var bodyParser = require('body-parser');
var shortId = require('shortid');
var validUrl = require('valid-url').isWebUri;
var hostName = 'http://localhost:3000/';
var path = require('path');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {// get homepage
  res.sendFile('./public/index.html');
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
          shortUrl: hostName + shortId.generate(req.params.address)
        };
        db.collection('urls').insert(newEntry, function (err, result) {
          db.close()
          res.end(JSON.stringify(newEntry));
        });
      }

    });
  });
});

app.get('/:address(*)', function (req, res) { // if shortened url


  mongo.connect(dburl, function (err, db) {
    if (err)  throw err
    db.collection('urls').findOne(
      {shortUrl: hostName + req.params.address}, function (err, data) {
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
});


app.listen(process.env.PORT || 3000);
