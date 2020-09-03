const express = require("express");
const passport = require('passport');
const CommentData = require('./../models/CommentModel');
const BlogData = require('./../models/BlogModel');
const mongoose = require('mongoose');
const Router = express.Router();
Router.get('/:id',passport.authenticate('jwt',{failureRedirect: '/fail2'}), function (req, res) {
    const user = req.cookies['jwt'];
    res.render('comment', { page_name: "",user: user,id: req.params.id});
});
Router.post('/:id',passport.authenticate('jwt',{failureRedirect: '/fail2'}), function (req, res) {
    const user = req.cookies['jwt'];
    var newitem;
    newitem = req.body;
    newitem._id = new mongoose.Types.ObjectId;
    newitem.email = req.user.email;
    var data = CommentData(newitem);
    data.save(function(err){
        if(err)
        {
            req.flash('message',err);
            res/redirect('/');
        }
    });
    BlogData.findById(req.params.id).exec().then(function (doc){
        var newitem1 = doc;
        newitem1.comment.push(newitem._id);
        var data = BlogData(newitem1);
        data.save(function(err){
        if(err)
        {
            req.flash('message',err);
            res/redirect('/');
        }
    });
    }).catch((error) => { req.flash('message',error)
    res.redirect('/'); });
    req.flash('success',"COMMENT ADDED SUCCESSFULLY");
    res.redirect('/');
});
Router.post('/:id/delete',passport.authenticate('jwt',{failureRedirect: '/fail2'}), function(req,res){
    CommentData.findById(req.params.id).exec().then(function(doc){
        if(doc.email==req.user.email)
        {
            CommentData.findByIdAndDelete(req.params.id).exec().then(function (){
                req.flash('success',"COMMENT DELETED SUCCESSFULLY")
                res.redirect('/');
            }).catch((error) => { 
                req.flash('message',error)
                res.redirect('/');
            });
        }
        else
        {
            res.redirect('/fail3')
        }

    }).catch((err) => {
        req.flash('message',err);
        res.redirect('/');
    })
})
Router.get('/:id/edit',passport.authenticate('jwt',{failureRedirect: '/fail2'}),function(req,res){
    const user = req.cookies['jwt'];
    CommentData.findById(req.params.id).exec().then(function(doc){
        if(doc.email!=req.user.email)
        {
            res.redirect('/fail3')
        }
        else
        res.render('editcomment',{page_name: "",user: user,doc: doc})
    }).catch((err) => {
        req.flash('message',err);
        res.redirect('/');
    })
})
Router.post('/:id/edit',passport.authenticate('jwt',{failureRedirect: '/fail2'}),function(req,res){
    CommentData.findById(req.params.id).exec().then(function (doc){
        if(doc.email!=req.user.email)
        {
            res.redirect('/fail3');
            
        }
        else
        {
            CommentData.findByIdAndUpdate(req.params.id,req.body,{upsert: false},function(err,doc){
                if(err)
                {
                    req.flash('message',err);
                    res.redirect('/');
                }
                else
                {
                    console.log(doc);
                    req.flash('success','COMMENT EDITED SUCCESSFULLY');
                    res.redirect('/');
                }
            })
        }
        
    }).catch((error) => {
        req.flash('message',error)
        res.redirect('/');
        
    });
})
module.exports = Router;