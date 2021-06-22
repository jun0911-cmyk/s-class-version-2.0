const express = require('express');
const path = require('path');
const models = require('../../database_db/models');
const app = express();
const io = require('socket.io');

var roomId;

module.exports = function(app, io, server) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/class/live/room/classroom/screen/:roomid&:pwd', express.static('../public/css'));
    app.use('/class/live/room/classroom/screen/:roomid&:pwd', express.static('../public/client/webrtc'));

    app.get('/class/live/room/classroom/screen/:roomid&:tocken&:pwd', function(req, res) {
        if(req.isAuthenticated()) {
            res.sendFile(path.join(__dirname, '..', '..', '..', '/public/views/screen_class_room.html'));
            roomId = req.params.roomid;
        } else {
            res.redirect('/');
        }
    });

    app.post('/class/live/room/classroom/screen/:roomid&:pwd', (req, res) => {
        if(req.isAuthenticated()) {
            res.json({ user: req.user, roomid: roomId });
        }
    });
}