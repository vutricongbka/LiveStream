
const uid = require('uid');
const $ = require('jquery');
const Peer = require('simple-peer');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
const io = require('socket.io-client');
//const socket = io.connect('http://localhost:3001');
const socket = io.connect('http://144.202.51.123:3001');

var token;
// Lop MediaServer
class MediaConnection {
    constructor(callRecordId, callRoutingId, peer) {
        this.callRecordId = callRecordId;
        this.callRoutingId = callRoutingId;
        this.peer = peer;
    }
};

var listMediaConnect = new Array();


socket.emit('REGISTER', { 'name': 'MediaServer', 'pass': '123' });
socket.on('REGISTER', data => {
    console.log("Ket noi thanh cong");


});
//const Peer = require('peerjs');



peer = new Peer({
    config: {
        iceServers: [
            {
                "urls": "stun:stun.l.google.com:19302"
            }
        ]
    }
});

socket.on('OFFER_SDP', data => {
    console.log("Da nhan duoc offer");
    console.log(data);
    // Tao moi connection
    let peer = new Peer();
    console.log("Da tao xong Peer");
    let mediaConnection = new MediaConnection(data.callRecordId, data.callRoutingId, peer);
    listMediaConnect.push(mediaConnection);
    console.log("Tao sdp de tra loi");
    peer.signal(data.sdp);

    peer.on('signal', sdp => {
        console.log("Co SDP");
        //Send Answer
        socket.emit('ANSWER_SDP', { 'callRecordId': data.callRecordId, 'callRoutingId': data.callRoutingId, 'socketId': data.socketId, 'sdp': sdp });
        console.log("gui tra SDP");
    });
    peer.on('stream', function (stream) {

        playVideo(stream, "remoteVideo");


    });
});

