//Client side
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');
socket.emit('REGISTER', { 'name': 'Camera', 'pass': '123' });
socket.on('REGISTER', data => {
    console.log(data);

});
