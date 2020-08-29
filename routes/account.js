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

router.get("/logout", function (req, res) {
    req.session.user = null;
    (async () => {
        res.redirect('/login');
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

            res.render("user/detail", {
                title: AppName
                , type: 1
                , addresses: addresses
                , user: req.session.user
                , message: req.query.m
                , success: req.query.s
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
