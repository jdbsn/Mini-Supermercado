const express = require('express');
const router = express.Router();

const slugify = require('slugify');

const Product = require('./Product');
const Category = require('../category/Category');

router.get('/product/create', (req, res) => {

    Category.findAll().then(categories => {
        res.render("product/create", {categories: categories});
    });

});

router.post('/product/create', (req, res) => {
    var name = req.body.productName;
    var price = req.body.price;
    var category = req.body.category;
    
    Product.create ({
        name: name,
        price: price,
        slug: slugify(name),
        categoryId: category
    }).then(()=> {
        res.redirect('/product/productslist');
    })

});

router.get('/product/productslist', (req, res) => {
    Product.findAll({ 
        limit: 7,
        include: [{model: Category}]
    }).then(products => {
        res.render("product/productslist", {
            products: products
        });
    });
});

router.get('/product/:slug', (req, res) => {
    var slug = req.params.slug;
    Product.findOne({
        where: {slug: slug}
    }).then(product => {
        if (product != undefined) {
            res.render('product/product', {
                product: product
            }); 
        } else {
            res.redirect('/');
        }
    });
});

router.get('/product/product', (req, res) => {
    var productID = req.body.id;

    Product.findOne({
        where: {id: productID}
    }).then(product => {
        if (product == undefined) {
            res.redirect('/');
        } else {
            res.render('./product/product', {
                product: product
            });
        }
    });
});

router.post('/product/delete', (req, res) => {
    var id = req.body.id;

    Product.destroy({
        where: {
            id: id
        }
    }).then (() =>{
        res.redirect('/product/productslist');
    });
});

router.get('/product/edit/:id', (req, res) => {
    var id = req.params.id;

    Product.findByPk(id).then(product => {
        if(product != undefined) {
            Category.findAll().then(categories => {
                res.render('product/edit', {product: product, categories: categories});
            })
        } else {
            res.redirect('/');
        }
    });
});

router.post('/product/edit', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var price = req.body.price;
    var category = req.body.category;

    Product.update({name: name, price: price, slug: slugify(name), categoryId: category}, {
        where: {
            id: id
        }
    }).then(()=> {
        res.redirect('/product/productslist')
    });
});

router.get('/product/productslist/page/:page', (req, res) => {
    var page = req.params.page;
    var offset = 0;

    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 7;
    }

    Product.findAndCountAll({
        limit: 7,
        offset: offset,
        include: [{model: Category}]  
    }).then(products => {
        var next;
        if (offset + 7 >= products.count){
            next = false;
        } else {
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            products: products
        }

            res.render('product/page', {result: result})

    });

});

module.exports = router;