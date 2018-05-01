'use strict';

/**
 * Khoi tao cac bien DOM
 * 
 */

var vid1 = document.getElementById('vid1');
var vid2 = document.getElementById('vid2');
var callButton = document.getElementById('callButton');
var hangUpButton = document.getElementById('hangUpButton');
callButton.addEventListener('click', start);
hangUpButton.addEventListener('click', stop);

callButton.disabled = true;
hangUpButton.disabled = true;

/**
 * 
 * Khoi tao cac bien connection
 * 
 */

var pc1 = null;
var pc2 = null;
var localstream;
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
socket.emit('REGISTER', { 'name': 'Camera', 'pass': '123' });
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

/**
 * Get media from webcam and mic
 * @param {*} stream 
 */
function gotStream(stream) {
    trace('Received local stream');
    vid1.srcObject = stream;
    localstream = stream;
    callButton.disabled = false;
    trace("Got stream OK");
}

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
})
    .then(gotStream)
    .catch(function (e) {
        alert('getUserMedia() error: ' + e);
    });

var callId = 'C2M_' + (new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')) + "_" + Math.random().toString(36).substring(7);
socket.emit('CREATE_CALL', { 'callId': callId });

socket.on('CREATE_CALL', data => {
    if (data.err == 0) {
        trace("Tao ma duoc goi thanh cong. Da co MediaServer");
    } else {
        trace("Loi khong co MediaServer:" + data);
    };

});

function start() {
    callButton.disabled = true;
    hangUpButton.disabled = false;
    trace('Starting Call');

    var videoTracks = localstream.getVideoTracks();
    var audioTracks = localstream.getAudioTracks();

    if (videoTracks.length > 0) {
        trace('Using Video device: ' + videoTracks[0].label);
    }
    if (audioTracks.length > 0) {
        trace('Using Audio device: ' + audioTracks[0].label);
    }

    /**
     * Tao doi tuong media
     * 
     */

    var servers = null;
    pc1 = new RTCPeerConnection(servers);
    trace('Created local peer connection object pc1');


    pc1.onicecandidate = function (e) {
        trace("Da lay duoc candidate:" + e.candidate);
        //onIceCandidate(pc1, e);
        // CongVT send to MediaServer
        //socket.emit();
        socket.emit('OFFER_CANDIDATE', { 'callId': callId, 'candidate': e.candidate });
    };

    /*
        pc2 = new RTCPeerConnection(servers);
        trace('Created remote peer connection object pc2');
        pc2.onicecandidate = function (e) {
            onIceCandidate(pc2, e);
        };
        */
    /*
        pc2.ontrack = gotRemoteStream;
        localstream.getTracks().forEach(
            function (track) {
                pc1.addTrack(
                    track,
                    localstream
                );
            }
        );
        */
    trace('Adding Local Stream to peer connection');
    pc1.createOffer(
        offerOptions
    ).then(
        gotDescription1,
        onCreateSessionDescriptionError
    );
}
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

function gotDescription1(desc) {
    pc1.setLocalDescription(desc).then(
        onSetLocalDescriptionSuccess,
        onSetLocalDescriptionError
    );
    trace('Offer from Camera \n' + desc.sdp);
    //Todo CongVT Send OFER SDP to MediaServer
    socket.emit('OFFER_SDP', { 'callId': callId, 'sdp': desc });

    trace("Da gui SDP cho Media Server");
    //pc2.setRemoteDescription(desc);
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    /*
      pc2.createAnswer().then(
          gotDescription2,
          onCreateSessionDescriptionError
      ); */
}

/**
 * 
 * Got ANSWER SDP
 * 
 */
/*

function gotDescription2(desc) {
    // Provisional answer, set a=inactive & set sdp type to pranswer.
    desc.sdp = desc.sdp.replace(/a=recvonly/g, 'a=inactive');
    desc.type = 'pranswer';
    pc2.setLocalDescription(desc).then(
        onSetLocalDescriptionSuccess,
        onSetLocalDescriptionError
    );
    trace('Pranswer from pc2 \n' + desc.sdp);
    pc1.setRemoteDescription(desc);
}
 */
/*
function gotDescription3(desc) {
    // Final answer, setting a=recvonly & sdp type to answer.
    desc.sdp = desc.sdp.replace(/a=inactive/g, 'a=recvonly');
    desc.type = 'answer';
    pc2.setLocalDescription(desc).then(
        onSetLocalDescriptionSuccess,
        onSetLocalDescriptionError
    );
    trace('Answer from pc2 \n' + desc.sdp);
    pc1.setRemoteDescription(desc);
}

*/

/**
 * Got SDP from MediaServer
 * 
 * 
 */

socket.on('ANSWER_SDP', (data) => {
    trace("Nhan duoc answer sdp tu MediaServer:" + data.sdp.sdp);
    pc1.setRemoteDescription(data.sdp);

});

/*
function accept() {
    pc2.createAnswer().then(
        gotDescription3,
        onCreateAnswerError
    );

    callButton.disabled = true;
}

*/



function stop() {
    trace('Ending Call' + '\n\n');
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;

    callButton.disabled = false;
    hangUpButton.disabled = true;
}

/*
function gotRemoteStream(e) {
    if (vid2.srcObject !== e.streams[0]) {
        vid2.srcObject = e.streams[0];
        trace('Received remote stream');
    }
}

*/
/*

function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
}

function getName(pc) {
    return (pc === pc1) ? 'pc1' : 'pc2';
}
*/

/*
function onIceCandidate(pc, event) {
    getOtherPc(pc).addIceCandidate(event.candidate)
        .then(
            function () {
                onAddIceCandidateSuccess(pc);
            },
            function (err) {
                onAddIceCandidateError(pc, err);
            }
        );
    trace(getName(pc) + ' ICE candidate: \n' + (event.candidate ?
        event.candidate.candidate : '(null)'));
}
*/
/*
function onAddIceCandidateSuccess() {
    trace('AddIceCandidate success.');
} */

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
socket.on('ANSWER_CANDIDATE', (data) => {
    trace("Nhan duoc candidate tu MediaServer:" + data.candidate);
    pc1.addIceCandidate(data.candidate).then(function () { trace("Add MediaServer Candidate thanh cong"); }, function (e) { trace("Add MediaServer Candidate that bai:" + e); });
});