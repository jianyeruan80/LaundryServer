var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pushsSchema = new Schema({
  title:String,
  content:String,
  picture:String,
  link:String,
  /*from:{type: mongoose.Schema.Types.ObjectId, ref: 'states'},*/
  to:[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
  expires:Date, 
})

pushsSchema.index({ title: 1}, {sparse:true});
module.exports = mongoose.model('pushs', pushsSchema);