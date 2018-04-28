var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
Token = mongoose.model('Token');
CallRecord = mongoose.model('CallRecord');
CallRouting = mongoose.model('CallRouting');
const uid = require('uid');


module.exports = function (io, socket, sdp) {
    try {
        //Lay thong tin Token gui
        // Kiem tra xem la cua ai
        console.log("Bat dau vao ham xu ly OfferSDP" + socket.tokenId);
        var ObjectId = require('mongoose').Types.ObjectId;
        Token.findOne({ _id: socket.tokenId })
            .exec(function (err, vToken) {
                console.log(err);
                if (vToken) {
                    // Da tim duoc Token nguoi gui
                    console.log('Da tim duoc nguoi gui Token:' + vToken._id);
                    if (vToken.userType == 'C') {//Cuoc goi tu camera
                        console.log("Cuoc goi tu Camera");
                        // Token Camera. Thuc hien dinh tuyen den MediaServer
                        // Tim kiem Media Server Avalable
                        Token.findOne({ userType: 'M' }) //M - Media Server
                            .exec(function (err, mToken) {
                                console.log(err);
                                if (mToken) {
                                    console.log("Da tim duoc media Server");
                                    //Tim duoc Media Server
                                    //Tao thong tin record
                                    let callRecord = new CallRecord({

                                        callId: 'CDR_C2M_' + (new Date().toISOString().replace(/T/, ' ').
                                            replace(/\..+/, '')) + "_" + uid(15), //Lay gia tri ngau nhien
                                        callingTokenId: socket.tokenId,
                                        calledTokenId: mToken._id,
                                        callType: 'C2M', // Ky cuoc goi:  Camera to Media Server
                                        callStatus: 'I' // Trang thai cuoc goi: I init - Thiet lap, A - Anser, C - Complete, D - Drop

                                    });
                                    callRecord.save((err) => { //Ghi du lieu vao Database
                                        if (err) {
                                            // ghi du lieu loi
                                            socket.emit('ANSWER_SDP', { 'err': 'M2', 'msg': 'Can not create Call Record' });

                                        } else {
                                            // Thuc hien tao Call Routing
                                            let callRouting = new CallRouting({
                                                callRoutingId: 'CR_C2M_' + (new Date().toISOString().replace(/T/, ' ').
                                                    replace(/\..+/, '')) + "_" +
                                                    uid(15)
                                            });
                                            callRouting.listCallRecord.push(callRecord);
                                            callRouting.save((err) => { //Ghi du lieu vao Database
                                                if (err) {
                                                    // Loi khong tao duoc CallRouting
                                                    socket.emit('ANSWER_SDP', { 'err': 'M3', 'msg': 'Can not create Call Routing' });
                                                } else {
                                                    // Da tao duoc call routing
                                                    // Gui cho Media Server
                                                    console.log("Send offer to Media Server:" + mToken._id);
                                                    io.to(mToken._id).emit('OFFER_SDP', { 'callRecord': callRecord, 'callRouting': callRouting, 'SDP': sdp });
                                                }
                                            });

                                        }
                                    }
                                    );


                                } else {
                                    console.log("Khong tim duoc Media Server");
                                    socket.emit('ANSWER_SDP', { 'err': 'M1', 'msg': 'There are not any Media Server' });
                                }
                            });

                    }
                    //Todo CongVT Thuc hien cai dat cho cac Token cua MediaServer va Recording Server

                } else {
                    //**Tra lai message may bi null roi */
                    console.log("There are some thing wrong");
                    socket.emit('ANSWER_SDP', { 'err': 1, 'msg': 'There are some thing wrong' }); //Tra loi cho nguoi gui biet co loi khong thuc hien duoc
                }

            });

    } catch (e) {
        console.log(e);
    };


};