var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    tools = require('../modules/tools');

var addressSchema = new Schema({
      address1: String,
      address2: String,
      city: String,
      state: String,
      zipcode: String,
      description:String,
      loc: {
      type:{type:String,default:'Point'},
      coordinates: [Number]
      }
  
});
var distanceFeeSchema = new mongoose.Schema({ 
  distance:String,
  fee:Number

})
var storesSchema = new mongoose.Schema({ 
    merchantId:{type:String,lowercase: true, trim: true},
    name:String,
    addressInfo:addressSchema,
    phoneNum1:String,
    phoneNum2:String,
    webSite:String,
    email:String,
    password:String,
    tax:Number,
    about :String,
    createdAt: {type:Date,default:tools.defaultDate},
    updatedAt: Date,
    picture:String,
    fax:String,
    licenseKey:String,
    openTime:String,
    orderTime:String,
    qrcUrl:{type:String,lowercase:true},
    minPrice:Number,
    waitTime:String,
    deliveryFee:String,
    maxDistance:Number,
    DiffTimes:{type:Number,default:0},
    distanceFee:[distanceFeeSchema],
    expires:Date,
    status:{type:String,default:""},
    operator:{ id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },user:String},
    chainStore:String,
});
storesSchema.index({ merchantId: 1,status:1},{unique: true,sparse:true });
//storesSchema.index({ qrcUrl: 1},{unique: true,sparse:true });
//addressSchema.index({location: '2dsphere'});
module.exports = mongoose.model('stores', storesSchema);

/*
db.places.createIndex( { loc : "2dsphere" } )
https://docs.mongodb.com/manual/core/2dsphere/#dsphere-version-2
{ createdAt: { type: Date, expires: 3600, default: tools.defaultDate }}
OrderList.$.UserName","大叔2015-09-21
*/
