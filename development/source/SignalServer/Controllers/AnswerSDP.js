var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
Token = mongoose.model('Token');
CallRecord = mongoose.model('CallRecord');
CallRouting = mongoose.model('CallRouting');
module.exports = function (io, socket, data) {
    try {
        //Lay thong tin calling de tra ve
        //Todo CongVT cap nhat bang du lieu ve Calling Record de 
        console.log("Tra SDP ve Camera");
        io.to(data.socketId).emit('ANSWER_SDP', data);
    } catch (e) {
        console.log("co loi khi tra SDP ve Camera:" + e);
    }


};