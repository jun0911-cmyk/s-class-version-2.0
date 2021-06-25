const express = require('express');
const path = require('path');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const models = require('../../database_db/models');
const crypto = require('crypto');
const config = require('./OAuth_config.json');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('GITHUB Login : Login_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database :', error);
}

module.exports = function(app, passport) {
    passport.use(new GithubStrategy({
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callback
    }, 
    function (accessToken, refreshToken, profile, done) {
        models.User.findOne({
            where: {
                email: profile.emails[0].value,
                platform: 'github'
            }
        }).then(function(user) {
            if(!user) {
                var date = new Date();
                models.User.create({
                    email: profile.emails[0].value,
                    password: accessToken,
                    user_group: 'user',
                    user_id: 'testing',
                    platform: 'github',
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

    app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/user/login' }),
    function(req, res, user) {
        res.redirect('/');
    });
}