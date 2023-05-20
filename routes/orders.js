//J'ai tenté, mais je me suis un peu perdu, donc pour ne pas avoir d'erreurs lors de test j ai commandé toutes les lignes de code.

// var express = require("express");
// var router = express.Router();

// require("../models/connections");
// var moment = require("moment");

// const Item = require("../models/items");
// const User = require("../models/users");
// const Order = require("../models/orders");

// router.post("/CreateOrder/:token", (req, res) => {
//   User.findOne({ token: req.body.token }).then((user) => {
//     if (user === null) {
//       res.json({ result: false, error: "User not found" });
//       return;
//     }
//     User.findOne({ token: req.body.token })
//       .populate("cart")
//       .then((cart) => {
//         if (cart.cart.length < 1) {
//           res.json({ result: false, error: "Cart empty" });
//           return;
//         }
//         Order.findOne({ _id: { $regex: new RegExp(req.body._id, "i") } }).then(
//           (data) => {
//             if (data === null) {
//               const newOrder = new Order({
//                 name: req.body.name,
//                 description: req.body.description,
//                 price: req.body.price,
//                 date_publish: moment().toDate(req.body.date_publish),
//                 quantity: req.body.quantity,
//               });

//               newOrder.save().then((newOrder) => {
//                 res.json({ result: true });
//               });
//             } else {
//               // L'utilisateur existe déja dans la BDD
//               res.json({ result: false, error: "Item already exists" });
//             }
//           }
//         );
//       });
//   });
// });
// module.exports = router;
