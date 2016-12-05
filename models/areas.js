var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var areasSchema = new Schema({
  merchantId:String,
  name:String,
  order:{type:Number,defalut:10},
  operator:
  {
	 id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	 user:String
 },
 createdAt: {type:Date,default:Date.now},
 updatedAt: Date,
  
})

areasSchema.index({ name: 1,merchantId:1}, { unique: true,sparse:true});
module.exports = mongoose.model('areas', areasSchema);


