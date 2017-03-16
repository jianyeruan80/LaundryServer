var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    tools = require('../modules/tools');

var optionsSchema = new mongoose.Schema({ 
    name:String,
    description:String,
    price:Number,
    picture:String,
    order:{type:Number,default:1},
    //compositions:[{inventoryItem:{type: mongoose.Schema.Types.ObjectId, ref: 'inventoryItems'},qty:Number}],
    unit:{type: String, enum: ['Piece', 'LB', 'Bottle','Case','Gram', 'Liter'],default:'Piece'},
    
   
});

var optionsGroupsSchema = new mongoose.Schema({ 
    merchantId:{type:String,lowercase: true, trim: true},
    group:{type: "String",default:"Default"},
    description:String,
    minimun:{type:Number,default:0},
    maximun:{type:Number,default:0},
    order:{type:Number,default:1},
    options:[optionsSchema]
});
var pricesSchema = new mongoose.Schema({ 
    name:String, //price new price member price
    price:Number
});

/*var spicysSchema = new mongoose.Schema({ 
    id: mongoose.Schema.Types.ObjectId, //price new price member price
    price:Number
});*/
var itemsSchema = new mongoose.Schema({ 
    merchantId:{type:String,lowercase: true, trim: true},
    name:{type:String},
    customerOptions:[optionsGroupsSchema],
    status:{type:String,default:""},
    category:{ type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    price:Schema.Types.Mixed,//origin,newPrice,member..
    picture:[{type:String}],
    description:String,
    order:{type:Number,default:1},
    unit:{type: String, enum: ['Piece', 'LB', 'Bottle','Case','Gram', 'Liter'],default:'Piece'},
    //recommend:{type:Boolean,default:false},
    //spicy:{type:Boolean,default:false},
    properties:Schema.Types.Mixed,//recommend,spicy
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },user:String}
});
itemsSchema.index({ name: 1, merchantId: 1 ,category:1,status:1}, { unique: true,sparse:true});
module.exports = mongoose.model('items', itemsSchema);
/*{ createdAt: { type: Date, expires: 3600, default: Date.now }}
OrderList.$.UserName","大叔2015-09-21
*/
