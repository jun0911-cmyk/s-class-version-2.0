const express = require('express');
const path = require('path');
const models = require('../../database_db/models');
const app = express();
const io = require('socket.io');

var roomId;

module.exports = function(app, io, server) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/class/check/room/:roomid', express.static('../public/css'));
    app.use('/class/check/room/:roomid', express.static('../public/client/webrtc'));

    app.get('/class/check/room/:roomid', function(req, res) {
        if(req.isAuthenticated()) {
            if (req.user.user_id == req.params.roomid && req.user.user_group == 'teacher') {
                res.sendFile(path.join(__dirname, '..', '..', '..', '/public/views/teacher_check_room.html'));
                roomId = req.params.roomid;
            }
            if (req.user.user_id !== req.params.roomid || req.user.user_group !== 'teacher') {
                res.sendFile(path.join(__dirname, '..', '..', '..', '/public/views/student_check_room.html'));
                roomId = req.params.roomid;
            }
        } else {
            res.redirect('/');
        }
    });

    app.post('/class/check/room/:roomid', (req, res) => {
        if(req.isAuthenticated()) {
            res.json({ user: req.user, roomid: roomId });
        }
    });
}