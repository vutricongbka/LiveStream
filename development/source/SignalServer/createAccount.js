
var mongoose = require('mongoose');
require('./DataModels/SignalModel.js');
//Setup DataModel

User = mongoose.model('User');
//Connect Database
var conn = mongoose.connect('mongodb://localhost/SignalServer');

var user = new User({
    name: 'Camera',
    pass: '123',
    type: 'C', // Co cac loai nguoi dung: He thong(Camera, MediaServer, Recording Server, Store Server, Log Service ) va nguoi dung thong thuong.
    sta: 1
}
);

user.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tao thanh cong Account:' + user.name);
    }
});

var user1 = new User({
    name: 'MediaServer',
    pass: '123',
    type: 'M', // Co cac loai nguoi dung: He thong(Camera, MediaServer, Recording Server, Store Server, Log Service ) va nguoi dung thong thuong.
    sta: 1
}
);

user1.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tao thanh cong Account:' + user1.name);
    }
});

var user2 = new User({
    name: 'RecordingServer',
    pass: '123',
    type: 'R', // Co cac loai nguoi dung: He thong(Camera, MediaServer, Recording Server, Store Server, Log Service ) va nguoi dung thong thuong.
    sta: 1
}
);

user2.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tao thanh cong Account:' + user2.name);
    }
});


var user3 = new User({
    name: 'StoreServer',
    pass: '123',
    type: 'S', // Co cac loai nguoi dung: He thong(Camera, MediaServer, Recording Server, Store Server, Log Service ) va nguoi dung thong thuong.
    sta: 1
}
);

user3.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tao thanh cong Account:' + user3.name);
    }
});



var user4 = new User({
    name: 'LogService',
    pass: '123',
    type: 'L', // Co cac loai nguoi dung: He thong(Camera, MediaServer, Recording Server, Store Server, Log Service ) va nguoi dung thong thuong.
    sta: 1
}
);

user4.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tao thanh cong Account:' + user4.name);
    }
});


var user5 = new User({
    name: 'Subscriber',
    pass: '123',
    type: 'SU', // Co cac loai nguoi dung: He thong(Camera, MediaServer, Recording Server, Store Server, Log Service ) va nguoi dung thong thuong.
    sta: 1
}
);

user5.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Tao thanh cong Account:' + user5.name);
    }
});