const express = require("express");
const router = express.Router();
const adminService = require('../services/adminService');
const orderService = require('../services/orderService');

const AppName = "La Tiendita del Río";

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

router.get("/approve-order/:id", function (req, res) {
    let orderId = req.params.id;
    (async () => {
        let response = await orderService.approveOrder(orderId);
        if(response.success){
            res.redirect(`/view-order/${orderId}?s=1`);
        }
        else {
            res.redirect(`/view-order/${orderId}?m=${response.message}`);
        }
    })();
});

router.get("/deliver-order/:id", function (req, res) {
    let orderId = req.params.id;
    (async () => {
        let response = await orderService.deliverOrder(orderId);
        if(response.success){
            res.redirect(`/view-order/${orderId}?s=1`);
        }
        else {
            res.redirect(`/view-order/${orderId}?m=${response.message}`);
        }
    })();
});

module.exports = router;
