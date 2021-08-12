const express = require("express");
const app = express();
const connection = require("./database/database");
const session = require("express-session");

const productController = require('./product/ProductController');
const categoryController = require('./category/CategoryController');
const userController = require('./user/UserContoller');

//View engine
app.set('view engine', 'ejs');

//Session

app.use(session({
    secret: "1ijF91kmd!a", cookie: {maxAge: 900000}
}));

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

app.get('/session', (req, res) => {
    req.session.name = "João"
    res.send("Sessão gerada")
});

app.get('/leitura', (req, res) => {
    res.json({
        name: req.session.name
    })
})

// Caminhos
app.use('/', productController);
app.use('/', categoryController);
app.use('/', userController)

app.listen(3000, () => console.log("Servidor rodando."));