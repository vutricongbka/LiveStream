const playVideo = require('./playVideo');
/**
 * Ham thuc hien mo Media
 * 
 * 
 */

function openStream(cb) {
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
            cb(stream);
        })
        .catch(err => console.log(err));
}

module.exports = openStream;