var express = require("express");
var router = express.Router();

require("../models/connections");

const User = require("../models/users");

const Item = require("../models/items");

const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

router.post("/signup", (req, res) => {
  // Vérifie que les champs soient correctement remplies
  if (!checkBody(req.body, ["pseudo", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Vérifie si l utilisateur est deja inscrit, s'il ne l'est pas, crée un nouvel utilisateur
  User.findOne({ pseudo: { $regex: new RegExp(req.body.pseudo, "i") } }).then(
    (data) => {
      if (data === null) {
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          token: uid2(32),
          pseudo: req.body.pseudo,
          email: req.body.email,
          password: hash,
          adresses: [req.body.adresses],
          cart: [],
        });

        newUser.save().then((newUser) => {
          res.json({ result: true, token: newUser.token });
        });
      } else {
        // L'utilisateur existe déja dans la BDD
        res.json({ result: false, error: "User already exists" });
      }
    }
  );
});

// Vérifie que les champs soient correctement remplies
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  // Vérifie si l'email et le mot de passe correspondent a des données dans la BDD
  User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } }).then(
    (data) => {
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: true, token: data.token, pseudo: data.pseudo });
      } else {
        // Soit l utilisateur n'existe pas, soit le mot de passe/email est faux, renvoie un message d erreur
        res.json({ result: false, error: "User not found or wrong password" });
      }
    }
  );
});

//Cette route permet d ajouter une adresse au tableau d'adresse via le token de l'utilisateur

router.put("/addAdresse", (req, res) => {
  User.updateOne(
    { token: req.body.token },
    { $push: { adresses: req.body.adresses } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

//Cette route permet de mettre à jour toutes les adresses en les remplaçant par une nouvelle

router.put("/updateAdresse", (req, res) => {
  User.updateOne(
    { token: req.body.token },
    { $set: { adresses: req.body.adresses } }
  ).then((data) => {
    res.json({ result: true, data: data });
  });
});

// Ajout d'un article dans le panier, à réutiliser pour ajouter plusieurs fois le même article dans le panier !

router.put("/addToCart", (req, res) => {
  if (!checkBody(req.body, ["token", "itemId"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }

    Item.findById(req.body.itemId).then((item) => {
      console.log(item);
      if (item === null) {
        res.json({ result: false, error: "Item not found" });
        return;
      }

      User.updateOne({ _id: user._id }, { $push: { cart: item._id } }).then(
        () => {
          res.json({ result: true });
        }
      );
    });
  });
});

// Retirement d'un article du panier

router.put("/deleteFromCart", (req, res) => {
  if (!checkBody(req.body, ["token", "itemId"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ token: req.body.token }).then((user) => {
    if (user === null) {
      res.json({ result: false, error: "User not found" });
      return;
    }
    User.findOne({ token: req.body.token }).then((user) => {
      if (user === null) {
        res.json({ result: false, error: "User not found" });
        return;
      }
      Item.findById(req.body.itemId).then((item) => {
        console.log(item);
        if (item === null) {
          res.json({ result: false, error: "Item not found" });
          return;
        }
        if (user.cart.length < 1) {
          res.json({ result: false, error: "Cart is empty" });
          return;
        } else {
          User.updateOne({ _id: user._id }, { $pull: { cart: item._id } }).then(
            () => {
              res.json({ result: true });
            }
          );
        }
      });
    });
  });
});

router.get("/showCart/:token", (req, res) => {
  User.findOne({ token: { $regex: new RegExp(req.params.token, "i") } })
    .populate("cart")
    .then((cart) => {
      if (cart.cart.length > 0) {
        res.json({ result: true, cart: cart.cart });
      } else {
        res.json({ result: false, error: "No items found in cart" });
      }
    });
});

module.exports = router;
