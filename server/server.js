const express = require('express');
const requestIp = require('request-ip');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const fs = require('fs');

const port = process.env.PORT || 8000;
const app = express();
const credentials = {
    key: fs.readFileSync('./cert.key'),
    cert: fs.readFileSync('./cert.crt'),
};
const server = require('https').createServer(credentials, app);
const io = require('socket.io')(server);

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', __dirname + '/');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
require('dotenv').config();  
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	resave: false,
	saveUninitialize: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 's-class_session-cookie',
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// OAuth
require('./OAuth/OAuth_singup')(app, crypto);
require('./OAuth/OAuth_s-class')(app, passport);
require('./OAuth/SocialOAuth/OAuth_google')(app, passport);
require('./OAuth/SocialOAuth/OAuth_kakao')(app, passport);
require('./OAuth/SocialOAuth/OAuth_naver')(app, passport);
require('./OAuth/SocialOAuth/OAuth_github')(app, passport);

// Class
require('./class/class_server')(app);
require('./class/check_class_server')(app);
require('./class/teacher_class_server')(app);
require('./class/teacher_invite')(app);

// WebRTC
require('./class/webrtc_server/rtc_connect')(app, io, server);
require('./class/webrtc_server/check_room')(app, io, server);
require('./class/webrtc_server/signaling_socket')(app, io);
require('./class/webrtc_server/screen_server')(app, io, server); 
require('./class/webrtc_server/devices_setting')(app, io, server);

// Problem
require('./problem_server/problem_page_server')(app, io, server);

// s-class connection
app.use('/s-class', express.static('../public/views'));
app.use('/s-class', express.static('../public/css'));
app.use('/s-class', express.static('../public/client'));
app.use('/s-class', express.static('../public/favicon'));

app.get('/', (req, res) => {
    //console.log(req.user);
    console.log('cookie : ', req.cookies);
    console.log('signedCookies : ', req.signedCookies);
    console.log("User Connection Public IP : " + requestIp.getClientIp(req));
    res.redirect('/s-class');
});

app.post('/s-class', (req, res, next) => {
    function auth_cookie(email, user_group, platform) {
        var hashemail = crypto.createHash('sha512').update(email).digest('base64');
        var hashgroup = crypto.createHash('sha512').update(user_group).digest('base64');
        var hashplatform = crypto.createHash('sha512').update(platform).digest('base64');
        res.cookie('service_user', `${hashemail}`, {
            httpOnly: true,
            singed: true
        });
        res.cookie('service_group', `${hashgroup}`, {
            httpOnly: true,
            singed: true
        });
        res.cookie('service_platform', `${hashplatform}`, {
            httpOnly: true,
            singed: true
        });
        res.cookie('logged_in', `yes`, {
            httpOnly: true,
            singed: true
        }); 
    }
    const conn = req.body.connect;
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()) {
        const User = req.user.dataValues;
        auth_cookie(User.email, User.user_group, User.platform);
        res.json({ auth: true, user: req.user });
    } else {
        res.json({ auth: false });
    }
    if(conn == 1) {
        console.log('main server connection success');
    }
});

// Server URL SETTING RENDERING

app.use('/', function (req, res, next) {
    console.log(req.session.user.password);
    console.log('Request URL:', req.originalUrl)
    next()
}, function (req, res, next) {
    console.log('Request Type:', req.method)
    next()
});

// Server Error 404 AND 500

app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('../public/views/error.html');
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});

// Server Connection

server.listen(port, function() {
    console.log(`PORT : http://127.0.0.1:${port}`);
});
