const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const orderService = require('../services/orderService');

const supplierService = require('../services/supplierService');
const categoryService = require('../services/categoryService');
const brandService = require('../services/brandService');

let Cart = require('../models/cart');

const AppName = 'La Tiendita del Rio';

let products = [];
(async () => {
  products = await productService.getProducts();
})();

router.get('/', function (req, res, next) {
  console.log(products.length);
  if(!products.length){
    (async () => {
      products = await productService.getProducts();
    })();
    res.render('index', 
    { 
      title: AppName,
      products: products,
      type: 1
    }
    );
  }
  else{
    res.render('index', 
      { 
        title: AppName,
        products: products,
        type: 1
      }
    );
  }
});

router.get('/add/:id', function (req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let product = products.filter(function (item) {
    return item.id == productId;
  });
  cart.add(product[0], productId);
  req.session.cart = cart;
  res.redirect('/');
});

router.get('/cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null,
      type: 1
    });
  }
  let cart = new Cart(req.session.cart);
  res.render('cart', {
    title: AppName,
    products: cart.getItems(),
    totalPrice: cart.totalPrice,
    type: 1
  });
});

router.get('/remove/:id', function (req, res, next) {
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/address', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('address', {
      products: null,
      type: 1
    });
  }
  let cart = new Cart(req.session.cart);
  res.render('address', {
    title: AppName,
    products: cart.getItems(),
    totalPrice: cart.totalPrice,
    type: 1
  });
});

router.post('/placeorder', function (req, res, next) {

  let params = req.body;
  let cart = new Cart(req.session.cart);
  let items = cart.getItems();

  (async () => {
    await orderService.postOrder(params, items);
  })();
  req.session.cart = new Cart({});

  res.render('index',
    {
      title: AppName,
      products: products,
      type: 1
    }
  );
});

router.get('/admin', function (req, res, next) {

  res.render('admin', {
    title: AppName
  });
});

router.get('/products', function (req, res, next) {

  (async () => {
    let products = await productService.getProducts();
    res.render('product/products', {
      title: AppName,
      products: products
    });
  })();
});

router.get('/createproduct', function (req, res, next) {
  let suppliers = [];
  let categories = [];
  let brands = [];
  (async () => {
    categories = await categoryService.getCategories();
    suppliers = await supplierService.getSuppliers();
    brands = await brandService.getBrands();

    res.render('product/create', {
      title: AppName,
      suppliers: suppliers,
      categories: categories,
      brands: brands
    });
  })();
});

router.post('/submitproduct', function (req, res, next) {

  let params = req.body;

  (async () => {
    await productService.postProduct(params);
    res.redirect('/products');
  })();
});

router.get('/suppliers', function (req, res, next) {

  (async () => {
    let suppliers = await supplierService.getSuppliers();
    res.render('supplier/suppliers', {
      title: AppName,
      suppliers: suppliers
    });
  })();
});

router.get('/createsupplier', function (req, res, next) {

  (async () => {
    res.render('supplier/create', {
      title: AppName
    });
  })();
});

router.get('/orders', function (req, res, next) {

  (async () => {
    let orders = await orderService.getNewOrders();
    res.render('order/orders', {
      title: AppName,
      orders: orders
    });
  })();
});

router.get('/catalog', function (req, res, next) {

  (async () => {
    let categoriesCatalog = await productService.getProductsByCategory();

    res.render('catalog', {
      title: AppName,
      categories: categoriesCatalog,
      type: 1
    });
  })();
});

router.get('/view-order/:id', function (req, res, next) {
  let orderId = req.params.id;
  (async () => {
    let order = await orderService.getOrderById(orderId);
    order.total = 0;
    order.items.forEach(element =>
      order.total += element.subprice
    );
    res.render('order/detail', {
      title: AppName,
      order: order
    });
  })();
});

module.exports = router;
