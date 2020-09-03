const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const CookieParser = require("cookie-parser");
var Schema = mongoose.Schema;
const BlogData = require("./../models/BlogModel");
const passport = require('passport');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { response } = require("express");
var Storage = multer.diskStorage({
     destination: function (req,file,cb){
         cb(null,'uploads/')
     },
     filename: function (req,file,cb){
         console.log(file);
         cb(null,req.body.title+path.extname(file.originalname).toLowerCase());
     }
});
var upload = multer({storage: Storage,limits: {fileSize: 10000000},fileFilter: function(req,file,cb){
    checkFileType(file,cb);
}});
function checkFileType(file,cb){
    const fileTypes = /jpg|jpeg|png|pdf|mp4/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extname)
    {
        return cb(null,true)
    }
    else
    {
        return cb('Document not in required format',null);
    }
}
const corsConfig = {
    methods: ['POST','GET'],
    origin: 'https://localhost:5000/testingcors',
}
Router.get('/',cors(corsConfig),function (req,res) {
    const user = req.cookies['jwt'];
    var error = [
        {
          stringValue: '"favicon.ico"',
          kind: 'ObjectId',
          value: 'favicon.ico',
          path: '_id',
          reason: {}
        }
      ];
    BlogData.find().exec().then(function (doc) {
        res.render('header', { page_name: "home", content: doc,user: user,flash: req.flash('message'),success: req.flash('success'),error: error}); 
    }).catch((error) => { req.flash('message',error)
    res.redirect('/'); });
});
Router.get('/blog/:id', function (req, res) {
    const user = req.cookies['jwt'];
    BlogData.findById(req.params.id).populate('comment').exec().then(function (doc){
        console.log(doc);
        res.render('fullpage',{page_name: "",detail: doc,user: user});
    }).catch((error) => { req.flash('message',error)
    res.redirect('/'); });
    
});
Router.post('/:id/_method=DELETE',passport.authenticate('jwt',{failureRedirect: '/fail2'}) ,function (req, res) {
    BlogData.findById(req.params.id).exec().then(function (doc){
        if(doc.email!=req.user.email)
        {
            res.redirect('/fail3');
            
        }
        else
        {
            BlogData.findByIdAndDelete(req.params.id).exec().then(function (){
                req.flash('success',"BLOG DELETED SUCCESSFULLY")
                res.redirect('/');
            }).catch((error) => { 
                req.flash('message',error)
                res.redirect('/');
            });
        }
    }).catch((error) => {
        
        req.flash('message',error)
        res.redirect('/');
    });
    
});
Router.get('/:id/_method=EDIT', passport.authenticate('jwt',{failureRedirect: '/fail2'}),function (req, res) {
    const user = req.cookies['jwt'];
    
    BlogData.findById(req.params.id).exec().then(function (doc){
        if(doc.email!=req.user.email)
        {
            res.redirect('/fail3');
        }
        else
        res.render('edit',{page_name: "",data: doc,user: user});
    }).catch((error) => {
        req.flash('message',error)
        res.redirect('/');
     });
    
});
Router.post('/:id/_method=EDIT',passport.authenticate('jwt',{failureRedirect: '/fail2'}),upload.array('profileImage',5), function (req, res) {
    const user = req.cookies['jwt'];
    BlogData.findById(req.params.id).exec().then(function (doc){
        var file = doc.file;
        if(doc.email!=req.user.email)
        {
            res.redirect('/fail3');
            
        }
        else
        {
            BlogData.findByIdAndDelete(req.params.id).exec().then(function (){
                var newitem;
                newitem = req.body;
                newitem._id = new mongoose.Types.ObjectId;
                newitem.email = req.user.email;
                if(req.files.length>0)
                file = req.files.map(a=>a.filename);
                newitem.file = file;
                var data = BlogData(newitem);
                data.save(function(err){
                    if(err)
                    {
                        req.flash('message',err);
                        res/redirect('/');
                    }
                });
                req.flash('success',"BLOG EDITED SUCCESSFULLY");
                res.redirect('/');
           }).catch((error) => { 
               console.log(error);
               req.flash('message',error);
               res.redirect('/');
           });
        }
        
    }).catch((error) => {
        req.flash('message',error)
        res.redirect('/');
        
    });
});
module.exports = Router;