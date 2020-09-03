const express = require("express");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const UserData = require("./../models/UserModel");
const CommentData = require("./../models/CommentModel");
const BlogData = require("./../models/BlogModel");
const Router = express.Router();
Router.get('/',passport.authenticate('jwt',{failureRedirect: '/fail2'}), function (req, res) {
    const user = req.cookies['jwt'];
    UserData.findOne({email: req.user.email}).exec().then(async function(doc){
        res.render('editprofile',{page_name: "editprofile",user: user,data: doc,flash: req.flash('message'),success: req.flash('success')})
    }).catch((err)=>{
        req.flash('message',err);
        res.redirect('/');
    });
});
Router.post('/edit', passport.authenticate('jwt',{failureRedirect: '/fail2'}),function (req, res) {
    var c =0;
    UserData.findOneAndUpdate({email: req.user.email},req.body,{upsert: false},function(err,doc){
        if(err)
        {
            req.flash('message',err);
            res.redirect('/editprofile');
            c=1;
        }
        else
        {
            BlogData.updateMany({email: doc.email},req.body,{upsert: false},function(err,doc){
                if(err)
                {
                    req.flash('message',err);
                    res.redirect('/editprofile');
                    c=1;
                } 
            });
            CommentData.updateMany({email: doc.email},req.body,{upsert: false},function(err,doc){
                if(err)
                {
                    req.flash('message',err);
                    res.redirect('/editprofile');
                    c=1;
                } 
            });
            if(c==0)
            {
                const opts = {expiresIn: 14400 };  
                const secret = 'topsecret'; 
                const token = jwt.sign({email: req.body.email,password: doc.password}, secret,opts);
                res.cookie('jwt',token);
                req.flash('success','USER EDITED SUCCESSFULLY');
                res.redirect('/');
            }
        }
    })
});
Router.post('/delete',passport.authenticate('jwt',{failureRedirect: '/fail2'}), function (req, res) {
    UserData.findOne({email: req.user.email}).exec().then(async function(doc){
        UserData.findOneAndDelete({email: req.user.email}).exec().then(function(){
            res.clearCookie('jwt');
            req.flash('success','USER DELETED SUCCESSFULLY');
            res.redirect('/');
        }).catch((err)=>{
            req.flash('message',err);
            res.redirect('/editprofile');
        })
    }).catch((err)=>{
        req.flash('message',err);
        res.redirect('/');
    });
});
module.exports = Router;