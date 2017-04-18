// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User = require('../base/user/model').User;

var Common = require('../configs/common');
// load the auth key
var Oauth = Common.oauth;

var Encryption = require('../helpers/encryption')
// expose this function to our app using module.exports
module.exports = function(passport) {
    var isSuperAdmin = false;

    var output = function(user){
		return {
			_id: user._id,
			username: user.username,
            email: user.email,
			roles: user.roles
		};
	};

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        if(isSuperAdmin){
            return done(null, Common.superuser);
        }
        else{
            User.findById(id, function(err, user) {
                return done(err, user);
            });
        }
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('login-local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : '_name',
        passwordField : '_pass',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        //login with super user
        if(username == Common.superuser.username && password == Common.superuser.password){
            //console.log('is superadmin login');
            isSuperAdmin = true;
            return done(null, output(Common.superuser));
        }
        else{
            User.findUser(username , function(err, user) {
            // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, { message: "No user found." }); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!Encryption.compare(password, user.password))
                    return done(null, false, { message: "Oops! Wrong password." }); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, output(user));
            });
        }

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : Oauth.facebook.clientID,
        clientSecret    : Oauth.facebook.clientSecret,
        callbackURL     : Oauth.facebook.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

};