// signaling 파일 rtc로 전부 옮겨서 서버 구동 시키기
const socket = window.io();

export const sendMessage = (type, payload) => socket.emit('message', {type, payload});

export const onMessage = (type, callback) => socket.on('message', message => (
  message.type === type && callback(message.payload)
));

export const ScreenSendMessage = (type, payload) => socket.emit('screen_message', {type, payload});

export const ScreenOnMessage = (type, callback) => socket.on('screen_message', message => (
  message.type === type && callback(message.payload)
));