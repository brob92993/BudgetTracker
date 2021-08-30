var mongoose = require("mongoose");
var db = require("../models");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/budget",
  { useNewUrlParser: true }
);

var transactionSeed = [
    {
      name: "Groceries",
      value: 200,
      date: new Date(Date.now())
    },
    {
        name: "Television",
        value: 900,
        date: new Date(Date.now())
    },
    {
        name: "Gym Clothes",
        value: 100,
        date: new Date(Date.now())
    }
];

db.Transaction.deleteMany({})
  .then(() => db.Transaction.collection.insertMany(transactionSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
