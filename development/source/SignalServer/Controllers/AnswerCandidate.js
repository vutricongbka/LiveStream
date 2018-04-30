var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
Token = mongoose.model('Token');
CallRecord = mongoose.model('CallRecord');
CallRouting = mongoose.model('CallRouting');
const uid = require('uid');

module.exports = function (io, socket, data) {
    try {
        // Ham xu ly Offer Candidate from Camera
        //Todo CongVT can add them ham xac thuc truoc khi thuc thi
        // Tim CallRecord de xac dinh dinh tuyen
        CallRecord.findOne({ callId: data.callId })
            .exec(function (err, vCallRecord) {
                if (vCallRecord) {
                    // Tim duoc Call record
                    // Thuc hien gui ban tin cho Called
                    console.log("Gui Candidate to called");
                    io.to(vCallRecord.callingSocketId).emit('ANSWER_CANDIDATE', data);

                } else {
                    // Khong tim duoc Call record
                    socket.emit('ANSWER_CANDIDATE', { 'err': 'C1', 'msg': 'Khong tim duoc CallRecord', 'callId': data.callId });
                }
            });
    } catch (e) {
        console.log('Co loi xay ra khi xu ly ham OfferCandidate:' + e);
    }
};