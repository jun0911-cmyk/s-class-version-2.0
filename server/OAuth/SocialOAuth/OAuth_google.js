const express = require('express');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const models = require('../../database_db/models');
const crypto = require('crypto');
const config = require('./OAuth_config.json');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('GOOGLE Login : Login_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database :', error);
}

module.exports = function(app, passport) {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callback
    }, 
    function (accessToken, refreshToken, profile, done) {
        models.User.findOne({
            where: {
                email: profile.emails[0].value,
                platform: 'google'
            }
        }).then(function(user) {
            if(!user) {
                var date = new Date();
                models.User.create({
                    email: profile.emails[0].value,
                    password: accessToken,
                    user_group: 'user',
                    user_id: 'testing',
                    platform: 'google',
                    select_teacher: 'not teacher',
                    create_account: date
                }).then(function(user) {
                    return done(null, user);
                })
                .catch(err => done(err));
            } else {
                return done(null, user);
            }
        })
        .catch(err => done(err));
    }));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/user/login' }),
    function(req, res) {
        res.redirect('/');
    });
}