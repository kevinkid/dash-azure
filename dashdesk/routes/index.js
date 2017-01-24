// Routes Definition 

var express = require("express");
var router = express.Router();
var authContext = require("adal-node").AuthenticationContext;



exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};


//======================

router.get('/', function (req, res) {
   
    if (req.query.code != null) {
        console.dir("Not found code in query param .");

    }
    res.redirect("/index.html");
     
});


router.get("/callback", function (req, res) {
   
    console.dir("Checking for code query param");
     
    console.dir("Found code in query param .");

});






















































