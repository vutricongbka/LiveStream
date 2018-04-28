var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
Token = mongoose.model('Token');

module.exports = function (socket) {
    try {
        // Lay token id
        let vTokenId = socket.tokenId;
        //Xac dinh loai token de xoa trong cac bang Media va cac bang khac
        //Thuc hien xoa trong bang Token
        if (vTokenId) {
            Token.remove({ _id: vTokenId }, function (err) {
                if (err) {
                    // Loi khi xoa tocken
                    console.log("Xoa token that bai tokenId:" + vTokenId);
                } else {
                    // Xoa thanh cong
                    console.log("Xoa token thanh cong tokenId:" + vTokenId);
                };

            });


        } else {
            console.log("There are no token id when socket disconnected");

        };



    } catch (e) {
        console.log(e);
    };
};
