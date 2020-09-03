const express = require("express");
const Router = express.Router();
const multer = require('multer');
const path = require('path');
const { response } = require("express");
var Storage = multer.diskStorage({
     destination: function (req,file,cb){
         cb(null,'uploads/')
     },
     filename: function (req,file,cb){
         console.log(file);
         cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname).toLowerCase());
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
Router.get('/',function (req,res){
    res.render('upload',{page_name: "",user: null,})
});
Router.post('/',upload.array('profileImage',5), function (req, res) {
   var file = req.files[0];
   console.log(req.files);
   res.render('image',{file:file.filename,page_name: "",user: null});
});
module.exports = Router;