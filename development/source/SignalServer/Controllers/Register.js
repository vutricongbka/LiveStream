//Server side
var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
User = mongoose.model('User');
Token = mongoose.model('Token');
/**
 * Write by CongVT
 * Date 2018/04/28
 * Ham thuc hien dang ky vao Signal Server
 * @param {*} socket 
 * @param {*} data 
 */
module.exports = function (socket, data) {
    try {
        console.log(data);
        let user = data;
        if (data) {
            //Query Database
            User.findOne({ name: user.name })
                .exec(function (err, vUser) {
                    if (!vUser) {
                        // Account chua ton tai
                        socket.emit('REGISTER', { 'err': 2, 'msg': 'Sai mat khau hoac account khong ton tai' });
                    } else {
                        // Da co account
                        if (vUser.pass != user.pass || user.sta == 0) {
                            socket.emit('REGISTER', { 'err': 2, 'msg': 'Sai mat khau hoac account khong ton tai' });
                        } else {
                            //OK
                            //Kiem tra bang tocken xem da co chua
                            Token.findOne({ userId: vUser._id })
                                .exec(function (err, vToken) {
                                    if (vToken) {//Da tim thay thi tra lai ma token
                                        socket.tokenId = vToken._id;
                                        socket.emit('REGISTER', { 'err': 0, 'msg': 'Dang nhap thanh cong', 'token': vToken._id });
                                    } else {
                                        // Tao moi token
                                        // Tra lai ma token
                                        var tocken = new Token({
                                            user: vUser,
                                            userId: vUser._id,
                                            userType:vUser.type,
                                            sta: 1,
                                            socketId: socket.id
                                        }
                                        );

                                        tocken.save(function (err) {
                                            if (err) {
                                                console.log(err);
                                                socket.emit('REGISTER', { 'err': 3, 'msg': 'Can not create token' });
                                            } else {
                                                //Tim lai ban ghi de update
                                                Token.findOne({ userId: vUser._id })
                                                    .exec(function (err, newToken) {
                                                        if (newToken) {
                                                            socket.tokenId = newToken._id;
                                                            socket.emit('REGISTER', { 'err': 0, 'msg': 'Dang nhap thanh cong', 'token': newToken._id });
                                                        } else {
                                                            //**Tra lai message may bi null roi */
                                                            socket.emit('REGISTER', { 'err': 1, 'msg': 'There are no information' });
                                                        }

                                                    });

                                            }
                                        });

                                    }

                                });



                        }
                    }
                });

        } else {
            //**Tra lai message may bi null roi */
            socket.emit('REGISTER', { 'err': 1, 'msg': 'There are no information' });
        }

    } catch (e) {
        console.log(e);
    }
    //data la account, pass va cac tham so khac
}