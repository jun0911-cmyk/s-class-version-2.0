const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/teacher/class', express.static('../public/css'));
    app.use('/teacher/class', express.static('../public/client'));
    app.use('/teacher/class', express.static('../public/favicon'));

    app.get('/teacher/class', function(req, res) {
        if(req.isAuthenticated()) {
            if (req.user.user_group == 'teacher' || req.user.user_group) {
                res.sendFile(path.join(__dirname, '..', '..', '/public/views/teacher_class.html'));
            } 
            if (req.user.user_group == 'user') {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });

    app.post('/teacher/class', (req, res) => {
        if(req.isAuthenticated()) {
            models.class.findAll({
                where: {
                    class_id: req.user.user_id
                }
            }).then(function(classroom_data) {
                models.class.findAndCountAll({
                    where: {
                        class_id: req.user.user_id
                    }
                })
                .then(function(count_data) {
                    res.json({ 
                        classroom: classroom_data, 
                        user: req.user,
                        rows_number: count_data 
                    });
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    });
}