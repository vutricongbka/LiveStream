var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
Token = mongoose.model('Token');
CallRecord = mongoose.model('CallRecord');
CallRouting = mongoose.model('CallRouting');
const uid = require('uid');


module.exports = function (io, socket, data) {
    try {
        //Lay thong tin Token gui
        // Kiem tra xem la cua ai
        console.log("Bat dau vao ham xu ly OfferSDP" + socket.tokenId);
        CallRecord.findOne({ callId: data.callId })
            .exec(function (err, vCallRecord) {
                if (vCallRecord) {
                    // Tim duoc Call record
                    // Thuc hien gui ban tin cho Called
                    console.log("Gui SDP Cho Media Server");
                    io.to(vCallRecord.calledSocketId).emit('OFFER_SDP', data);
                } else {
                    // Khong tim duoc Call record
                    socket.emit('OFFER_SDP', { 'err': 'C1', 'msg': 'Khong tim duoc CallRecord', 'callId': data.callId });
                }


            });


    } catch (e) {
        console.log(e);
    };


};