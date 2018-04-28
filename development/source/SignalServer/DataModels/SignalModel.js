/**
 * Khai bao cac kieu du lieu cho SingnalServer
 * 
 * Create by: CongVT
 * Date: 28/4/2018
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// User
/**
 * 
 */
var User = new Schema({
    name: String,
    pass: String,
    type: String, // Co cac loai nguoi dung: He thong(Camera, MediaServer, Recording Server, Store Server, Log Service ) va nguoi dung thong thuong.
    createDate: { type: Date, default: Date.now },
    sta:  Number
}, { _id: true });
mongoose.model('User', User);

// Quan ly Tocken online
/**
 * 
 */
var Token = new Schema({
    user: User,
    user_id: Schema.Types.ObjectId,
    loginTime: { type: Date, default: Date.now },
    sta: Number, // Trang thai hoat dong hay khong hoat dong
    socket_id: Object,
    refreshTime: Date
    // Bien socket them sau.
}, { _id: true });
mongoose.model('Token', Token);
// Quan ly Media Server Online
/**
 * 
 */
var MediaServer = new Schema({
    token: Token,
    // Bo sung them socket ID khi chay
    numberOfCall: { type: Number, default: 0 }, // So luong cuoc goi dang dien ra
    sta: Number
}, { _id: true });
mongoose.model('MediaServer', MediaServer);
/**
 * 
 */
var RecordingServer = new Schema({
    token: Token,
    // Bo sung them socket ID khi chay
    numberOfCall: { type: Number, default: 0 }, // So luong cuoc goi dang dien ra
    sta: Number
}, { _id: true });

