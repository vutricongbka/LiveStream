
const uid = require('uid');
const $ = require('jquery');
const Peer = require('simple-peer');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
// Tam thoi chua dung NodeJS
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');
var token;
socket.emit('REGISTER', { 'name': 'Camera', 'pass': '123' });
socket.on('REGISTER', data => {
    if (data) {
        if (data.err == 0) {
            //Khong co loi xay ra
            token = data.token;

            openStream(function (stream) {
                console.log("Vao ham OpenStream");
                playVideo(stream, 'localStream');
                console.log("Play Stream thanh cong");
                const p = new Peer({ initiator: true, trickle: false, stream }); /*Khoi tao luong*/
                console.log("Khoi tao xong luong Peer");
                p.on('signal', sdp => {
                    // Gui Tocken cho Sinal Server
                    console.log("bat dau gui SDP")
                    socket.emit('OFFER_SDP', sdp);
                    console.log('Da gui SDP');
                });

            });



        }

    } else {
        console.log(data);

    }


});
socket.on('ANSWER_SDP', data => {
    console.log(data);
});

//const Peer = require('peerjs');



