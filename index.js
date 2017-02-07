const express = require('express');
const app = express();
const mongo = require("mongodb").MongoClient;

const dburl = "mongodb://localhost:27017/testdb"
app.get('/' , function (req, res) {
  res.end("page is working")
  mongo.connect(dburl, function (err, db) {
    if (err)  return console.error(err)

    console.log("mongo is running at " + dburl);
    db.close()
  });
});

app.listen(process.env.PORT || 3000);
