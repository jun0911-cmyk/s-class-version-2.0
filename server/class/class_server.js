const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

try {
    models.sequelize.authenticate();
    console.log('ClassRoom : classroom_db Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database :', error);
}

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/student/class', express.static('../public/css'));
    app.use('/student/class', express.static('../public/client'));

    app.get('/student/class', function(req, res) {
        if(req.isAuthenticated()) {
            res.sendFile(path.join(__dirname, '..', '..', '/public/views/class.html'));
        } else {
            res.redirect('/');
        }
    });

    app.post('/student/class', (req, res) => {
        if(req.isAuthenticated()) {
            models.teacher.findAll().then(function(teacherList) {
                res.json({
                    classroom: teacherList,
                    data: req.user
                });
            })
            .catch(err => console.log(err));
        }
    });
}
