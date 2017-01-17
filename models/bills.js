var mongoose = require('mongoose'),Schema = mongoose.Schema;

var billsSchema = new Schema({
merchantId:{type:String,lowercase: true, trim: true},
orderNo:String,
subTotal:Number,
taxRate:Number,
tax:Number,
tipRate:Number,
tip:Number,
discountRate:Number,
discount:Number,
charge:Number,
chargeRate:Number,
grandTotal:Number,
type:{type:String,default:"Cash"},
receiveTotal:Number,
change:Number,
createdAt: {type:Date,default:Date.now},
updatedAt: Date,
status:{type:String,default:"Paid"}, //paid,void
operator:{
	id:{type: mongoose.Schema.Types.ObjectId, ref: 'users' },
	user:String
},
customer:{
	id:{type: mongoose.Schema.Types.ObjectId, ref: 'customers' },
	user:String
},
order:{type: mongoose.Schema.Types.ObjectId, ref: 'order'}
});

module.exports = mongoose.model('bills', billsSchema);
