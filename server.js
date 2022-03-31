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
    // =========================
    // MIDDLEWARES
    // =========================
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true })); ///need more explanation of this.
    app.use(bodyParser.json());
    app.use(express.static("public"));

    // =========================
    // ROUTES
    // =========================
    app.get("/", (req, res) => {
      // res.sendFile(__dirname + "/index.html");
      db.collection("quotes")
        .find()
        .toArray()
        .then((quotes) => {
          console.log(quotes);
          res.render("index.ejs", { quotes: quotes });
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

    app.put("/quotes", (req, res) => {
      console.log(req.body);
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("success");
        })
        .catch((error) => console.error(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vader's quote`);
        })
        .catch((error) => console.log(error));
    });

    app.listen(3000, function () {
      console.log("Listening on 3000");
    });
  }
);

// Make sure you place body-parser before your CRUD handlers!
