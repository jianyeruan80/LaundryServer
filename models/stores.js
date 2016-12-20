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
      language:{
         description:lauguagesSchema
    },
   location: {
    type:{type:String,default:'Point'},
    coordinates: [Number],
    
  }
  
});
var distanceFeeSchema = new Schema({ 
  distance:String,
  fee:Number
})
var picturesSchema=new Schema({ 
  picture:String,
  title:String,
  active:{type:Boolean,default:true}
})
var videosSchema=new Schema({ 
  video:String,
  title:String,
  active:{type:Boolean,default:true}
})
var storesSchema = new Schema({ 
    merchantId:{type:String,lowercase: true, trim: true},
    logo:String,
    name:String,
    tax:Number,//
    phoneNum1:String,
    phoneNum2:String,
    fax:String,
    email:String,
    webSite:String,
    addressInfo:addressSchema,
    
    about :String,
    createdAt: {type:Date,default:Date.now},
    updatedAt: Date,
    gallerys:[picturesSchema],
    videos:[videosSchema],
    mode:String,//"A".B
    openTime:String,
    orderTime:String,
    qrcUrl:{type:String,lowercase:true},
    minPrice:Number,
    waitTime:String,
    deliveryFee:String,
    maxDistance:Number,
    DiffTimes:{type:Number,default:0},
    distanceFee:[distanceFeeSchema],
    
    licenseKey:String,
    expires:Date,
    language:{
         name:lauguagesSchema,
         description:lauguagesSchema
    },
    operator:{id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },user:String},
});
storesSchema.index({ merchantId: 1},{unique: true,sparse:true });
//storesSchema.index({ merchantId: 1,qrcUrl: 1},{unique: true,sparse:true });
//addressSchema.index({location: '2dsphere'});
module.exports = mongoose.model('stores', storesSchema);

/*{ createdAt: { type: Date, expires: 3600, default: Date.now }}
OrderList.$.UserName","大叔2015-09-21
*/