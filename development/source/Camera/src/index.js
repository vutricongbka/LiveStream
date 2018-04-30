
const uid = require('uid');
const $ = require('jquery');
const Peer = require('simple-peer');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
//Ket noi signalServer
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');
//const socket = io.connect('http://144.202.51.123:3001');

// Bat dau cau hinh cho pear
var configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
var remoteView = document.getElementById("remoteView"); //document.querySelector('video#remoteView');
var selfView = document.getElementById("selfView");  //document.querySelector('video#selfView');
var btnStart = document.getElementById("btnStart");  // document.querySelector('button#btnStart');
var pc;

btnStart.onclick = start;

/**
 * 
 * Dang nhap he thong
 */
socket.emit('REGISTER', { 'name': 'Camera', 'pass': '123' });


socket.on('REGISTER', data => {
    if (data) {
        if (data.err == 0) {
            //Khong co loi xay ra
            token = data.token;
        }

    } else {
        console.log(data);

    }

});
var callId = 'C2M_' + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "_" + uid(15)
function start() {
    // Tao cuoc goi
    socket.emit('CREATE_CALL', { 'callId': callId });
}

//Socket tra lai ma cuoc goi
socket.on('CREATE_CALL', data => {

    // Ham bat dau cuoc goi
    if (data) {
        if (data.callRoutingId) {
            console.log("Da lay duoc cuoc goi co Call routing:" + data.callRoutingId);
            pc = new RTCPeerConnection(configuration);
            // send any ice candidates to the other peer


            pc.onicecandidate = function (evt) {
                // Nhan duoc Candidate from STUN Server
                console.log("Nhan duoc Candidate from STUN Server:" + JSON.stringify({ candidate: evt.candidate }));
                // Gui Candidate
                socket.emit('OFFER_CANDIDATE', { 'callId': callId, 'candidate': evt.candidate });
            };

            // let the "negotiationneeded" event trigger offer generation
            pc.onnegotiationneeded = function () {
                pc.createOffer().then(function (offer) {
                    // Tao duoc Offer
                    console.log("Da tao duoc Offer:" + offer);
                    return pc.setLocalDescription(offer);
                })
                    .then(function () {
                        // send the offer to the other peer
                        console.log("Gui Offer cho kenh:" + JSON.stringify({ desc: pc.localDescription }));
                        //signalingChannel.send(JSON.stringify({ desc: pc.localDescription }));
                        socket.emit('OFFER_SDP', { 'callId': callId, 'sdp': pc.localDescription });
                    })

            };
            // once remote track arrives, show it in the remote video element
            pc.ontrack = function (evt) {
                // don't set srcObject again if it is already set.
                console.log("Khi media den");
                if (!remoteView.srcObject)
                    remoteView.srcObject = evt.streams[0];
            };
            // get a local stream, show it in a self-view and add it to be sent
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(function (stream) {
                    console.log("Da get duoc Stream");
                    selfView.srcObject = stream;
                    pc.addTrack(stream.getAudioTracks()[0], stream);
                    pc.addTrack(stream.getVideoTracks()[0], stream);
                })

            // Khi tin hieu den


        } else {
            console.log("Khong tao duoc call record");
        }
        // Thuc hien tao doi tuong ket noi. Mo video ...
    } else {
        console.log("Loi khi lay CallId");
    }
});
// Setup cac ham

