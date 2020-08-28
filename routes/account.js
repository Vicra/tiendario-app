const express = require("express");
const router = express.Router();
const userService = require('../services/userService');

const AppName = "La Tiendita del Rio";

router.get("/login", function (req, res) {
    (async () => {
        res.render("user/login", {
            title: AppName
            , type: 1
            , success: req.query.s
        });
    })();
});

router.post("/login", function (req, res) {
    let params = req.body;
    (async () => {
        let response = await userService.isValidUser(params);
        if (response.success) {
            req.session.user = response.data;
            res.redirect("/");
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

router.get("/register", function (_, res) {
    (async () => {
        res.render("user/register", {
            title: AppName
            , type: 1
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
                , customerId: address.customerId
            };
            let response = await userService.postAddress(req.body);
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

            res.render("user/detail", {
                title: AppName
                , type: 1
                , addresses: addresses
                , user: req.session.user
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
                res.redirect('/view-account')
            }
        }
        else {
            res.redirect("/");
        }
    })();
});

module.exports = router;
