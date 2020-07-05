const express = require("express");
const router = express.Router();
const adminService = require('../services/adminService');

const AppName = "La Tiendita del Rio";

router.get("/authenticate", function (_, res) {
    (async () => {
        res.render("admin/login", {
            title: AppName
        });
    })();
});

router.post("/authenticate", function (req, res) {
    let params = req.body;
    (async () => {
        let response = await adminService.isValidUser(params);
        if(response.success){
            req.session.admin = response.data;
            res.redirect('/admin');
        }
        else {
            res.render("admin/login", {
                title: AppName
                ,message: response.message
            });
        }
    })();
});

router.get("/admin", function (req, res) {
    (async () => {
        if(req.session.admin){
            res.render("admin", {
                title: AppName
            });
        }
        else{
            res.redirect('/authenticate');
        }
    })();
});

module.exports = router;
