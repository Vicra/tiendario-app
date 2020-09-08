const express = require('express');
const router = express.Router();

const productService = require('../services/productService');
const orderService = require('../services/orderService');
const categoryService = require('../services/categoryService');
const userService = require('../services/userService');

const AppName = 'La Tiendita del Río';

let products = [];
let productsPrices = [];
(async () => {
    products = await productService.getProducts();
    productsPrices = await productService.getProductsPrices();
})();

router.get('/', function (req, res) {
    (async () => {
        req.session.keyword = '';
        products = await productService.getProducts();
        res.render('index',
            {
                title: AppName,
                products: products,
                type: 1,
                success: req.query.s,
                user: req.session.user
            }
        );
    })();
});

router.post('/cart', function (req, res) {
    res.render('cart', {
        title: AppName
        ,type: 1
        ,user: req.session.user
        ,deliveryType: req.body.deliveryRadio
        ,params: JSON.stringify(req.body)
    });
});

router.get('/address', function (req, res) {
    if (req.session.user) {
        (async () => {
            let addressesResponse = await userService.getAddresses(req.session.user.id);
            let addresses = [];
            if (addressesResponse.success){
                addresses = addressesResponse.data
            }
            res.render('verify', {
                title: AppName
                , type: 1
                , user: req.session.user
                , addresses: addresses
                , message: req.query.m
            });
        })();
    }
    else {
        res.render('address', {
            title: AppName
            , type: 1
        });
    }
});

router.post('/placeorder', function (req, res) {
    let params = JSON.parse(req.body.params);
    let cart = JSON.parse(req.body.cart2);
    
    (async () => {
        if (req.session.user){
            params.customerId = req.session.user.id;
            let response = await orderService.postOrder(params, cart.products);
            if (response.success){
                res.redirect('/?s=1');
            }
            else {
                res.redirect(`/address?m=${response.message}`);
            }
        }
        else {
            let response = await orderService.postGuestOrder(params, cart.products);
            if (response.success){
                res.redirect('/?s=1');
            }
            else {
                res.redirect(`/address?m=${response.message}`);
            }
        }
    })();
});


router.get('/catalog', function (req, res) {

    (async () => {
        let categories = await categoryService.getAvailableCategories();

        res.render('catalog', {
            title: AppName
            , categories: categories
            , type: 1
            , user: req.session.user
        });
    })();
});

router.get('/products-category/:id', function (req, res) {

    (async () => {
        let categoryId = req.params.id;
        let products = await productService.getProductsByCategory(categoryId);
        res.render('products', {
            title: AppName
            , products: products
            , type: 1
            , user: req.session.user
            , name: (products.length) ? products[0].category : ''
        });
    })();
});

router.get('/contact', function (req, res) {
    (async () => {
        res.render('contact', {
            title: AppName
            ,type: 1
            ,user: req.session.user
        });
    })();
});

router.get('/search', function (req, res) {
    let params = req.query;
    req.session.keyword = params.keyword;
    (async () => {
        let response = await productService.searchProducts(params.keyword);
        if (response.code != 200) {
            res.redirect('/');
        }
        else {
            products = response.data;
            res.render('index',
                {
                    title: AppName,
                    products: response.data,
                    type: 1,
                    success: req.query.s,
                    user: req.session.user,
                    keyword: params.keyword
                });
        }
    })();
});

module.exports = router;