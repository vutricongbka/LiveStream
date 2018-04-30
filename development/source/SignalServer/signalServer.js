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
http.listen(3001, function () {
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
    // Tao a call
    socket.on('CREATE_CALL', data => {
        console.log('Da nhan duoc yeu cau tao cuoc goi');
        //Todo CongVT kiem tra quyen thuc thi
        let createCall = require('./Controllers/CreateCall.js');
        createCall(io, socket, data);
    });
    // Huy a call

    socket.on('CANCEL_CALL', data => {
        // let register = require('./Controllers/Register.js');
        // register(socket, data);
    });



    // Xu ly su kien gui Offer
    socket.on('OFFER_SDP', data => {
        // Xu ly su kien Offer
        //Todo CongVT implement Check role
        console.log('Co token gui len:' + socket.tokenId);// Log token
        let offerSDP = require('./Controllers/OfferSDP.js');
        offerSDP(io, socket, data);
    });
    // Xu ly su kien Answer
    socket.on('ANSWER_SDP', data => {
        // Luong xu ly Anser
        console.log('Nhan duoc tra loi:' + socket.tokenId);// Log token
        let answerSDP = require('./Controllers/AnswerSDP.js');
        answerSDP(io, socket, data);
    });

    /**
     * Xu ly Candidate
     * 
     * 
     */
    socket.on('OFFER_CANDIDATE', data => {
        // Xu ly su kien Offer
        //Todo CongVT implement Check role
        console.log('Co offer candidate gui len:' + socket.tokenId);// Log token
        //let offerSDP = require('./Controllers/OfferSDP.js');
        //offerSDP(io, socket, sdp);
        let offerCandidate = require('./Controllers/OfferCandidate.js');
        offerCandidate(io, socket, data);
    });

    socket.on('ANSWER_CANDIDATE', data => {
        // Xu ly su kien Offer
        //Todo CongVT implement Check role
        console.log('Co answer candidate gui len:' + socket.tokenId);// Log token
        let anserCandidate = require('./Controllers/AnswerCandidate.js');
        anserCandidate(io, socket, data);
    });

});
// Xu ly su kien disconnect







