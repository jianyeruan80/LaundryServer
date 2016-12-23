var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pushTransactionsSchema = new Schema({
  push:{type: mongoose.Schema.Types.ObjectId, ref: 'pushs'},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  createdAt: {type:Date,default:Date.now}
})

module.exports = mongoose.model('pushTransactions', pushTransactionsSchema);