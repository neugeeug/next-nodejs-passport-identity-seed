'use strict';
/*
 *
 * Main App file index.js
 *
 */

/********* port config  *********/
var port = process.env.PORT || 8080;

/********* loading modules and plugins *********/
var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
require('./config/passport')(passport);
var app = express();
var cookie = require('cookie');
var connect = require('connect');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');

var CLIENT_SECRET = '9843102f-c73c-4ba4-b510-35a85e73ee14';

/********* app configuration *********/
app.use(bodyParser.json({limit: "50mb"}));
// app.use(session(
//     {
//         secret: 'my-super-secret-key',
//         resave: false,
//         saveUninitialized: true
//     })
// );
app.use(cookieSession({
     secret: 'secret-key-you-don\'t-tell-the-client',
     signed: true,
 }));
app.use(passport.initialize());
app.use(passport.session());
app.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
    if ('OPTIONS' == req.method) return res.status(200).end();
    next();
});

/********* start the server *********/
http.createServer(app).listen(port, 'localhost');
console.log('--> Services listening on port: '+port);

/********* home *********/
app.get('/',  function (req, res) {

    //just verifying that there is a user object on the request
    if(req.user) {

        // recover available data from user profile
        var user = req.user._json;
        var givenName = user.given_name || '';
        var familyName = user.family_name || '';
        var phoneNumber = user.phone_number || '';
        var pn = user.preferred_username || '';
        var email = user.email || '';
        var birthdate = user.birthdate || '';
        var gender = user.gender || '';
        var address = user.address || '';
        var addressFormatted = '';
        if(address !== '') {
            addressFormatted = user.address.formatted || '';
        }

        var sessionCookie = req.cookies;
        console.log('Cookies: ', req.cookies)
        var sessionID = cookieParser.signedCookie('s%3AgrnZqYasy3ctqwIvHR_GlqfxTDWQpP8W.I9kzQ69BXGM1Vil915eH2rEvr7hbFkNt%2FIdTlXeQ318', CLIENT_SECRET);
        console.log('sessionID', sessionID)


        //Build and send an HTML response object with user data from Identity Service
        var head = '<head><title>Welcome</title></head>';
        var body = '<body><h1>Welcome ' + givenName + '</h1>' +
            '<div>What we know about you:</div>' +
            '<ul>' +
                '<li><u>name:</u> ' + givenName + ' ' + familyName + '</li>' +
                '<li><u>tel:</u> ' + phoneNumber + '</li>' +
                '<li><u>email:</u> ' + email + '</li>' +
                '<li><u>birthdate:</u> ' + birthdate + '</li>' +
                '<li><u>gender:</u> ' + gender + '</li>' +
                '<li><u>address:</u> ' + addressFormatted + '</li>' +
                '<li><u>TCAD:</u> ' + pn + '</li>' +
                '<li><u>SESSION:</u> ' + sessionID + '</li>' +
            '</ul>';
        res.send('<html>'+head+body+'</html>');

    }
    else {
        res.redirect('/auth');
    }
});

app.get('/failure',  function (req, res) {
    return res.redirect('/auth');
});

/********* authentication *********/
app.get('/auth',           passport.authenticate('provider'));
app.get('/user',  passport.authenticate('provider', {
    successRedirect: '/',
    failureRedirect: '/failure'
}));
