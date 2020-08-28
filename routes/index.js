const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const productService = require('../services/productService');
const orderService = require('../services/orderService');
const supplierService = require('../services/supplierService');
const categoryService = require('../services/categoryService');
const brandService = require('../services/brandService');
const userService = require('../services/userService');

let Cart = require('../models/cart');
const e = require('express');

const AppName = 'La Tiendita del Rio';

let products = [];
(async () => {
    products = await productService.getProducts();
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

router.post('/add/:id/:categoryId', function (req, res) {
    let productId = req.params.id;
    let count = req.body.count;
    let categoryId = req.params.categoryId;

    let cart = new Cart(req.session.cart ? req.session.cart : {});
    let product = products.filter(function (item) {
        return item.id == productId;
    });
    for (let i = 0; i < count; i++) {
        cart.add(product[0], productId);
    }
    req.session.cart = cart;

    if (categoryId && categoryId > 0){
        res.redirect(`/products-category/${categoryId}`);
    }
    else if(req.session.keyword){
        res.redirect(`/search?keyword=${req.session.keyword}`);
    }
    else{
        res.redirect('/');
    }
});

router.get('/cart', function (req, res) {
    if (!req.session.cart) {
        return res.render('cart', {
            products: null
            , type: 1
            , user: req.session.user
        });
    }
    let cart = new Cart(req.session.cart);
    const delivery = 80;
    const subtotal = cart.totalPrice;
    res.render('cart', {
        title: AppName
        ,products: cart.getItems()
        ,subtotal: subtotal
        ,delivery: delivery
        ,total: delivery + subtotal
        ,type: 1
        ,user: req.session.user
    });
});

router.get('/remove/:id', function (req, res) {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get('/address', function (req, res) {
    if (!req.session.cart) {
        return res.render('address', {
            products: null
            , type: 1
            , user: req.session.user
            , message: req.query.m
        });
    }
    else {
        let cart = new Cart(req.session.cart);
        
        if (req.session.user) {
            (async () => {
                let addressesResponse = await userService.getAddresses(req.session.user.id);
                let addresses = [];
                if (addressesResponse.success){
                    addresses = addressesResponse.data
                }
                res.render('verify', {
                    title: AppName
                    , products: cart.getItems()
                    , totalPrice: cart.totalPrice
                    , type: 1
                    , user: req.session.user
                    , addresses: addresses
                });
            })();
        }
        else {
            res.render('address', {
                title: AppName
                , products: cart.getItems()
                , totalPrice: cart.totalPrice
                , type: 1
            });
        }
    }
});

router.post('/placeorder', function (req, res) {

    let params = req.body;
    let cart = new Cart(req.session.cart);
    let items = cart.getItems();

    (async () => {
        if (req.session.user){
            params.customerId = req.session.user.id;
            let response = await orderService.postOrder(params, items);
            if (response.success){
                req.session.cart = new Cart({});
                res.redirect('/?s=1');
            }
            else {
                res.redirect(`/address?m=${response.message}`);
            }
        }
        else {
            let response = await orderService.postGuestOrder(params, items);
            if (response.success){
                req.session.cart = new Cart({});
                res.redirect('/?s=1');
            }
            else {
                res.redirect(`/address?m=${response.message}`);
            }
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
            res.redirect(`/create-product?m=${response.data.message}`);
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
            res.redirect(`/edit-product/${params.id}?m=${response.data.message}`);
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


router.get('/view-order/:id', function (req, res) {
    let orderId = req.params.id;
    (async () => {
        let order = await orderService.getOrderById(orderId);
        order.total = 0;
        order.items.forEach(element =>
            order.total += element.subprice
        );
        
        
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