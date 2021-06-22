const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/student/check/class', express.static('../public/css'));
    app.use('/student/check/class', express.static('../public/client'));

    app.get('/student/check/class', function(req, res) {
        if(req.isAuthenticated()) {
            res.sendFile(path.join(__dirname, '..', '..', '/public/views/check_class.html'));
        } else {
            res.redirect('/');
        }
    });

    app.post('/student/check/class', (req, res) => {
        if(req.isAuthenticated()) {
            models.class.findAll().then(function(classroom_data) {
                models.class.findAndCountAll()
                .then(function(count_data) {
                    res.json({ 
                        classroom: classroom_data, 
                        data: req.user,
                        rows_number: count_data 
                    });
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    });
}
