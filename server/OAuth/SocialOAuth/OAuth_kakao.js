const express = require('express');
const path = require('path');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const session = require('express-session');
const models = require('../../database_db/models');
const config = require('./OAuth_config.json');
const crypto = require('crypto');
const url = require('url');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('KAKAO Login : Login_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database :', error);
}

module.exports = function(app, passport) {
    passport.use(new KakaoStrategy({
        clientID: config.kakao.clientID,
        clientSecret: config.kakao.clientSecret,
        callbackURL: config.kakao.callback
    }, 
    function (accessToken, refreshToken, profile, done) {
        models.User.findOne({
            where: {
                email: profile.emails[0].value,
                platform: 'kakao'
            }
        }).then(function(user) {
            if(!user) {
                var date = new Date();
                models.User.create({
                    email: profile.emails[0].value,
                    password: accessToken,
                    user_group: 'user',
                    user_id: 'testing',
                    platform: 'kakao',
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

    app.get('/auth/kakao', passport.authenticate('kakao', { scope: ['profile_nickname', 'profile_image', 'account_email'] }));

    app.get('/auth/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/user/login' }),
    function(req, res) {
        res.redirect('/');
    });
}