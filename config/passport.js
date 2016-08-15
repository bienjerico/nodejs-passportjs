// config/passport.js
				
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;

var mysql = require('mysql');
// load the auth variables
var configAuth = require('./auth');


var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'root',
				  password : 'password@123',
                  database : 'passportjsdb'
				});


// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("serialize");
        // console.log(user);
		done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("deserialize"+id);
		connection.query("select * from users where id = "+id,function(err,rows){	

			done(err, rows[0]);
		});
    });
	

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        // console.log("select * from users where email = '"+email+"'");
        connection.query("select * from users where email = '"+email+"'",function(err,rows){
			// console.log(rows +" = "+ rows.length);
			// console.log("above row object");
			if (err){
                return done(err);
            }

            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUserMysql = new Object();
				
				newUserMysql.email    = email;
                newUserMysql.password = password; // use the generateHash function in our user model
			
				var insertQuery = "INSERT INTO users ( email, password ) values ('" + email +"','"+ password +"')";
					// console.log(insertQuery);
				connection.query(insertQuery,function(err,rows){
				newUserMysql.id = rows.insertId;
				
				return done(null, newUserMysql,req.flash('signupMessage', 'Successfully signed up'));
				});	
            }	
		});
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

         connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'",function(err,rows){
			if (err){
                return done(err);
            }
			if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                // return done(null, false, { "loginMessage":'No user found.'});
            } 
			// if the user is found but the password is wrong
            if (!( rows[0].password == password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			     // return done(null, false, { "loginMessage": 'Oops! Wrong password.'}); 
            }

            // all is well, return successful user
            return done(null, rows[0],req.flash('loginMessage', 'Successfully logged in.'));			
		
		});
    }));




    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            // User.findOne({ 'google.id' : profile.id }, function(err, user) {
            connection.query("SELECT * FROM `users` WHERE `google_id` = '" + profile.id  + "'",function(err,rows){
                if (err){
                    return done(err);
                }

                if (rows.length) {

                    // if a user is found, log them in
                    return done(null, rows[0]);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser           = new Object();

                    // set all of the relevant information
                    newUser.google_id    = profile.id;
                    newUser.google_token = token;
                    newUser.google_displayname  = profile.displayName;
                    newUser.google_email = profile.emails[0].value; // pull the first email

                    var insertQuery = "INSERT INTO users ( `google_id`,`google_token`,`google_displayname`,`google_email` ) values ('" + profile.id +"','"+ token +"','"+ profile.displayName +"','"+ profile.emails[0].value +"')";
                    // console.log(insertQuery);
                    connection.query(insertQuery,function(err,rows){
                    newUser.id = rows.insertId;
                    
                    return done(null, newUser);
                    })
                }
            })
        })
    }));


     // =========================================================================
    // GITHUB ==================================================================
    // =========================================================================
    passport.use(new GitHubStrategy({

        clientID        : configAuth.githubAuth.clientID,
        clientSecret    : configAuth.githubAuth.clientSecret,
        callbackURL     : configAuth.githubAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            // User.findOne({ 'google.id' : profile.id }, function(err, user) {
            connection.query("SELECT * FROM `users` WHERE `github_id` = '" + profile.id  + "'",function(err,rows){
                if (err){
                    return done(err);
                }

                if (rows.length) {

                    // if a user is found, log them in
                    return done(null, rows[0]);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser           = new Object();

                    // set all of the relevant information
                    newUser.github_id    = profile.id;
                    newUser.github_token = token;
                    newUser.github_displayname  = profile.displayName;
                    newUser.github_email = profile.emails[0].value; // pull the first email

                    var insertQuery = "INSERT INTO users ( `github_id`,`github_token`,`github_displayname`,`github_email` ) values ('" + profile.id +"','"+ token +"','"+ profile.displayName +"','"+ profile.emails[0].value +"')";
                    // console.log(insertQuery);
                    connection.query(insertQuery,function(err,rows){
                    newUser.id = rows.insertId;
                    
                    return done(null, newUser);
                    })
                }
            })
        })
    }));

};