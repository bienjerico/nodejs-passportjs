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
    res.send("<p>Please Login!</p><form method='post' action='/login'><input type='text' name='email'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form><a href='/auth/google'>GOOGLE LOGIN</a>");    
  });

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================  
router.route('/google')
  .get(function(req,res){
    res.send("<a href='/auth/google'>GOOGLE LOGIN</a>");    
  });


router.route('/auth/google')
    .get(passport.authenticate('google', { 
        scope : ['profile', 'email'] 
      }));

// the callback after google has authenticated the user
router.route('/auth/google/callback')
      .get(passport.authenticate('google', {
              successRedirect : '/profile',
              failureRedirect : '/google'
      }));

// =========================================================================
// GITHUB ==================================================================
// =========================================================================
router.route('/github')
  .get(function(req,res){
    res.send("<a href='/auth/github'>GITHUB LOGIN</a>");    
  });


router.route('/auth/github')
    .get(passport.authenticate('github', { 
        scope: [ 'user:email' ]
      }));
// the callback after google has authenticated the user
router.route('/auth/github/callback')
      .get(passport.authenticate('github', {
              successRedirect : '/profile',
              failureRedirect : '/github'
      }));


router.route('/profile')
  .get(loggedIn,function(req,res){
    console.log(req.isAuthenticated());
    console.log(req);
    res.send("Congratulations! you've successfully logged in. Your e-mail address is :" + req.user.email+" <br> google token : "+ req.user.google_token);    
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
