var express = require('express');
var app = express();
var port     = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');


app.use(express.static(__dirname + "/public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());



// required for passport
app.use(session({ secret: 'secretsecretsecret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./config/passport')(passport);

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
	req.logout();
	// res.sendFile('/login.html');
});

app.get('/profile', function (req, res) {
  console.log(user);
  res.send('welcome');
});

app.get('/login', function (req, res) {
  res.sendFile('login.html');
});

app.get('/signup', function (req, res) {
  res.sendFile('signup.html');
});



app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});