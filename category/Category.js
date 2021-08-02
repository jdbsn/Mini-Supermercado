const Sequelize = require('Sequelize');
const connection = require('../database/database');

const Category = connection.define('category', {
    name: {
        type: Sequelize.STRING,
        allowNULL: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNULL: false
    }
});

Category.sync({force: false}).then(()=> {});

module.exports = Category;