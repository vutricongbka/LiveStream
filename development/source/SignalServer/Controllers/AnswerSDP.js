var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
Token = mongoose.model('Token');
CallRecord = mongoose.model('CallRecord');
CallRouting = mongoose.model('CallRouting');
module.exports = function (io, socket, data) {
    try {
        //Lay thong tin calling de tra ve
        //Todo CongVT cap nhat bang du lieu ve Calling Record de 
        console.log("Tra SDP ve Camera" + socket.tokenId);
        CallRecord.findOne({ callId: data.callId })
            .exec(function (err, vCallRecord) {
                if (vCallRecord) {
                    // Tim duoc Call record
                    // Thuc hien gui ban tin cho Called
                    console.log("Gui SDP Cho Media Server");
                    io.to(vCallRecord.callingSocketId).emit('ANSWER_SDP', data);
                } else {
                    // Khong tim duoc Call record
                    console.log("Khong tim duoc thong tin cuoc goi");
                    socket.emit('ANSWER_SDP', { 'err': 'C1', 'msg': 'Khong tim duoc CallRecord', 'callId': data.callId });
                }


            });

    } catch (e) {
        console.log("co loi khi tra SDP ve Camera:" + e);
    }


};