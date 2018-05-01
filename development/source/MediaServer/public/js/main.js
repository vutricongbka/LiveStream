'use strict';

/**
 * Khoi tao cac bien DOM
 * 
 */

var vid2 = document.getElementById('vid2');
var callButton = document.getElementById('callButton');
var hangUpButton = document.getElementById('hangUpButton');
hangUpButton.addEventListener('click', stop);

callButton.disabled = true;
hangUpButton.disabled = true;

/**
 * 
 * Khoi tao cac bien connection
 * 
 */
var servers = null;
var pc2 = null;
var offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
};

/**
 * Khoi tao va dang nhap signalServer
 * 
 * 
 */
//const io = require('socket.io-client');
const socket = io.connect('http://localhost:3001');
//Dang nhap he thong
socket.emit('REGISTER', { 'name': 'MediaServer', 'pass': '123' });
socket.on('REGISTER', data => {
    if (data) {
        if (data.err == 0) {
            //Khong co loi xay ra
            trace("Register thanh cong token:" + data.token);
        }
    } else {
        trace(data);
    }
});

socket.on("OFFER_SDP", (data) => {
    // Nhan duoc OFFER tu Camera
    trace("Nhan duoc Offer tu Camera:" + data.sdp.sdp);
    pc2 = new RTCPeerConnection(servers);
    trace('Created remote peer connection object pc2');
    pc2.onicecandidate = function (e) {
        onIceCandidate(pc2, e, data.callId);
    };
    pc2.ontrack = gotRemoteStream;
    trace("MediaServer set Remote SDP")
    pc2.setRemoteDescription(data.sdp);
    pc2.createAnswer().then(
        function (desc) {
            desc.sdp = desc.sdp.replace(/a=inactive/g, 'a=recvonly');
            desc.type = 'answer';
            pc2.setLocalDescription(desc).then(
                onSetLocalDescriptionSuccess,
                onSetLocalDescriptionError
            );
            trace('Answer from MediaServer \n' + desc.sdp);

            socket.emit("ANSWER_SDP", { "callId": data.callId, "sdp": desc });


        },
        onCreateSessionDescriptionError
    );
    pc2.ontrack = gotRemoteStream;
});

/**
 * Tao doi tuong media
 * 
 */


function onCreateSessionDescriptionError(error) {
    trace('Failed to create session description: ' + error.toString());
    stop();
}
function onCreateAnswerError(error) {
    trace('Failed to set createAnswer: ' + error.toString());
    stop();
}
function onSetLocalDescriptionError(error) {
    trace('Failed to set setLocalDescription: ' + error.toString());
    stop();
}

function onSetLocalDescriptionSuccess() {
    trace('localDescription success.');
}



function stop() {
    trace('Ending Call' + '\n\n');
    pc2.close();
    pc2 = null;

    callButton.disabled = false;
    hangUpButton.disabled = true;
}

function gotRemoteStream(e) {
    if (vid2.srcObject !== e.streams[0]) {
        vid2.srcObject = e.streams[0];
        trace('Received remote stream');
    }
}

function onIceCandidate(pc, event, callId) {
    //Send Candidate to Camera
    socket.emit("ANSWER_CANDIDATE", { "callId": callId, "candidate": event.candidate });
    trace("Send MediaServer candidate to Camera:" + event.candidate);

}

function onAddIceCandidateError(error) {
    trace('Failed to add Ice Candidate: ' + error.toString());
}
/***
 * 
 * 
 * Nhan duoc Candidate
 * 
 */

// Khi tin hieu den
socket.on('OFFER_CANDIDATE', (data) => {
    trace("Nhan duoc candidate tu Camera:" + data.candidate);
    pc2.addIceCandidate(data.candidate).then(function () { trace("Add Camera Candidate thanh cong"); }, function (e) { trace("Add Camera Candidate that bai:" + e); });
});