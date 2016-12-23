var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var lauguagesSchema = new Schema({
    "second":String,
    "third":String
})
var addressSchema = new Schema({
      address: String,
      city: String,
      state: String,
      zipcode: String,
      description:String,
      storeName:String,
      phoneNum:String
});
var bossReportsSchema = new mongoose.Schema({ 
    account:String,
    firstName:String,
  	lastName:String,
	  birthDay:Date,
	  addressInfo:[addressSchema],
    phoneNum1:String,
    phoneNum2:String,
	  email:{type:String,lowercase:true},
    password:String,
    token:String,
	  facebook:String,
  	wechat:String,
	  twitter:String,
	  password:String,
    fax:String,
  	createdAt: {type:Date,default:Date.now},
    updatedAt: Date,
    description:String,
    status:{ type: Boolean, default: true },
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    user:String
    },
   language:{
         description:lauguagesSchema
    },
});
bossReportsSchema.index({ email: 1}, { unique: true,sparse:true });
module.exports = mongoose.model('bossReports', bossReportsSchema);

