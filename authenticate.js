const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const UserData = require("./models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const opts = {};
var cookieExtractor = function(req) {
        var token = null;
        if (req && req.cookies)
        {
            token = req.cookies['jwt'];
        }
        return token;
};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = 'topsecret'; 
passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
passport.deserializeUser(function(id, done) {
        done(null,user);
      });
module.exports.jwtStrategy = new JwtStrategy(opts, (jwt_payload, done) => {
        UserData.findOne({email: jwt_payload.email}).exec().then(async function(doc){
                try {
                    if(jwt_payload.password==doc.password){
                        return done(null,jwt_payload);
                    }
                    else{
                        return done(null,false);
                    }
                } catch (error) {
                    return done(null,false);
                }
            }).catch(function(err){
                return done(null,false);
            });
});
module.exports.googleStrategy = new GoogleStrategy({
        clientID: '643673798328-n1fu7029ltlka417l9472ch3eciv7eqa.apps.googleusercontent.com',
        clientSecret: 'kQIufpg2bkWaskagEtr4zUj0',
        callbackURL: "http://localhost:8000/login/googleauthcomplete"
      },
      function(accessToken, refreshToken, profile, done) {
        UserData.findOne({email: profile._json.email}).exec().then(async function(doc){
            const opts1 = {expiresIn: 14400 };  
            const secret = 'topsecret'; 
            const token = jwt.sign({email: doc.email,password: doc.password}, secret,opts1);
            return done(null,token);
            //data exists do nothing
        }).catch(async function(err){
            //add to database;
            try {
                var newitem = {
                    email: profile._json.email,
                    name: profile._json.name,
                    password:  await bcrypt.genSalt(10),
                    _id: new mongoose.Types.ObjectId,
                };
                const opts1 = {expiresIn: 14400 };  
                const secret = 'topsecret'; 
                const token = jwt.sign({email: newitem.email,password: newitem.password}, secret,opts1);
                var data = UserData(newitem);
                data.save();
                return done(null,token);

            } catch (error) {
                return done(error,null);
            }
        });     
        
      }
);
