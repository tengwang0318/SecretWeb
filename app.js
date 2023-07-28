require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");


const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({email: String, password: String});
// userSchema.plugin(encrypt, {"secret": process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});
app.post("/login", function (req, res) {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({"email": email})
        .then(function (foundItem) {

            bcrypt.compare(password, foundItem.password)
                .then(function (result) {
                    if (result) {
                        res.render("secrets");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    res.send(err);
                })
            // if (foundItem.password === password) {
            //     res.render("secrets");
            // }
        })
        .catch(function (err) {
            console.log(err);
        })
})
app.get("/register", function (req, res) {
    res.render("register");
});
app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds)
        .then(function (hash) {
            const newUser = new User({
                email: req.body.username, password: hash,
            });
            newUser.save()
                .then(function () {
                    res.render("secrets");
                })
                .catch(function (err) {
                    res.send(err);
                })
        })
        .catch(function (err) {
            console.log(err);
        });
});


app.listen(3000, function () {
    console.log("Successfully running on the port 3000.");
});