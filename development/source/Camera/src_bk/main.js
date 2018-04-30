// Khai bao cau hinh
//var signalingChannel = new SignalingChannel();
var configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
var remoteView = document.getElementById("remoteView"); //document.querySelector('video#remoteView');
var selfView =  document.getElementById("selfView");  //document.querySelector('video#selfView');
var btnStart =  document.getElementById("btnStart");  // document.querySelector('button#btnStart');
var pc;
btnStart.onclick = start;
// Kho tao SocketIO va dang nhap he thong




// call start() to initiate
function start() {
    console.log("Start");
    pc = new RTCPeerConnection(configuration);
    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        // Nhan duoc Candidate from STUN Server
        console.log("Nhan duoc Candidate from STUN Server:" + JSON.stringify({ candidate: evt.candidate }));
        //signalingChannel.send(JSON.stringify({ candidate: evt.candidate }));
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
            })
            .catch(logError);
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
        .catch(logError);
    // Khi tin hieu den
    /* 
    signalingChannel.onmessage = function (evt) {
            if (!pc)
                start(false);
    
            var message = JSON.parse(evt.data);
            if (message.desc) {
                var desc = message.desc;
    
                // if we get an offer, we need to reply with an answer
                if (desc.type == "offer") {
                    pc.setRemoteDescription(desc).then(function () {
                        return pc.createAnswer();
                    })
                        .then(function (answer) {
                            return pc.setLocalDescription(answer);
                        })
                        .then(function () {
                            var str = JSON.stringify({ desc: pc.localDescription });
                            signalingChannel.send(str);
                        })
                        .catch(logError);
                } else
                    pc.setRemoteDescription(desc).catch(logError);
            } else
                pc.addIceCandidate(message.candidate).catch(logError);
        };
        */

    function setupChat() {
        channel.onopen = function () {
            // e.g. enable send button
            enableChat(channel);
        };

        channel.onmessage = function (evt) {
            showChatMessage(evt.data);
        };
    }

    function sendChatMessage(msg) {
        channel.send(msg);
    }

    function logError(error) {
        log(error.name + ": " + error.message);
    }


}

