const express = require('express');
const path = require('path');
const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const models = require('../../database_db/models');
const crypto = require('crypto');
const config = require('./OAuth_config.json');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('NAVER Login : Login_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database :', error);
}

module.exports = function(app, passport) {
    passport.use(new NaverStrategy({
        clientID: config.naver.clientID,
        clientSecret: config.naver.clientSecret,
        callbackURL: config.naver.callback
    }, 
    function (accessToken, refreshToken, profile, done) {
        models.User.findOne({
            where: {
                email: profile.emails[0].value,
                platform: 'naver'
            }
        }).then(function(user) {
            var date = new Date();
            if(!user) {
                models.User.create({
                    email: profile.emails[0].value,
                    password: accessToken,
                    user_group: 'user',
                    user_id: 'testing',
                    platform: 'naver',
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

    app.get('/auth/naver', passport.authenticate('naver', { scope: ['profile'] }));

    app.get('/auth/naver/callback', passport.authenticate('naver', { failureRedirect: '/user/login' }),
    function(req, res) {
        res.redirect('/');
    });
}