const express = require('express');
const app = express();
const server = require('http').createServer(app);
const models = require('../../database_db/models');
const io = require('socket.io')(server);

var clients;
var numClients;

var host = [];
var host_data;

var client = [];
var client_data;

var status;
var stream;

var checkoffer = false;
var checkanswer = false;

module.exports = function(app, io) {
    io.on('connection', function(socket) {
        function client_object(roomId, user) {
            client_data = {
                "connect_room": roomId,
                "client_name": user.email,
                "client_id": user.user_id,
                "client_group": user.user_group,
                "client_sdp": "null",
                "connected": true,
                "reconnected": false,
                "reloadUser": false,
            }
            client.push(client_data);
            console.log(client);
        }

        function host_object(roomId, room, user) {
            host_data = {
                "id": roomId,
                "name": room.class_name,
                "host_name": user.email,
                "host_group": user.user_group 
            };
            host.push(host_data);
        }

        function Network_Manager(roomId, user, room) {
            if (!room) {
                console.log(client.length);
                if (client.length == 0) {
                    client_object(roomId, user);
                    return;
                } 
                
                if (client.length != 0) {
                    for (var j = 0; j < client.length; j++) {
                        if (client[j].connect_room == roomId && client[j].client_name != user.email) {
                            client_object(roomId, user);
                        }
    
                        if (client[j].connect_room == roomId && client[j].client_name == user.email) {
                            client[j].connected = true;
                        }
                    }
                }
            }

            if (room) {
                if (host.length == 0) {
                    host_object(roomId, room, user);
                } 
                
                if (host.length != 0) {
                    for (var i = 0; i < host.length; i++) {
                        if (host[i].id != roomId) {
                            host_object(roomId, room, user);
                        }
                    }
                }
            }
        }

        socket.on('message', function(message) {
            socket.broadcast.emit('message', message);
        });

        socket.on('screen_message', function(message) {
            socket.broadcast.emit('screen_message', message);
        });

        // CREATE ROOM START 권한 확인
        socket.on('check_create_class', function(roomId, user) {
            if (user.user_group != 'admin' || user.user_group != 'teacher') {
                socket.emit('no_permissions', roomId);
            } 

            if (user.user_group == 'admin' || user.user_group == 'teacher') {
                models.class.findOne({
                    where: {
                        class_id: roomId
                    }
                }).then(function(room) {
                    if (room == null) {
                        socket.emit('not_class', roomId);
                    }

                    if (roomId != room.class_id && user.email != room.class_host) {
                        socket.emit('not_authenticated', roomId);
                    }

                    if (roomId == room.class_id && user.email == room.class_host) {
                        socket.emit('ready_create', roomId, user);
                    }
                });
            }
        });

        // CREATE CLASS
        socket.on('create_class', function(roomId, user) { 
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(function(room) {
                socket.emit('created', roomId, user.email);
                models.class.update({
                    class_status: 1
                }, {
                    where: {
                        class_id: roomId
                    }
                });
            })
            .catch(err => console.log(err));
        });

        // JOIN ROOM JOIN 권한 확인
        socket.on('check_class', function(roomId, user) {
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(function(room) {
                if (room == null) {
                    socket.emit('not_class', roomId);
                } else {
                    console.log(clients);
                    if (room.class_status == 0) {
                        socket.emit('offline_class', roomId);
                        return;
                    }

                    if (room.limit_join <= clients) {
                        socket.emit('full_class', roomId);
                        return;
                    }

                    if (host.length != 0) {
                        for (var i = 0; i < host.length; i++) {
                            if (host[i].id == roomId) {
                                socket.emit('ready_join', roomId, user);
                            }
                        }
                    }
                }
            });
        });
        
        // JOIN ROOM 비밀번호 확인
        socket.on('check_class_pwd', function(roomId, password) {
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(function(room) {
                if (room.class_pwd == password) {
                    socket.emit('check_success_pwd', roomId);
                } else {
                    socket.emit('check_fail_pwd', roomId);
                }
            });
        });

        // JOIN ROOM 대기실 승인
        socket.on('waiting_room', function(roomId, user) {
            io.emit('host_waiting_room', roomId, user);
        });
        
        // JOIN ROOM HOST 응답 (승인)
        socket.on('acknowledgment_class', function(roomId, user) {
            io.emit('waiting_room', roomId, user, 'success');
        });

        // JOIN ROOM HOST 응답 (비허가)
        socket.on('unlicensed_class', function(roomId, user) {
            io.emit('waiting_room', roomId, user, 'fail');
        });

        // JOIN CLASS
        socket.on('join_class', function(roomId, email, user) {
            for (var i = 0; i < host.length; i++) {
                if (host[i].id == roomId) {
                    models.class.findOne({
                        where: {
                            class_id: host[i].id
                        }
                    }).then(function(room) {
                        if (room.class_status == 1 && email == user.email) {
                            socket.emit('joined', roomId, clients);
                        }
                    });
                }
            }
        });

        socket.on('join_fail', function(roomId, email, user) {
            if (email == user.email) {
                socket.emit('joinFailed', roomId);
            }
        });

        // SUCCESS CREATED
        socket.on('created_class', function(roomId, user) {
            models.class.findOne({
                where: {
                    class_id: roomId
                }
            }).then(async function(room) {
                await Network_Manager(roomId, user, room);
                for (var i = 0; i < host.length; i++) {
                    if (host[i].id == roomId) {
                        socket.join(host[i].id);
                        socket.emit('created_class', host[i]);
                        clients = io.sockets.adapter.rooms.get(roomId).size;
                    }   
                }
            });
        });

        // SUCCESS JOINED
        socket.on('joined_class', function(roomId, user) {
            Network_Manager(roomId, user);
            for (var i = 0; i < client.length; i++) {
                if (client[i].connect_room == roomId && client[i].client_name == user.email) {
                    socket.join(client[i].connect_room);
                    socket.emit('joined_class', client[i]);
                    io.to(roomId).emit('join', client[i]);
                    io.to(roomId).emit('join_list', client[i]);
                    clients = io.sockets.adapter.rooms.get(roomId).size;
                }
            }
        });

        socket.on('disconnect', function() {
        });

        // 강의실 종료와 나가기는 통신 피어 구분자와 아이디로 파악하여 종료해야 하고 일일히 트랙을 멈춰야 한다, 아직까지 1:1에서만 최적화 되어있기에 3명이상 접속하면 작동이 되지 않는다. 따라서 피어구분자와 1:N이 최적화 되는 즉시 다시 머지 할것이다.

        // CLOSE CLASS 강의실 종료
        socket.on('close_class', function(roomId) {
            io.to(roomId).emit('close_class', roomId);

            for(var i = 0; i < host.length; i++) {
                if (host[i].id == roomId) {
                    socket.leave(host[i].id);
                    host.splice(host.indexOf(host[i]), 1);
                    models.class.update({
                        class_status: 0
                    }, {
                        where: {
                            class_id: roomId
                        }
                    });
                }
            }

            for (var j = 0; j < client.length; j++) {
                console.log(client[j]);
                if (client[j].connect_room == roomId) {
                    console.log(client[j]);
                    socket.leave(client[j].connect_room);
                    client.splice(client.indexOf(client[j]), 1);
                }
            }
        });

        // LEAVE CLASS 강의실 나가기
        socket.on('leave_class', function(roomId, user) {
            for (var i = 0; i < client.length; i++) {
                if (client[i].connect_room == roomId && client[i].client_name == user.email) {
                    socket.leave(roomId);
                    client.splice(client.indexOf(client[i]), 1);
                    clients = io.sockets.adapter.rooms.get(roomId).size;
                    io.to(roomId).emit('leave_class', roomId);
                }
            }
        });
    });
}