const express = require("express");
const router = express.Router();
const userService = require('../services/userService');

const AppName = "La Tiendita del Rio";

router.get("/login", function (_, res) {
    (async () => {
        res.render("user/login", {
            title: AppName
            ,type: 1
        });
    })();
});

router.post("/login", function (req, res) {
    let params = req.body;
    (async () => {
        let response = await userService.isValidUser(params);
        if(response.success){
            req.session.user = response.data;
            res.redirect("/");
        }
        else {
            res.render("user/login", {
                title: AppName
                ,type: 1
                ,message: response.message
            });
        }
    })();
});

router.get("/register", function (_, res) {
    (async () => {
        res.render("user/register", {
            title: AppName
            ,type: 1
        });
    })();
});

router.post("/register", function (req, res) {
    console.log(req.body);
    (async () => {
        let response = await userService.postUser(req.body);
        res.render("user/register", {
            title: AppName
            ,type: 1
        });
    })();
});

router.get("/view-account", function (req, res) {
    (async () => {
        if(req.session.user){
            let response = await userService.getAddresses(req.session.user.id);
            let addresses = [];
            if(response.success){
                addresses = response.data;
            }
            
            res.render("user/detail", {
                title: AppName
                ,type: 1
                ,addresses: addresses
                ,user: req.session.user
            });
        }
        else{
            res.redirect("/");
        }
    })();
});

router.post("/add-address", function (req, res) {
    let params = req.body;
    (async () => {
        if(req.session.user){
            params.customerId = req.session.user.id;
            let response = await userService.postAddress(params);
            if(response.success){
                res.redirect('/view-account')
            }
        }
        else{
            res.redirect("/");
        }
    })();
});

module.exports = router;