const express = require('express');
const path = require('path');
const models = require('../database_db/models');
const app = express();

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/student/invite', express.static('../public/css'));
    app.use('/student/invite', express.static('../public/client'));

    app.get('/student/invite', function(req, res) {
        if(req.isAuthenticated()) {
            res.sendFile(path.join(__dirname, '..', '..', '/public/views/invite_check.html'));
        } else {
            res.redirect('/');
        }
    });

    app.post('/student/invite', (req, res) => {
        if(req.isAuthenticated()) {
            models.User.findOne({
                where: {
                    email: req.user.email
                }
            }).then(function(teacherList) {
                if (teacherList.select_teacher == 'not teacher') {
                    res.json({
                        status: 'no',
                        invite: teacherList,
                        data: req.user
                    });
                } else if (teacherList.select_teacher != 'not teacher') {
                    res.json({
                        invite: teacherList,
                        data: req.user
                    });
                }
            })
            .catch(err => console.log(err));
        }
    });
}
