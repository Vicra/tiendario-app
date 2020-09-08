const express = require("express");
const router = express.Router();

const productService = require('../services/productService');
const adminService = require('../services/adminService');
const orderService = require('../services/orderService');
const supplierService = require('../services/supplierService');
const brandService = require('../services/brandService');
const categoryService = require('../services/categoryService');

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

router.get('/products', function (req, res) {
    if(req.session.admin){
        (async () => {
            let products = await productService.getLatestProducts();
            res.render('product/products', {
                title: AppName
                , products: products
                , success: req.query.s
                , updated: req.query.u
            });
        })();
    }
    else{
        res.redirect('/authenticate');
    }
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

router.get('/create-product', function (req, res) {
    let suppliers = [];
    let categories = [];
    let brands = [];
    (async () => {
        categories = await categoryService.getCategories();
        suppliers = await supplierService.getSuppliers();
        brands = await brandService.getBrands();

        res.render('product/create', {
            title: AppName
            , suppliers: suppliers
            , categories: categories
            , brands: brands
            , message: req.query.m
        });
    })();
});

router.post('/submit-product', function (req, res) {

    let params = req.body;

    (async () => {
        let response = await productService.postProduct(params);
        if (response.code != 200) {
            res.redirect(`/create-product?m=${response.message}`);
        }
        else {
            res.redirect('/products?s=1');
        }
    })();
});

router.get('/edit-product/:id', function (req, res) {
    let productId = req.params.id;

    (async () => {
        let product = await productService.getProductById(productId);
        let categories = await categoryService.getCategories();
        let suppliers = await supplierService.getSuppliers();
        let brands = await brandService.getBrands();

        res.render('product/edit', {
            title: AppName
            , suppliers: suppliers
            , categories: categories
            , brands: brands
            , product: product
            , message: req.query.m
        });
    })();
});

router.post('/update-product', function (req, res) {

    let params = req.body;
    (params.available == "on") ? params.available = 1 : params.available = "";
    (params.showSite == "on") ? params.showSite = 1 : params.showSite = "";
    (async () => {
        let response = await productService.putProduct(params);
        if (response.code != 200) {
            res.redirect(`/edit-product/${params.id}?m=${response.message}`);
        }
        else {
            res.redirect('/products?u=1');
        }
    })();
});


router.get('/suppliers', function (req, res) {
    if(req.session.admin){
        (async () => {
            let suppliers = await supplierService.getLatestSuppliers();
            res.render('supplier/suppliers', {
                title: AppName
                , suppliers: suppliers
                , success: req.query.s
                , updated: req.query.u
            });
        })();
    }
    else{
        res.redirect('/authenticate');
    }
});

router.get('/create-supplier', function (_, res) {

    (async () => {
        res.render('supplier/create', {
            title: AppName
        });
    })();
});

router.post('/submit-supplier', function (req, res) {

    let params = req.body;

    (async () => {
        let response = await supplierService.postSupplier(params);
        if (response.code != 200) {
            res.redirect(`/create-supplier?m=${response.data.message}`);
        }
        else {
            res.redirect('/suppliers?s=1');
        }
    })();
});

router.get('/edit-supplier/:id', function (req, res) {
    let supplierId = req.params.id;
    (async () => {
        let supplier = await supplierService.getSupplierById(supplierId);
        res.render('supplier/edit', {
            title: AppName
            , supplier: supplier
            , message: req.query.m
        });
    })();
});

router.post('/update-supplier', function (req, res) {

    let params = req.body;

    (async () => {
        let response = await supplierService.putSupplier(params);
        if (response.code != 200) {
            res.redirect(`/edit-supplier/${params.id}?m=${response.data.message}`);
        }
        else {
            res.redirect('/suppliers?u=1');
        }
    })();
});

router.get('/orders', function (req, res) {
    if(req.session.admin){
        (async () => {
            let orders = await orderService.getNewOrders();
            res.render('order/orders', {
                title: AppName
                , orders: orders
            });
        })();
    }
    else{
        res.redirect('/authenticate');
    }
});

router.get('/view-order/:id', function (req, res) {
    let orderId = req.params.id;
    (async () => {
        let order = await orderService.getOrderById(orderId);
        if (order.approved == '1' && order.delivered == '1'){
            res.render('order/detail', {
                title: AppName
                , order: order
                , success: req.query.s
                , message: req.query.m
            });
        }
        else{
            res.render('order/edit', {
                title: AppName
                , order: order
                , success: req.query.s
                , message: req.query.m
            });
        }
    })();
});

router.get('/categories', function (req, res) {
    if(req.session.admin){
        (async () => {
            let categories = await categoryService.getCategories();
            res.render('category/categories', {
                title: AppName,
                categories: categories,
                success: req.query.s,
                updated: req.query.u
            });
        })();
    }
    else{
        res.redirect('/authenticate');
    }
});

router.get('/create-category', function (req, res) {

    (async () => {
        res.render('category/create', {
            title: AppName,
            message: req.query.m
        });
    })();
});

router.post('/submit-category', function (req, res) {

    let params = req.body;

    (async () => {
        let response = await categoryService.postCategory(params);
        if (response.code != 200) {
            res.redirect(`/create-category?m=${response.data.message}`);
        }
        else {
            res.redirect('/categories?s=1');
        }
    })();
});

router.get('/edit-category/:id', function (req, res) {
    let categoryId = req.params.id;
    (async () => {
        let category = await categoryService.getCategoryById(categoryId);
        res.render('category/edit', {
            title: AppName,
            category: category,
            message: req.query.m
        });
    })();
});

router.post('/update-category', function (req, res) {

    let params = req.body;

    (async () => {
        let response = await categoryService.putCategory(params);
        if (response.code != 200) {
            res.redirect(`/edit-category/${params.id}?m=${response.data.message}`);
        }
        else {
            res.redirect('/categories?u=1');
        }
    })();
});

router.get('/brands', function (req, res) {
    if(req.session.admin){
        (async () => {
            let brands = await brandService.getBrands();
            res.render('brand/brands', {
                title: AppName,
                brands: brands,
                success: req.query.s,
                updated: req.query.u
            });
        })();
    }
    else{
        res.redirect('/authenticate');
    }
});

router.get('/create-brand', function (req, res) {
    (async () => {
        res.render('brand/create', {
            title: AppName,
            message: req.query.m
        });
    })();
});

router.post('/submit-brand', function (req, res) {

    let params = req.body;

    (async () => {
        let response = await brandService.postBrand(params);
        if (response.code != 200) {
            res.redirect(`/create-brand?m=${response.data.message}`);
        }
        else {
            res.redirect('/brands?s=1');
        }
    })();
});

router.get('/edit-brand/:id', function (req, res) {
    let brandId = req.params.id;
    (async () => {
        let brand = await brandService.getBrandById(brandId);
        res.render('brand/edit', {
            title: AppName,
            brand: brand,
            message: req.query.m
        });
    })();
});

router.post('/update-brand', function (req, res) {

    let params = req.body;

    (async () => {
        let response = await brandService.putBrand(params);
        if (response.code != 200) {
            res.redirect(`/edit-brand/${params.id}?m=${response.data.message}`);
        }
        else {
            res.redirect('/brands?u=1');
        }
    })();
});

module.exports = router;
