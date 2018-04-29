
const uid = require('uid');
const $ = require('jquery');
const Peer = require('simple-peer');
const openStream = require('./openStream');
const playVideo = require('./playVideo');
// Tam thoi chua dung NodeJS
const io = require('socket.io-client');
//const socket = io.connect('http://localhost:3001');
const socket = io.connect('http://144.202.51.123:3001');

socket.emit('REGISTER', { 'name': 'Camera', 'pass': '123' });

/*

{
      initiator: true,
      stream: this.videoStream,
      reconnectTimer: 100,
      trickle: false,
      config: {
        iceServers: [
          {
            "urls": "stun:stun.l.google.com:19302"
                     }
        ]
      }
    }


*/



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


//const Peer = require('peerjs');
document.getElementById("btnCall").onclick = function btnClick() {
    ///////////////
    openStream(function (stream) {
        console.log("Vao ham OpenStream");
        playVideo(stream, 'localStream');
        console.log("Play Stream thanh cong");
        p = new Peer({ initiator: true, trickle: false, stream }); /*Khoi tao luong*/
      /*
        const p = new Peer({
            initiator: true,
            stream: this.videoStream,
            reconnectTimer: 100,
            trickle: false,
            config: {
                iceServers: [
                    {
                        "urls": "stun:stun.l.google.com:19302"
                    }
                ]
            }
        }); */
        console.log("Khoi tao xong luong Peer");
        p.on('signal', sdp => {
            // Gui Tocken cho Sinal Server
            console.log("bat dau gui SDP")
            socket.emit('OFFER_SDP', sdp);
            console.log('Da gui SDP');
        });
        socket.on('ANSWER_SDP', data => {
            console.log("Da nhan duoc SDP");
            p.signal(data.sdp);
            console.log("Hoan thien ket noi");

        });

    });

};

