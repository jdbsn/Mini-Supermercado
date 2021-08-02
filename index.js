const express = require("express");
const app = express();
const connection = require("./database/database");

const productController = require('./product/ProductController');
const categoryController = require('./category/CategoryController');

//View engine
app.set('view engine', 'ejs');

//Arquivos estáticos
app.use(express.static('public'));

//Body-Parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// BD
connection.authenticate().then(() => {
    console.log("BD Rodando")})
    .catch((msgErro) => {
        console.log(msgErro);
    });

//Caminho padrão
app.get('/', (req, res) => {
    res.render("index");
});

// Caminhos
app.use('/', productController);
app.use('/', categoryController);

app.listen(3000, () => console.log("Servidor rodando."));