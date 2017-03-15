 var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    tools = require('../modules/tools');

var addressSchema = new Schema({
      address: String,
      city: String,
      state: String,
      zipcode: String,
      description:{type:String,defualt:"test"},
      loc: { 
           type:{type:String,default:'Point'},
           coordinates: [{type:Number,default:40.751351},{type:Number,default:-73.8597127}]
      }
});
var distanceFeeSchema = new mongoose.Schema({ 
  distance:Number,
  fee:Number
})
var openSchema = new mongoose.Schema({ 
  start:String,
  end:String,
  day:String,//0-6 
})
var storesSchema = new mongoose.Schema({ 
    merchantId:{type:String,lowercase: true, trim: true},
    name:String,
    contact:String,
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
    pictures:[{type:String}],
    logo:String,
    fax:String,
    licenseKey:String,
    openTime:[openSchema],
    orderTime:String,
    qrcUrl:{type:String,lowercase:true},
    minPrice:Number,
    waitTime:String,
    deliveryFee:[distanceFeeSchema],
    maxDistance:Number,
    DiffTimes:{type:Number,default:0},
    expires:Date,
    status:{type:String,default:""},
    operator:{ id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },user:String},
    chainStore:String,
});
storesSchema.index({status:1,qrcUrl:1},{unique: true,sparse:true });
addressSchema.index({loc: '2dsphere'});
module.exports = mongoose.model('stores', storesSchema);

/*
db.places.createIndex( { loc : "2dsphere" } )
https://docs.mongodb.com/manual/core/2dsphere/#dsphere-version-2
{ createdAt: { type: Date, expires: 3600, default: tools.defaultDate }}
OrderList.$.UserName","大叔2015-09-21
*/
