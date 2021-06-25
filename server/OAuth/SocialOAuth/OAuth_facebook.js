const express = require('express');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const models = require('../../database_db/models');
const config = require('./OAuth_config.json');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('NAVER Login : Login_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database :', error);
}

module.exports = function(app, passport) {
    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callback
    }, 
    function (accessToken, refreshToken, profile, done) {
        models.User.findOne({
            where: {
                email: profile.emails[0].value,
                platform: 'facebook'
            }
        }).then(function(user) {
            if(!user) {
                var date = new Date();
                models.User.create({
                    email: profile.emails[0].value,
                    password: accessToken,
                    user_group: 'user',
                    user_id: 'testing',
                    platform: 'facebook',
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

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['profile'] }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/user/login' }),
    function(req, res) {
        res.redirect('/');
    });
}