const express = require("express");
const Router = express.Router();
const CookieParser = require("cookie-parser");
Router.get('/', function (req, res) {
    res.clearCookie('jwt');
    res.redirect('/');
});
module.exports = Router;