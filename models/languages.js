var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var languagesSchema = new Schema({
  id:Number,
  name:String,
  language:String,
  active:true,
  status:true,
  merchantId:String
 })
languagesSchema.index({ name: 1,merchantId:1}, { unique: true,sparse:true});
module.exports = mongoose.model('languages', languagesSchema);

/*
0,english,language,true,true.xxxx
1,中文,语言,true,false.xxxx