const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb+srv://mcb88:Zxj3QLgXOeceVr6W@cluster0.akd5m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (err, client) => {
    if (err) return console.log(err);
    console.log("Connected to Database");
    const db = client.db("star-wars-quotes");
    const quotesCollection = db.collection("quotes");
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true })); ///need more explanation of this.
    app.get("/", (req, res) => {
      // res.sendFile(__dirname + "/index.html");
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.render("index.ejs", { quotes: results });
        })
        .catch((error) => console.error(error));
      // ...
    });

    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.timeLog(error));
    });

    app.listen(3000, function () {
      console.log("Listening on 3000");
    });
  }
);

// Make sure you place body-parser before your CRUD handlers!
