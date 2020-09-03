const express = require("express");
const Router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const passport = require('passport');
const authentication = require('./../authenticate');
passport.use('jwt',authentication.jwtStrategy);
passport.use('google',authentication.googleStrategy);
const UserData = require("./../models/UserModel");
const authTokens = {};
Router.get('/', function (req, res) {
    res.render('login', { page_name: "login",user: null,flash: req.flash('message')});
});
Router.get("/googleauth",passport.authenticate('google',{scope: ['profile','email']}));
Router.get("/googleauthcomplete",passport.authenticate('google',{failureRedirect: '/fail1'}),(req,res)=> {
    res.cookie('jwt',req.user);
    res.redirect('/');
});
Router.post('/',async (req,res) => {
      UserData.findOne({email: req.body.email}).exec().then(async function(doc){
        if(doc==null)
        {
            req.flash('message',"Email not found. Please sign up first.")
            res.redirect('/login');
        }
        try {
            if(await bcrypt.compare(req.body.password,await doc.password)){
                
                const opts = {expiresIn: 14400 };  
                const secret = 'topsecret'; 
                const token = jwt.sign({email: doc.email,password: doc.password}, secret,opts);
                res.cookie('jwt',token);
                res.redirect('/');
            }
            else{
                req.flash('message',"Password Incorrect")
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error);
            req.flash('message',"Error Please try Again later.")
            res.redirect('/login');
        }
    }).catch(function(err){
        req.flash('message',"Email not found. Please sign up first.")
        res.redirect('/login');
    });
});
module.exports = Router;