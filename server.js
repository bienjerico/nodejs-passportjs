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


var routes = require('./routes/routes');
app.use('/',routes);

app.listen(port, function () {
  console.log('Example app listening on port '+port+'!');
});