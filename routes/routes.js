var express       = require('express');
var router        = express.Router();
var passport      = require('passport');

require('.././config/passport')(passport);

router.route('/signup')
  .post(function(req,res,next){
    passport.authenticate('local-signup', {
      successRedirect : '/login', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      passReqToCallback: true
    })(req,res,next)
  })
  .get(function(req,res){
    console.log(req.flash('signupMessage'));
    res.send("<p>Please Sigup!</p><form method='post' action='/signup'><input type='text' name='email'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");    
  });

router.route('/login')
  .post(function(req,res,next){
    passport.authenticate('local-login', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      passReqToCallback: true
    })(req,res,next)
  })
  .get(function(req,res){
    console.log(req.flash('loginMessage'));
    res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='email'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");    
  });

router.route('/profile')
  .get(function(req,res){
    console.log(req.isAuthenticated());
    console.log(req.user.email);
    console.log(req.flash('loginMessage'));
    res.send("Congratulations! you've successfully logged in.");    
  });

module.exports = router;
