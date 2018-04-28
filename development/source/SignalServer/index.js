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
var app = require('express');
var http = require('http').Server(app);
const io = require('socket.io')(http, { 'pingInterval': 2000, 'pingTimeout': 5000 });
http.listen(3001, function(){
    console.log('listening on *:3001');
  });
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
    socket.on('OFFER_SDP', sdp => {
        // Xu ly su kien Offer
        //Todo CongVT implement Check role
        console.log('Co token gui len:' + socket.tokenId);// Log token
        let offerSDP = require('./Controllers/OfferSDP.js');
        offerSDP(io, socket, sdp);
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







