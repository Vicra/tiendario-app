const express = require("express");
const router = express.Router();

const productService = require("../services/productService");
const adminService = require("../services/adminService");
const orderService = require("../services/orderService");
const supplierService = require("../services/supplierService");
const brandService = require("../services/brandService");
const categoryService = require("../services/categoryService");

const AppName = "La Tiendita del Río";

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid format image"), false);
        // cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: fileFilter,
});

router.get("/authenticate", function (_, res) {
    (async () => {
        res.render("admin/login", {
            title: AppName,
        });
    })();
});

router.post("/authenticate", function (req, res) {
    let params = req.body;
    (async () => {
        let response = await adminService.isValidUser(params);
        if (response.success) {
            req.session.admin = response.data;
            res.redirect("/admin");
        } else {
            res.render("admin/login", {
                title: AppName,
                message: response.message,
            });
        }
    })();
});

router.get("/admin", function (req, res) {
    (async () => {
        if (req.session.admin) {
            res.render("admin", {
                title: AppName,
            });
        } else {
            res.redirect("/authenticate");
        }
    })();
});

router.get("/products", function (req, res) {
    if (req.session.admin) {
        (async () => {
            let products = await productService.getLatestProducts();
            res.render("product/products", {
                title: AppName,
                products: products,
                success: req.query.s,
                updated: req.query.u,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/approve-order/:id", function (req, res) {
    if (req.session.admin) {
        let orderId = req.params.id;
        (async () => {
            let response = await orderService.approveOrder(orderId);
            if (response.success) {
                res.redirect(`/view-order/${orderId}?s=1`);
            } else {
                res.redirect(`/view-order/${orderId}?m=${response.message}`);
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/deliver-order/:id", function (req, res) {
    if (req.session.admin) {
        let orderId = req.params.id;
        (async () => {
            let response = await orderService.deliverOrder(orderId);
            if (response.success) {
                res.redirect(`/view-order/${orderId}?d=1`);
            } else {
                res.redirect(`/view-order/${orderId}?m=${response.message}`);
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/print-order/:id", function (req, res) {
    if (req.session.admin) {
        let orderId = req.params.id;
        (async () => {

        })();
    }
    else {
        res.redirect('/authenticate');
    }
});

router.get('/create-product', function (req, res) {
    if (req.session.admin) {
        let suppliers = [];
        let categories = [];
        let brands = [];
        (async () => {
            categories = await categoryService.getCategories();
            suppliers = await supplierService.getSuppliers();
            brands = await brandService.getBrands();

            res.render("product/create", {
                title: AppName,
                suppliers: suppliers,
                categories: categories,
                brands: brands,
                message: req.query.m,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post(
    "/submit-product",
    upload.single("productImage"),
    function (req, res) {
        if (req.session.admin) {
            let params = req.body;
            (async () => {
                if (params.hasCategory) {
                    let categoryResponse = await categoryService.postCategory({
                        name: params.newCategory,
                    });
                    params.categoryId = categoryResponse.data.insertId;
                }

                if (params.hasSupplier) {
                    let supplierResponse = await supplierService.postSupplier({
                        name: params.newSupplier,
                    });
                    params.supplierId = supplierResponse.data.insertId;
                }

                if (params.hasBrand) {
                    let brandResponse = await brandService.postBrand({
                        name: params.newBrand,
                    });
                    params.brandId = brandResponse.data.insertId;
                }

                if (req.file) {
                    params.url = req.file.filename;
                }

                let response = await productService.postProduct(params);
                if (response.code != 200) {
                    res.redirect(`/create-product?m=${response.message}`);
                } else {
                    res.redirect("/products?s=1");
                }
            })();
        } else {
            res.redirect("/authenticate");
        }
    }
);

router.get("/edit-product/:id", function (req, res) {
    if (req.session.admin) {
        let productId = req.params.id;
        (async () => {
            let product = await productService.getProductById(productId);
            let categories = await categoryService.getCategories();
            let suppliers = await supplierService.getSuppliers();
            let brands = await brandService.getBrands();

            res.render("product/edit", {
                title: AppName,
                suppliers: suppliers,
                categories: categories,
                brands: brands,
                product: product,
                message: req.query.m,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post(
    "/update-product",
    upload.single("productImage"),
    function (req, res) {
        if (req.session.admin) {
            let params = req.body;
            params.available == "on"
                ? (params.available = 1)
                : (params.available = "");
            params.showSite == "on"
                ? (params.showSite = 1)
                : (params.showSite = "");
            (async () => {
                if (params.hasCategory) {
                    let categoryResponse = await categoryService.postCategory({
                        name: params.newCategory,
                    });
                    params.categoryId = categoryResponse.data.insertId;
                }

                if (params.hasSupplier) {
                    let supplierResponse = await supplierService.postSupplier({
                        name: params.newSupplier,
                    });
                    params.supplierId = supplierResponse.data.insertId;
                }

                if (params.hasBrand) {
                    let brandResponse = await brandService.postBrand({
                        name: params.newBrand,
                    });
                    params.brandId = brandResponse.data.insertId;
                }

                if (req.file) {
                    params.url = req.file.filename;
                }

                let response = await productService.putProduct(params);
                if (response.code != 200) {
                    res.redirect(
                        `/edit-product/${params.id}?m=${response.message}`
                    );
                } else {
                    res.redirect("/products?u=1");
                }
            })();
        } else {
            res.redirect("/authenticate");
        }
    }
);

router.get("/suppliers", function (req, res) {
    if (req.session.admin) {
        (async () => {
            let suppliers = await supplierService.getLatestSuppliers();
            suppliers.forEach((supplier) => {
                if (supplier.address) {
                    let addressLength = supplier.address.length;
                    if (addressLength > 10) {
                        supplier.address = supplier.address.substring(0, 7);
                        supplier.address += "...";
                    } else {
                        supplier.address = supplier.address.substring(0, 10);
                    }
                }
            });
            res.render("supplier/suppliers", {
                title: AppName,
                suppliers: suppliers,
                success: req.query.s,
                updated: req.query.u,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/create-supplier", function (req, res) {
    if (req.session.admin) {
        (async () => {
            res.render("supplier/create", {
                title: AppName,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post("/submit-supplier", function (req, res) {
    if (req.session.admin) {
        let params = req.body;
        (async () => {
            let response = await supplierService.postSupplier(params);
            if (response.code != 200) {
                res.redirect(`/create-supplier?m=${response.data.message}`);
            } else {
                res.redirect("/suppliers?s=1");
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/edit-supplier/:id", function (req, res) {
    if (req.session.admin) {
        let supplierId = req.params.id;
        (async () => {
            let supplier = await supplierService.getSupplierById(supplierId);
            res.render("supplier/edit", {
                title: AppName,
                supplier: supplier,
                message: req.query.m,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post("/update-supplier", function (req, res) {
    if (req.session.admin) {
        let params = req.body;
        (async () => {
            let response = await supplierService.putSupplier(params);
            if (response.code != 200) {
                res.redirect(
                    `/edit-supplier/${params.id}?m=${response.data.message}`
                );
            } else {
                res.redirect("/suppliers?u=1");
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/orders", function (req, res) {
    if (req.session.admin) {
        (async () => {
            let orders = await orderService.getNewOrders();
            orders.forEach((order) => {
                let orderLength = order.customer.length;
                if (orderLength > 15) {
                    order.customer = order.customer.substring(0, 13);
                    order.customer += "...";
                } else {
                    order.customer = order.customer.substring(0, 15);
                }
            });
            res.render("order/orders", {
                title: AppName,
                orders: orders,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/view-order/:id", function (req, res) {
    if (req.session.admin) {
        let orderId = req.params.id;
        (async () => {
            let order = await orderService.getOrderById(orderId);
            if (order.approved == "1") {
                res.render("order/detail", {
                    title: AppName,
                    order: order,
                    success: req.query.s,
                    message: req.query.m,
                    delivered: req.query.d,
                });
            } else {
                order.products = order.items;
                res.render("order/edit", {
                    title: AppName,
                    order: order,
                    cart: JSON.stringify(order),
                    success: req.query.s,
                    message: req.query.m,
                });
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/categories", function (req, res) {
    if (req.session.admin) {
        (async () => {
            let categories = await categoryService.getCategories();
            res.render("category/categories", {
                title: AppName,
                categories: categories,
                success: req.query.s,
                updated: req.query.u,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/create-category", function (req, res) {
    if (req.session.admin) {
        (async () => {
            res.render("category/create", {
                title: AppName,
                message: req.query.m,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post("/submit-category", function (req, res) {
    if (req.session.admin) {
        let params = req.body;
        (async () => {
            let response = await categoryService.postCategory(params);
            if (response.code != 200) {
                res.redirect(`/create-category?m=${response.data.message}`);
            } else {
                res.redirect("/categories?s=1");
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/edit-category/:id", function (req, res) {
    if (req.session.admin) {
        let categoryId = req.params.id;
        (async () => {
            let category = await categoryService.getCategoryById(categoryId);
            res.render("category/edit", {
                title: AppName,
                category: category,
                message: req.query.m,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post("/update-category", function (req, res) {
    if (req.session.admin) {
        let params = req.body;
        (async () => {
            let response = await categoryService.putCategory(params);
            if (response.code != 200) {
                res.redirect(
                    `/edit-category/${params.id}?m=${response.data.message}`
                );
            } else {
                res.redirect("/categories?u=1");
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post("/update-order", function (req, res) {
    if (req.session.admin) {
        let params = req.body;
        let order = JSON.parse(params.order);
        (async () => {
            let response = await orderService.putOrder(order);
            if (response.code != 200) {
                res.redirect(
                    `/view-order/${order.id}?m=${response.data.message}`
                );
            } else {
                res.redirect(`/view-order/${order.id}?u=1`);
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/brands", function (req, res) {
    if (req.session.admin) {
        (async () => {
            let brands = await brandService.getBrands();
            res.render("brand/brands", {
                title: AppName,
                brands: brands,
                success: req.query.s,
                updated: req.query.u,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/create-brand", function (req, res) {
    if (req.session.admin) {
        (async () => {
            res.render("brand/create", {
                title: AppName,
                message: req.query.m,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post("/submit-brand", function (req, res) {
    if (req.session.admin) {
        let params = req.body;
        (async () => {
            let response = await brandService.postBrand(params);
            if (response.code != 200) {
                res.redirect(`/create-brand?m=${response.data.message}`);
            } else {
                res.redirect("/brands?s=1");
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.get("/edit-brand/:id", function (req, res) {
    if (req.session.admin) {
        let brandId = req.params.id;
        (async () => {
            let brand = await brandService.getBrandById(brandId);
            res.render("brand/edit", {
                title: AppName,
                brand: brand,
                message: req.query.m,
            });
        })();
    } else {
        res.redirect("/authenticate");
    }
});

router.post("/update-brand", function (req, res) {
    if (req.session.admin) {
        let params = req.body;
        (async () => {
            let response = await brandService.putBrand(params);
            if (response.code != 200) {
                res.redirect(
                    `/edit-brand/${params.id}?m=${response.data.message}`
                );
            } else {
                res.redirect("/brands?u=1");
            }
        })();
    } else {
        res.redirect("/authenticate");
    }
});

module.exports = router;
