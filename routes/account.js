const express = require("express");
const router = express.Router();
const userService = require('../services/userService');
const AppName = "La Tiendita del Río";
const reCaptchaKey = require('../reCaptcha.json');
const orderService = require("../services/orderService");

router.get("/login", function (req, res) {
    (async () => {
        let host = req.get('host');
        let siteKey = reCaptchaKey.prod;
        if (host.includes('localhost')){
            siteKey = reCaptchaKey.dev;
        }

        res.render("user/login", {
            title: AppName
            , type: 1
            , success: req.query.s
            , verified: req.query.v
            , siteKey: siteKey
        });
    })();
});

router.get("/verify/:key", function (req, res) {
    let key = req.params.key;
    (async () => {
        let response = await userService.verifyUser(key);
        if (response.success) {
            res.redirect("/login?v=1");
        }
        else {
            res.redirect("/shop");
        }
    })();
});

router.post("/login", function (req, res) {
    let params = req.body;
    (async () => {
        let response = await userService.isValidUser(params);
        if (response.success) {
            req.session.user = response.data;
            res.redirect("/shop?l=1");
        }
        else {
            res.render("user/login", {
                title: AppName
                , type: 1
                , message: response.message
            });
        }
    })();
});

router.get("/logout", function (req, res) {
    req.session.user = null;
    (async () => {
        res.redirect('/login');
    })();
});

router.get("/my-orders", function (req, res) {
    (async () => {
        if(req.session.user){
            let orders = await userService.getOrders(req.session.user.id);

            for (let i = 0; i < orders.length; i++) {
                if (orders[i].type == 'd') {
                    orders[i].type = 'a domicilio';
                }
                else {
                    orders[i].type = 'autoservicio';
                }

                if (orders[i].payment_method == 'e') {
                    orders[i].payment_method = 'efectivo';
                }
                else {
                    orders[i].payment_method = 'transferencia';
                }
            }
            res.render("user/my-orders", {
                title: AppName
                , type: 1
                , orders: orders
                , user: req.session.user
            });
        }
        else{
            res.redirect('/login');
        }
    })();
});

router.get("/order-detail/:orderid", function (req, res) {
    let orderid = req.params.orderid;
    (async () => {
        if(req.session.user){
            let order = await orderService.getOrderById(orderid);
            res.render("user/order-detail", {
                title: AppName
                , type: 1
                , order: order
                , products : order.items
                , user: req.session.user
            });
        }
        else{
            res.redirect('/login');
        }
    })();
});

router.get("/forgot-password", function (req, res) {
    (async () => {
        let host = req.get('host');
        let siteKey = reCaptchaKey.prod;
        if (host.includes('localhost')){
            siteKey = reCaptchaKey.dev;
        }

        res.render("user/forgot-password", {
            title: AppName
            , type: 1
            , siteKey: siteKey
        });
    })();
});

router.post("/forgot-password", function (req, res) {
    (async () => {
        let response = await userService.forgotPassword(req.body);
        if (response.success){
            res.redirect("/login?s=1");
        }
        else {
            res.render("user/forgot-password", {
                title: AppName
                , type: 1
                , message: response.message
            });
        }
    })();
});

router.get("/register", function (req, res) {
    (async () => {
        let host = req.get('host');
        let siteKey = reCaptchaKey.prod;
        if (host.includes('localhost')){
            siteKey = reCaptchaKey.dev;
        }

        res.render("user/register", {
            title: AppName
            , type: 1
            , siteKey: siteKey
        });
    })();
});

router.post("/register", function (req, res) {
    (async () => {
        let response = await userService.postUser(req.body);
        if (response.success){
            let addressBody = {
                description: req.body.address
                , reference: req.body.reference
                , typeId: req.body.type
                , customerId: response.data.insertId
            };
            response = await userService.postAddress(addressBody);
            res.redirect("/login?s=1");
        }
        else {
            res.render("user/register", {
                title: AppName
                , type: 1
                , message: response.message
            });
        }
    })();
});

router.get("/view-account", function (req, res) {
    (async () => {
        if (req.session.user) {
            let response = await userService.getAddresses(req.session.user.id);
            let addresses = [];
            if (response.success) {
                addresses = response.data;
            }

            for (let i = 0; i < addresses.length; i++) {
                if (addresses[i].type == "1") {
                    addresses[i].typeName = "Casa"; 
                }
                else if (addresses[i].type == "2") {
                    addresses[i].typeName = "Trabajo";
                }
                else if (addresses[i].type == "3") {
                    addresses[i].typeName = "Otro";
                }
            }

            let host = req.get('host');
            let siteKey = reCaptchaKey.prod;
            if (host.includes('localhost')){
                siteKey = reCaptchaKey.dev;
            }

            res.render("user/detail", {
                title: AppName
                , type: 1
                , addresses: addresses
                , user: req.session.user
                , message: req.query.m
                , success: req.query.s
                , siteKey: siteKey
            });
        }
        else {
            res.redirect("/");
        }
    })();
});

router.post("/add-address", function (req, res) {
    let params = req.body;
    (async () => {
        if (req.session.user) {
            params.customerId = req.session.user.id;
            let response = await userService.postAddress(params);
            if (response.success) {
                res.redirect('/view-account/?s=1')
            }
            else{
                res.redirect(`/view-account?m=${response.message}`)
            }
        }
        else {
            res.redirect("/");
        }
    })();
});

module.exports = router;
