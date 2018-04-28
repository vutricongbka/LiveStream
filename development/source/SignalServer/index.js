/**
 * Signal Server
 * Write by CongVT
 * Date 28/4/2018
 */
//Bo sung Mongoose
var mongoose = require('mongoose');
//Setup DataModel
//Connect Database
var conn = mongoose.connect('mongodb://localhost/SignalServer');
//Get IO
const io = require('socket.io')(3001);
//Lang nghe client ket noi den.
io.on('connection', socket => {
    console.log(socket.id);
    //xu ly su kien disconnect
    socket.on('disconnect', () => {
        let disconnect = require('./Controllers/Disconnect.js');
        disconnect(socket);
    });
    //Xu ly su kien REGISTER
    socket.on('REGISTER', data => {
        let register = require('./Controllers/Register.js');
        register(socket, data);
    });
    // Xu ly su kien gui Offer
    socket.on('OFFER_SDP', data => {
        // Xu ly su kien Offer

    });
    // Xu ly su kien Answer
    socket.on('ANSWER_SDP', data => {
        // Luong xu ly Anser

    });
    // Xu ly Stop
    socket.on('STOP_MEDIA', data => {
        // Xu ly su kien Dung Media

    });

});
// Xu ly su kien disconnect







