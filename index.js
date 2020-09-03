var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
const CookieParser = require("cookie-parser");
const session = require('express-session')
const mongoose = require('mongoose');
const flash = require('connect-flash');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/blog_database');
var BlogData = require("./models/BlogModel");
var UserData = require("./models/UserModel");
var passport = require('passport');
mongoose.connection.on('error', (error) => {
    console.log(error);
});
mongoose.connection.on("connected", () => {
    console.log("Database connected!");
});
var app = express();
app.use(bodyParser());
app.use(expressLayouts);
app.use(CookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(session({
    secret: 'topsecret'
}));
app.use(flash());
app.use(express.static(__dirname+'/uploads'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const AddRoute = require("./routes/Add.route");
const BlogRoute = require("./routes/Blog.route");
const LoginRoute = require("./routes/Login.route");
const LogOutRoute = require("./routes/Logout.route");
const SignUpRoute = require("./routes/Signup.route");
const UploadRoute = require("./routes/Upload.route");
const EditProfileRoute = require("./routes/Edit.route");
const CommentRoute = require("./routes/Comment.route");
const cookieParser = require('cookie-parser');

app.get('/fail1',(req,res)=>{
    req.flash('message','Sorry! Google Authentication failed please try again');
    res.redirect('/');
})
app.get('/fail2',(req,res)=>{
    res.clearCookie('jwt');
    req.flash('message','Sorry! Protected Route. You need to login first');
    res.redirect('/');
})
app.get('/fail3',(req,res)=>{
    req.flash('message','Sorry! Protected Route. You need to be the creater of content to be able to edit or delete it.');
    res.redirect('/');
})
app.use('/add', AddRoute);
app.use('/login',LoginRoute);
app.use('/signup',SignUpRoute);
app.use('/editprofile',EditProfileRoute);
app.use('/logout',LogOutRoute);
app.use('/comment',CommentRoute);
app.use('/',BlogRoute);
app.use((req,res)=>{
    res.status(401).send("Page Doesn't Exist");
})
app.listen('8000', function () {
    console.log('Started');
});