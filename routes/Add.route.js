const express = require("express");
const Router = express.Router();
const mongoose = require('mongoose');
const BlogData = require("./../models/BlogModel");
const passport = require('passport');
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
Router.get('/',passport.authenticate('jwt',{failureRedirect: '/fail2'}),function (req, res) {
    const user = req.cookies['jwt'];
    res.render('add', { page_name: "add",user: user});
});
Router.post('/',passport.authenticate('jwt',{failureRedirect: '/fail2'}),upload.array('profileImage',5),function (req,res){
    const user = req.cookies['jwt'];
    var newitem;
    newitem = req.body;
    newitem._id = new mongoose.Types.ObjectId;
    newitem.email = req.user.email;
    var file = req.files.map(a=>a.filename);
    newitem.file = file;
    newitem.comment = [];
    var data = BlogData(newitem);
    data.save(function(err){
        if(err)
        {
            req.flash('message',err);
            res/redirect('/');
        }
    });
    req.flash('success',"BLOG ADDED SUCCESSFULLY");
    res.redirect('/');
});
module.exports = Router;