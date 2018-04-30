/**
 * Ham xu ly huy cuoc goi.
 */
var mongoose = require('mongoose');
require('../DataModels/SignalModel.js');
Token = mongoose.model('Token');
CallRecord = mongoose.model('CallRecord');
CallRouting = mongoose.model('CallRouting');
const uid = require('uid');


module.exports = function (io, socket, data) {
    try {

     } catch (e) {
         console.log("There are some thing wrong when create a call:"+ e);

    }
};