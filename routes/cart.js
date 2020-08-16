const express = require("express");
const router = express.Router();

router.get('/remove/:id', function (req, res) {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

module.exports = router;
