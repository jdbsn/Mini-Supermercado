const express = require ("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/signup", (req, res) => {
    res.render("admin/users/create")
});

router.post("/signup", (req, res) => {
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {

        if(user == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
        
            User.create({
                email: email,
                name: name,
                password: hash
            }).then(() => {
                res.redirect("/");
            })

        } else {
            res.redirect("/");
        }
        
    })

});

router.get("/admin/users/list", adminAuth, (req, res) => {

    User.findAll().then(users => {
        res.render("admin/users/list", {users: users})
    })

});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});


router.post("/authenticate", (req, res) => {
   var email = req.body.email;
   var password = req.body.password;

   User.findOne({where: {email: email}}).then(user => {
        if(user == undefined) {
            res.redirect("/login");
        } else {
            var correct = bcrypt.compareSync(password, user.password);
            
            if(correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
                res.redirect("/admin/index");
            }else {
                res.render("admin/users/login");
            }
            
        }
   });

});

router.get("/admin/index", adminAuth, (req, res) => {
    res.render("admin/index", {user: req.session.user});
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/")
})

module.exports = router;