var express       = require('express');
var app           = express();
var port          = process.env.PORT || 3000;
var bodyParser    = require('body-parser');
var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var flash         = require('connect-flash');


// middleware
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));// parse application/x-www-form-urlencoded
app.use(bodyParser.json());// parse application/json
app.use(session({ secret: 'secretsecretsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./config/passport')(passport);

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    passReqToCallback: true
}),function(req, email, password, done) {
  console.log(done);
});



// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    passReqToCallback: true
}),function(req, email, password, done) {
  console.log(done);
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/login');
});


// api endpoints for login, content and logout
app.get("/login", function (req, res) {

    res.send("<p>Please login!</p><form method='post' action='/login'><input type='text' name='email'/><input type='password' name='password'/><button type='submit' value='submit'>Submit</buttom></form>");
});


app.get("/profile", function (req, res) {
  console.log(req.isAuthenticated());
  console.log(req.user.email);
    res.send("Congratulations! you've successfully logged in.");
});

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});