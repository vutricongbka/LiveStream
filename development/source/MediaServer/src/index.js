
const uid = require('uid');
const $ = require('jquery');
const Peer = require('simple-peer');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');
var token;
socket.emit('REGISTER', { 'name': 'MediaServer', 'pass': '123' });
socket.on('REGISTER', data => {
    console.log("Ket noi thanh cong");
    /*
    if (data) {
        if (data.err == 0) {
            //Khong co loi xay ra
            token = data.token;

            openStream(function (stream) {
                console.log("Vao ham OpenStream");
                playVideo(stream, 'localStream');
                console.log("Play Stream thanh cong");
                const p = new Peer({ initiator: true, trickle: false, stream }); 
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
*/

});
//const Peer = require('peerjs');

socket.on('OFFER_SDP', data => {
    console.log("Da nhan duoc offer");
    console.log(data);

});

