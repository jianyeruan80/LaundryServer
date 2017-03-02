var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var unitsSchema = new mongoose.Schema({
    merchantId: String,
    name:String,
    description:String
});
unitsSchema.index({merchantId: 1,name:1}, { unique: true,sparse:true});
module.exports = mongoose.model('units', unitsSchema);

/****
Dozen
Piece
Small
Medium
Large
Gls
Btl
Restaurant
****/