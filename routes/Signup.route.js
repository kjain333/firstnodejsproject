const express = require("express");
const Router = express.Router();
const mongoose = require('mongoose');
const UserData = require("./../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
Router.get('/', function (req, res) {
    res.render('signup', { page_name: "signup",user: null});
});
Router.post('/',async (req,res) => {
    try {
    var newitem;
    newitem = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(newitem.password,salt);
    newitem.password = hashpassword;
    newitem._id = new mongoose.Types.ObjectId;
    UserData.findOne({email: newitem.email}, function(err, user){
        if(err) {
            req.flash('message',error);
            res.redirect('/');
        }
        if(user) {
            req.flash('message',"User with this email already exists. Please login to continue");
            res.redirect('/login');
        } else {
            const opts = {expiresIn: 14400 };  
            const secret = 'topsecret'; 
            const token = jwt.sign({email: newitem.email,password: newitem.password}, secret,opts);
            res.cookie('jwt',token);
            var data = UserData(newitem);
            data.save(function(err){
                if(err)
                {
                    req.flash('message',err);
                    res/redirect('/');
                }
            });
            res.redirect('/');
        }
    });
    
    } catch (error) {
        req.flash('message','There seems to be some problem in our server please sign up again after some time.')
        res.redirect('/');
    }
});
module.exports = Router;