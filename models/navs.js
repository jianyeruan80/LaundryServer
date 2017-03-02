var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var childrenSchema = new Schema({
    name:String,
    order:Number,
    url:String,
    click:String
    children:[childrenSchema]
 })
var navsSchema = new Schema({
  name:String,
  merchantId:String,
  order:Number,
  children:[childrenSchema],
  url:String,
  click:String,
  
})
navsSchema.index({ name: 1,merchantId:1}, { unique: true,sparse:true});
module.exports = mongoose.model('navs', navsSchema);