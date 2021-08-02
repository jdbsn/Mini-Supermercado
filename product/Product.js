const Sequelize = require('sequelize');
const connection = require('../database/database');

const Category = require('../category/Category');

const Product = connection.define('produto', {
    name: {
        type: Sequelize.STRING,
        allowNULL: false
    },
    price: {
        type: Sequelize.STRING,
        allowNULL: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNULL: false
    }
});

Product.belongsTo(Category);
Category.hasMany(Product);

Product.sync({force: false}).then(()=> {});

module.exports = Product;