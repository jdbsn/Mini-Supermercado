const express = require('express');
const router = express.Router();
const slugify = require ('slugify');

const Category  = require('./Category');

router.get('/admin/categories/createcategory', (req, res) => {
    res.render('./admin/categories/createcategory');
});

router.post('/admin/categories/createcategory', (req, res) => {
    var name = req.body.name;

    Category.create ({
        name: name,
        slug: slugify(name)
    }).then(()=> {
        res.redirect('./categorieslist')
    })

});

router.get('/admin/categories/categorieslist', (req, res) => {
    Category.findAll().then(categories => {
        res.render('./admin/categories/categorieslist', {categories: categories});
    })
});

router.post('/admin/categories/deletecategory', (req, res) => {
    var id = req.body.id;

    Category.destroy({
        where: {
            id: id
        }
    }).then(()=> {
        res.redirect('/admin/categories/categorieslist')
    })

})

router.get('/admin/categories/edit/:id', (req, res) => {
    var id = req.params.id;

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render('./admin/categories/edit', {category: category})
        } else {
            res.redirect("/")
        }
    });

});

router.post('/admin/categories/edit', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;

    Category.update({name: name, slug: slugify(name)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('categorieslist');
    })

})

module.exports = router;