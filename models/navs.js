var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var navsSchema = new Schema({
  name:String,
  order:Number,
  merchantId:String,
  link:String,
  click:String,
  model:String,
  children:[{type: mongoose.Schema.Types.ObjectId, ref: 'navs'}],
  parent:{type: mongoose.Schema.Types.ObjectId, ref: 'navs',null: true},
  gallerys:[{title:String,picture:String}]
})

navsSchema.index({ name: 1,merchantId:1,parent:1}, { unique: true,sparse:true});
module.exports = mongoose.model('navs', navsSchema);