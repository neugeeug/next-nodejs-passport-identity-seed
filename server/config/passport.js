'use strict';

// import passport openid-connect strategy
var Strategy = require('passport-openidconnect').Strategy;

// set issuer' specific OIDC endpoints
var IDENTITY_ISSUER = 'https://login.id-stage.telia.no/auth/realms/Employees';
var IDENTITY_ISSUER_ENDPOINT = IDENTITY_ISSUER + '/protocol/openid-connect';

// investigate how to support other environments e.g dev, test, prod
var CLIENT_ID = 'neo_test';
var CLIENT_SECRET = 'YOUR SECRET KEY - to have one contact Eugeniusz';
var CLIENT_REDIRECT_URL = 'http://localhost:8080/user';  //Telia Identity uses 'http://localhost:3000/auth/callback' as default


module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        console.log("ser:" + JSON.stringify(user, null, 2));
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log("deser:" + JSON.stringify(user, null, 2));
        done(null, user);
    });


    // set passport to use OpenIdConnect strategy
    passport.use('provider',
        new Strategy({
                issuer: IDENTITY_ISSUER,
                authorizationURL: IDENTITY_ISSUER_ENDPOINT + '/auth',
                tokenURL: IDENTITY_ISSUER_ENDPOINT + '/token',
                userInfoURL: IDENTITY_ISSUER_ENDPOINT + '/userinfo',
                clientID: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                callbackURL: CLIENT_REDIRECT_URL,
                scope: ['oidc']
            },
            function(accessToken, refreshToken, profile, next) {
                return next(null, profile);
            }
    ));
};
