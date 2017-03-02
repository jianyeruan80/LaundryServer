var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var globalOptionsSchema = new mongoose.Schema({ 
    name:String,
    description:String,
    price:Number,
    order:{type:Number,default:1},
    picture:String
 });
var globalOptionGroupsSchema = new mongoose.Schema({ 
    merchantId:{type:String,lowercase: true, trim: true},
    group:{type:String,default:"Option Group"},
    status:{type:String,default:""},
    description:String,
    minimun:{type:Number,default:0},
    maximun:{type:Number,default:0},
    order:{type:Number,default:1},
    picture:String,
    unit:{type: String, enum: ['Case', 'LB', 'Bottle','Piece','Gram', 'Liter'],default:'Case'},
    operator:{
    id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    user:String
},
    options:[globalOptionsSchema]

   
});
globalOptionGroupsSchema.index({merchantId: 1,group:1,status:1},{unique: true,sparse:true });
module.exports = mongoose.model('globalOptionGroups', globalOptionGroupsSchema);

