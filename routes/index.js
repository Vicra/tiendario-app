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

const AppName = 'La Tiendita del Rio';

let products = [];
(async () => {
  products = await productService.getProducts();
})();

async function login(req, res) {
  let response = {
      success: true,
      message: 'success',
      code: 200,
  }

  if (await userService.isValidUser(req.body)) {
      const payload = {
          check: true
      };
      const token = jwt.sign(payload, "miclaveultrasecreta123", {
          expiresIn: "12h"
      });

      response.data = token;
      res.status(response.code).send(response);
  }
  else {
      response.code = 401;
      res.status(response.code).send(response);
  }
}

const validarToken = express.Router();
validarToken.use((req, res, next) => {
    const token = req.headers['access-token'];

    if (token) {
        jwt.verify(token, app.get('llave'), (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token inválida' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            mensaje: 'Token no proveída.'
        });
    }
});

router.get('/', function (req, res, next) {
  (async () => {
    products = await productService.getProducts();
    res.render('index', 
      { 
        title: AppName,
        products: products,
        type: 1,
        success: req.query.s
      }
    );
  })();
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

  res.redirect('/?s=1');
});

router.get('/admin', function (req, res, next) {

  res.render('admin', {
    title: AppName
  });
});

router.get('/products', function (req, res, next) {

  (async () => {
    let products = await productService.getLatestProducts();
    res.render('product/products', {
      title: AppName,
      products: products,
      success: req.query.s,
      updated: req.query.u
    });
  })();
});

router.get('/create-product', function (req, res, next) {
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
      brands: brands,
      message: req.query.m
    });
  })();
});

router.post('/submit-product', function (req, res, next) {

  let params = req.body;

  (async () => {
    let response = await productService.postProduct(params);
    if(response.code != 200){
      res.redirect(`/create-product?m=${response.data.message}`);
    }
    else {
      res.redirect('/products?s=1');
    }
  })();
});

router.get('/edit-product/:id', function (req, res, next) {
  let productId = req.params.id;

  (async () => {
    let product = await productService.getProductById(productId);
    let categories = await categoryService.getCategories();
    let suppliers = await supplierService.getSuppliers();
    let brands = await brandService.getBrands();

    res.render('product/edit', {
      title: AppName,
      suppliers: suppliers,
      categories: categories,
      brands: brands,
      product: product,
      message: req.query.m
    });
  })();
});

router.post('/update-product', function (req, res, next) {

  let params = req.body;
  (params.available == "on")  ? params.available = 1 : params.available = 0;
  
  (async () => {
    let response = await productService.putProduct(params);
    if(response.code != 200){
      res.redirect(`/edit-product/${params.id}?m=${response.data.message}`);
    }
    else {
      res.redirect('/products?u=1');
    }
  })();
});


router.get('/suppliers', function (req, res, next) {

  (async () => {
    let suppliers = await supplierService.getLatestSuppliers();
    res.render('supplier/suppliers', {
      title: AppName,
      suppliers: suppliers,
      success: req.query.s,
      updated: req.query.u
    });
  })();
});

router.get('/create-supplier', function (req, res, next) {

  (async () => {
    res.render('supplier/create', {
      title: AppName
    });
  })();
});

router.post('/submit-supplier', function (req, res, next) {

  let params = req.body;

  (async () => {
    let response = await supplierService.postSupplier(params);
    if(response.code != 200){
      res.redirect(`/create-supplier?m=${response.data.message}`);
    }
    else {
      res.redirect('/suppliers?s=1');
    }
  })();
});

router.get('/edit-supplier/:id', function (req, res, next) {
  let supplierId = req.params.id;
  (async () => {
    let supplier = await supplierService.getSupplierById(supplierId);
    res.render('supplier/edit', {
      title: AppName,
      supplier: supplier,
      message: req.query.m
    });
  })();
});

router.post('/update-supplier', function (req, res, next) {

  let params = req.body;
  
  (async () => {
    let response = await supplierService.putSupplier(params);
    if(response.code != 200){
      res.redirect(`/edit-supplier/${params.id}?m=${response.data.message}`);
    }
    else {
      res.redirect('/suppliers?u=1');
    }
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

router.get('/categories', function (req, res, next) {
  (async () => {
    let categories = await categoryService.getCategories();
    res.render('category/categories', {
      title: AppName,
      categories: categories,
      success: req.query.s,
      updated: req.query.u
    });
  })();
});

router.get('/create-category', function (req, res, next) {

  (async () => {
    res.render('category/create', {
      title: AppName,
      message: req.query.m
    });
  })();
});

router.post('/submit-category', function (req, res, next) {

  let params = req.body;

  (async () => {
    let response = await categoryService.postCategory(params);
    if(response.code != 200){
      res.redirect(`/create-category?m=${response.data.message}`);
    }
    else {
      res.redirect('/categories?s=1');
    }
  })();
});

router.get('/edit-category/:id', function (req, res, next) {
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

router.post('/update-category', function (req, res, next) {

  let params = req.body;
  
  (async () => {
    let response = await categoryService.putCategory(params);
    if(response.code != 200){
      res.redirect(`/edit-category/${params.id}?m=${response.data.message}`);
    }
    else {
      res.redirect('/categories?u=1');
    }
  })();
});

router.get('/brands', function (req, res, next) {
  (async () => {
    let brands = await brandService.getBrands();
    res.render('brand/brands', {
      title: AppName,
      brands: brands,
      success: req.query.s,
      updated: req.query.u
    });
  })();
});

router.get('/create-brand', function (req, res, next) {

  (async () => {
    res.render('brand/create', {
      title: AppName,
      message: req.query.m
    });
  })();
});

router.post('/submit-brand', function (req, res, next) {

  let params = req.body;

  (async () => {
    let response = await brandService.postBrand(params);
    if(response.code != 200){
      res.redirect(`/create-brand?m=${response.data.message}`);
    }
    else {
      res.redirect('/brands?s=1');
    }
  })();
});

router.get('/edit-brand/:id', function (req, res, next) {
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

router.post('/update-brand', function (req, res, next) {

  let params = req.body;
  
  (async () => {
    let response = await brandService.putBrand(params);
    if(response.code != 200){
      res.redirect(`/edit-brand/${params.id}?m=${response.data.message}`);
    }
    else {
      res.redirect('/brands?u=1');
    }
  })();
});

module.exports = router;