const express = require("express");
const router = express.Router();

const productService = require("../services/productService");
const orderService = require("../services/orderService");
const categoryService = require("../services/categoryService");
const userService = require("../services/userService");
const appService = require("../services/appService");

const reCaptchaKey = require("../reCaptcha.json");

let products = [];
let app = {};
(async () => {
    products = await productService.getProducts();
    app = await appService.getApp();
})();

router.get("/shop", function (req, res) {
    (async () => {
        req.session.keyword = "";
        products = await productService.getProducts();

        res.render("index", {
            title: app.name,
            products: products,
            type: 1,
            success: req.query.s,
            user: req.session.user,
            login: req.query.l,
            cart: 1,
            app
        });
    })();
});

router.get("/cart", function (req, res) {
    res.render("cart", {
        title: app.name,
        type: 1,
        user: req.session.user,
        app
        // ,deliveryType: req.body.deliveryRadio
        // ,params: JSON.stringify(req.body)
    });
});

router.get("/address", function (req, res) {
    if (req.session.user) {
        (async () => {
            let addressesResponse = await userService.getAddresses(
                req.session.user.id
            );
            let addresses = [];
            if (addressesResponse.success) {
                addresses = addressesResponse.data;
            }
            res.render("verify", {
                title: app.name,
                type: 1,
                user: req.session.user,
                addresses: addresses,
                message: req.query.m,
                app
            });
        })();
    } else {
        let host = req.get("host");
        let siteKey = reCaptchaKey.prod;
        if (host.includes("localhost")) {
            siteKey = reCaptchaKey.dev;
        }

        res.render("address", {
            title: app.name,
            type: 1,
            siteKey: siteKey,
            app
        });
    }
});

router.post("/placeorder", function (req, res) {
    let params = req.body;
    let cart = JSON.parse(req.body.cart2);

    (async () => {
        if (req.session.user) {
            params.customerId = req.session.user.id;
            let response = await orderService.postOrder(params, cart.products);
            if (response.success) {
                res.redirect("/shop?s=1");
            } else {
                res.redirect(`/address?m=${response.message}`);
            }
        } else {
            let response = await orderService.postGuestOrder(
                params,
                cart.products
            );
            if (response.success) {
                res.redirect("/shop?s=1");
            } else {
                res.redirect(`/address?m=${response.message}`);
            }
        }
    })();
});

router.get("/catalog", function (req, res) {
    (async () => {
        let categories = await categoryService.getAvailableCategories();

        res.render("catalog", {
            title: app.name,
            categories: categories,
            type: 1,
            user: req.session.user,
            cart: 1,
            app
        });
    })();
});

router.get("/products-category/:id", function (req, res) {
    (async () => {
        let categoryId = req.params.id;
        let products = await productService.getProductsByCategory(categoryId);

        res.render("products", {
            title: app.name,
            products: products,
            type: 1,
            user: req.session.user,
            name: products.length ? products[0].category : "",
            cart: 1,
            app
        });
    })();
});

router.get("/contact", function (req, res) {
    (async () => {
        res.render("contact", {
            title: app.name,
            type: 1,
            user: req.session.user,
            app
        });
    })();
});

router.get("/about", function (req, res) {
    (async () => {
        res.render("about", {
            title: app.name,
            type: 1,
            user: req.session.user,
            app
        });
    })();
});

router.get("/search", function (req, res) {
    let params = req.query;
    req.session.keyword = params.keyword;
    (async () => {
        let response = await productService.searchProducts(params.keyword);
        if (response.code != 200) {
            res.redirect("/shop");
        } else {
            products = response.data;
            res.render("index", {
                title: app.name,
                products: response.data,
                type: 1,
                success: req.query.s,
                user: req.session.user,
                keyword: params.keyword,
                app
            });
        }
    })();
});

router.get("/", function (req, res) {
    (async () => {
        let categories = await categoryService.getAvailableCategories();
        for (let i = categories.length - 1; i >= 0; i--) {
            if (
                categories[i].id != 1 &&
                categories[i].id != 17 &&
                categories[i].id != 2 &&
                categories[i].id != 3 &&
                categories[i].id != 22 &&
                categories[i].id != 4
            ) {
                categories.splice(i, 1);
            }
        }
        res.render("main", {
            title: app.name,
            type: 1,
            user: req.session.user,
            categories: categories,
            app
        });
    })();
});

module.exports = router;
