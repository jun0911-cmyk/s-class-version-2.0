const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/problem', express.static('../public/css'));
    app.use('/problem', express.static('../public/client/webrtc/problem_books'));

    app.get('/problem', function(req, res) {
        if(req.isAuthenticated()) {
            res.sendFile(path.join(__dirname, '..', '..', '/public/views/problem_page.html'));
        } else {
            res.redirect('/');
        }
    });

    app.post('/problem', (req, res) => {
        if(req.isAuthenticated()) {
            res.json({
                user: req.user
            });
        }
    });
}
