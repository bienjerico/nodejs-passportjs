var express       = require('express');
var router        = express.Router();
var passport      = require('passport');

require('.././config/passport')(passport);

router.route('/signup')
  .post(passport.authenticate('local-signup'),function(req,res){
      var result = {message : req.flash('signupMessage')[0]};
      console.log(result);
      res.json(result);
  })
  .get(function(req,res){
    console.log(req.flash('signupMessage')[0]);
    res.send("<p>Please Sigup!</p><form method='post' action='/signup'><input type='text' name='email'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");    
  });

router.route('/login')
  .post(passport.authenticate('local-login'),function(req,res){
      var result = {message : req.flash('loginMessage')[0]};
      console.log(result);
      res.json(result);
  })
  .get(function(req,res){
    res.send("<p>Please Sigup!</p><form method='post' action='/login'><input type='text' name='email'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");    
  });

router.route('/profile')
  .get(loggedIn,function(req,res){
    isLoggedIn();
    console.log(req.isAuthenticated());
    console.log(req.user.email);
    console.log(req.flash('loginMessage'));
    res.send("Congratulations! you've successfully logged in. Your e-mail address is :" + req.user.email);    
  });

router.route('/logout')
  .get(function(req,res){
    console.log('logout');
    req.logout();     
    res.redirect('/login')
  });

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
module.exports = router;
