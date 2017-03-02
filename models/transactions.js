var mongoose = require('mongoose');


var transactionsSchema = new mongoose.Schema({
    merchantId: String,
    name:String,
    description:String
});
transactionsSchema.index({merchantId: 1,name:1}, { unique: true,sparse:true});
module.exports = mongoose.model('transactions', transactionsSchema);

