const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/teacher/invite/list', express.static('../public/css'));
    app.use('/teacher/invite/list', express.static('../public/client'));

    app.get('/teacher/invite/list', function(req, res) {
        if(req.isAuthenticated()) {
            if (req.user.user_group == 'teacher' || req.user.user_group) {
                res.sendFile(path.join(__dirname, '..', '..', '/public/views/invite_page.html'));
            } 
            if (req.user.user_group == 'user') {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });

    app.post('/teacher/invite/list', (req, res) => {
        if(req.isAuthenticated()) {
            models.User.findAll().then(function(list_data) {
                res.json({
                    inviteList: list_data,
                    user: req.user
                });
            })
            .catch(err => console.log(err));
        }
    });
}
