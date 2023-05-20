var express = require("express");
var router = express.Router();

require("../models/connections");
var moment = require("moment");

const { checkBody } = require("../modules/checkBody");

const Item = require("../models/items");

router.post("/addItem", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (!checkBody(req.body, ["name", "price", "description"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérifie s
  Item.findOne({ name: { $regex: new RegExp(req.body.name, "i") } }).then(
    (data) => {
      if (data === null) {
        const newItem = new Item({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          date_publish: moment().toDate(req.body.date_publish),
          quantity: req.body.quantity,
        });

        newItem.save().then((newItem) => {
          res.json({ result: true, name: newItem.name });
        });
      } else {
        // L'utilisateur existe déja dans la BDD
        res.json({ result: false, error: "Item already exists" });
      }
    }
  );
});

module.exports = router;
