var express = require('express'),
    router = express.Router(),
   mongoose = require('mongoose'), 
   log = require('../modules/logs'),
    security = require('../modules/security'),
    tools = require('../modules/tools'),
    seqs = require('../models/seqs'),
    util = require('util'),
    orders = require('../models/orders'),
    bills = require('../models/bills'),
    stores = require('../models/stores');
    router.post('/query',  security.ensureAuthorized,function(req, res, next) {
         var info=req.body;
         log.info('orders',info);
         var query={"merchantId":req.token.merchantId}
         if(info.invoiceNo){query.invoiceNo={$regex:query.invoiceNo,$options: "i"}};
         if(info.pickUpTime){
            var startDate=new Date(info.pickUpTime);
            startDate=new Date(startDate.getUTCFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
            query.pickUpTime={"$gte":startDate};
         }
         if(info.pickUpTime){
          var endtDate=new Date(info.pickUpTime);
              endtDate=new Date(endtDate.getUTCFullYear(), endtDate.getMonth(), endtDate.getDate(), 23, 59, 59, 999);
              query.pickUpTime={"$lte":endtDate};
         }   
         if(info.status){query.status=info.status;}
         
         if(info.startDate){
            var startDate=new Date(info.startDate);
            startDate=new Date(startDate.getUTCFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0);
            query.createdAt={"$gte":startDate};
         }
         if(info.endtDate){
          var endtDate=new Date(info.endtDate);
              endtDate=new Date(endtDate.getUTCFullYear(), endtDate.getMonth(), endtDate.getDate(), 23, 59, 59, 999);
              query.createdAt={"$lte":endtDate};
         } 
         var queryArray=[];
         if(info.number){
             queryArray.push({"invoiceNo":{$regex:info.number,$options: "i"}});
             queryArray.push({"customer.phoneNum1":{$regex:info.number,$options: "i"}});
              queryArray.push({"customer.phoneNum2":{$regex:info.number,$options: "i"}});
         }else{
        	queryArray.push({});  
         }
  console.log(queryArray);

    orders.aggregate([

    {
      $match:query
    }

,
    {
      $project:
      {
     orderNo:1,invoiceNo:1,notes:1,pickUpTime:1,timer:1,merchantId:1,
    subTotal:1,taxRate:1,tax:1,tip:1,tipTotal:1,orderDetails:1,grandTotal:1,
    reason:1,status:1,createdAt:1,updatedAt:1,createdBy:1,operator:1,customer:1,
    unpaid:{
        $cond: [ { $eq: [ "$status", "Void" ] }, "$grandTotal", "$unpaid" ]
      }
    }
}
,
    {
      $lookup:
        {
          from: "bills",
          localField: "_id",
          foreignField: "order",
          as: "bills"
        }
   },
    {
      $lookup:
        {
          from: "customers",
          localField: "customer.id",
          foreignField: "_id",
          as: "customer"
        }
   },
{
  $unwind:{path:"$customer",preserveNullAndEmptyArrays:true}
},
{
$match:{
 $and:[{"$or":queryArray}]
}
},
{ $sort : { updatedAt : -1, pickUpTime: -1 } }
]).exec(function(err,data){

console.log("======================aaaaaaaaaaaaaa");
console.log(data);
console.log("xxxxxxxxxxxxxxx");
res.json(data);


})


})
/**
[
{_id:xx,min:20}
]
**/
router.post('/updateTimer',  security.ensureAuthorized,function(req, res, next) {
    var info=req.body;
    log.info("updateTime",info);
   var len=info.length;
     for(var i=0;i<len;i++){
         var query={"_id":info[i]._id};
          var timer=new Date(),min=info[i].min;
           var update={"timer":null};
              if(min>0){
	         
              timer.setTime(timer.getTime() + min*60*1000);
               update.timer=timer;
     }
         
         orders.findOneAndUpdate(query,update,{},function (err, data) {
               if (err) return next(err);
               if(i>=len){
                res.json(data);  
                }
                
               
        })
     }
})
router.post('/timer',  security.ensureAuthorized,function(req, res, next) {
    var alertDate=new Date();

    var query={
      $and:[
           {
             "status":{ "$in":["Unpaid","Paid"]}
           },
            {"timer":{ "$lte":alertDate}  },
           {
	    "timer":{"$ne" : [null] } 
           }
        ]
}
orders.aggregate([
    {
      $match:query
    },
    {
      $lookup:
        {
          from: "bills",
          localField: "_id",
          foreignField: "order",
          as: "bills"
        }
   },
    {
      $lookup:
        {
          from: "customers",
          localField: "customer.id",
          foreignField: "_id",
          as: "customers"
        }
   }
]).exec(function(err,data){
res.json(data);
})
})
router.post('/invoice/:number',  security.ensureAuthorized,function(req, res, next) {
   var info=req.query;
         log.info('orders',info);
         var query={"merchantId":req.token.merchantId}
        
         var number=req.params.number;
    orders.aggregate([
    {
      $match:query
    },
    {
      $lookup:
        {
          from: "bills",
          localField: "_id",
          foreignField: "order",
          as: "bills"
        }
   },
    {
      $lookup:
        {
          from: "customers",
          localField: "customer.id",
          foreignField: "_id",
          as: "customer"
        }
   },
{
  $unwind:{path:"$customer",preserveNullAndEmptyArrays:true}
},
{
  $match:{$and:[{
          $or:[
                      {"invoiceNo":{$regex:number,$options: "i"}},
                      {"customer.phoneNum1":{$regex:number,$options: "i"}},
                       {"customer.phoneNum2":{$regex:number,$options: "i"}},
                     
            ] 
        }]}
},
 { $sort : { updatedAt : -1, pickUpTime: -1 } },
{ $limit : 50 }

]).exec(function(err,data){

console.log("======================aaaaaaaaaaaaaa");
console.log(data);
console.log("xxxxxxxxxxxxxxx");
res.json(data);


})
     /*  var id=req.params.id;
      log.info("invoice",id);
       var query={
           $and:[
            {"merchantId":req.token.merchantId},
            {
              $or:[
                      {"invoiceNo":{$regex:id,$options: "i"}}
                     
                ] 
            }
           ]
       }       
       orders.find(query, function (err, data) {
        if (err) return next(err);
         res.json(data);
      });*/
})
router.get('/bills',  security.ensureAuthorized,function(req, res, next) {
        var info=req.query;
        log.info("bills",info);
         var query={"merchantId":req.token.merchantId};
        if(info.status){query.status=info.status;}

        bills.find(query).sort({orderNo: 1, _id:1 }).exec(function(err,data){
           if (err) return next(err);
           res.json(data);
        })
})
router.put('/void/:id',  security.ensureAuthorized,function(req, res, next) {
       var query={"_id":req.params.id}
        var info=req.body;
        log.info("void",info);
        var upData={status:"Void"};
            upData.reason=info.reason || "";
        orders.findOneAndUpdate(query,upData,{},function (err, data) {
               if (err) return next(err);
               query={"order":req.params.id};
               info={"status":"Void"};
               bills.findOneAndUpdate(query,info,{},function (err, data) {
                if (err) return next(err);
                 res.json(data);
                })
        })
})
router.put('/billvoid/:id',  security.ensureAuthorized,function(req, res, next) {
	 var query={"_id":req.params.id}
         log.info("billVoid",query);  
        var info={status:"Void"}
        bills.findOneAndUpdate(query,info,{},function (err, billData) {
               if (err) return next(err);
          /*   var billData=billData;
                             console.log("1111111111111111111111111111");
                     console.log(billData);
                     console.log("3333333333333333333333333333333333333");*/
                        bills.aggregate([
                               { $match: { "order": billData.order,"status":"Paid" } },
                               {
                                $project:
                                {
                                   order:1,receiveTotal:1,tip:1,
                                   change:{$cond: [ { $gte: [ "$change", 0 ] }, "$change", 0 ]}
                                }
                               },
                               {  $group: {
                                  _id: "$order", 
                                  receiveTotal: { $sum: "$receiveTotal" } ,
                                  change: { $sum:"$change"}   ,
                                  tip: { $sum: "$tip" } ,

                                } 
                               }
                               
                             
                           ]).exec(function(err,billResult){
                              if (err) return next(err);
                            /*         console.log("444444444444444444444444");
                     console.log(billData);
                     console.log("6666666666666666666666666666666666666666666666");*/
                               var billResult=billResult?billResult[0]:null;
                                
                                var orderQuery={"_id":billData.order};
                                 var orderUpdata={};
                                    orderUpdata.status="Unpaid";
                                     orderUpdata.unpaid=billData.grandTotal;
                                     
                               if(billResult){
                                orderUpdata.status="Semi-Paid";
                                orderUpdata.unpaid=toFixed(billResult.grandTotal-(billResult.receiveTotal-billResult.change-billResult.tip),2);
                               }
                           
                                 orders.findOneAndUpdate(orderQuery,orderUpdata,{},function (err, orderData) {
                                             if (err) return next(err);
                                             var initOrder={
                                               subTotal:0,
                                               tax:0,
                                                taxRate:0,
                                                tip:0,
                                                tipRate:0,
                                                discount:0,
                                                discountRate:0,
                                                grandTotal:0,
                                               receiveTotal:0,
                                               orderDetails:[]
                                             };
                                             res.json(initOrder);
                                          })
                   

                           })
              /* query={"_id":data.order};
               info={"status":"unpaid"};
               orders.findOneAndUpdate(query,info,{},function (err, data) {
                if (err) return next(err);
                 res.json(data);
                })*/
        })
})

router.get('/:id',  security.ensureAuthorized,function(req, res, next) {
        var info=req.query;
         var query={"_id":req.params.id};
                orders.findOne(query).sort({orderNo: 1, _id:1 }).exec(function(err,data){
           if (err) return next(err);
           res.json(data);
        })


})
router.post('/pay',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
   log.info("pay",info);
   var name="orderNo";
   info.merchantId=req.token.merchantId; 
   var query={"merchantId":info.merchantId,"name":name};
   info.operator={};
   info.operator.id=req.token.id;
   info.operator.user=req.token.user;
   info.createdBy=info.operator;
   var d=new Date();
   info.createdAt=d;//new Date();
   info.updatedAt=d;//new Date();
   info.status="Unpaid"; //paid ,void
   if(info.pickUpTime){
   
   try{info.pickUpTime=new Date(info.pickUpTime) } catch(ex){}
   }
   if(info._id){
        orders.findOneAndUpdate({"_id":info._id},info,{},function (err, orderData) {
             if (err) return next(err);
              info.order=orderData._id;
              info.status="Paid";
              delete info["_id"];
              var b=new bills(info);

              b.save(function (err, billData) {
                              if (err) return next(err);
                                
                               bills.aggregate([
                               { $match: { "order": billData.order,"status":"Paid" } },
                                  {
                                $project:
                                {
                                   order:1,receiveTotal:1,tip:1,
                                   change:{$cond: [ { $gte: [ "$change", 0 ] }, "$change", 0 ]}
                                }
                               },
                               {  $group: {
                                  _id: "$order", 
                                  receiveTotal: { $sum: "$receiveTotal" } ,
                                  change: { $sum:"$change"}   ,
                                  tip: { $sum: "$tip" } ,

                                } 
                               }
                               
                             
                           ]).exec(function(err,billData){
                               
                              var billData=billData[0];

                               var orderQuery={"_id":billData._id};

                               var orderUpdata={};
                               var unpaid=toFixed(info.grandTotal-(billData.receiveTotal-billData.change-billData.tip),2);
                               orderUpdata.status="Paid";
                               
                               if(unpaid>0){
                                orderUpdata.status="Semi-Paid";   
                               }
                                
                               orderUpdata.unpaid=unpaid==0?-billData.change:unpaid;
                                  orders.findOneAndUpdate(orderQuery,orderUpdata,{},function (err, orderData) {
                                             if (err) return next(err);
                                             var initOrder={
                                               subTotal:0,
                                               tax:0,
                                                taxRate:0,
                                                tip:0,
                                                tipRate:0,
                                                discount:0,
                                                discountRate:0,
                                                grandTotal:0,
                                               receiveTotal:0,
                                               orderDetails:[]
                                             };
                                             res.json(initOrder);
                                          })
                   

                           })
                    })
         
               })
        
    return false;
   } 
  
   var p1=tools.getNextSequence(query);
   p1.then(function(n){
   info.orderNo=n.seqNo;
    var pre=d.getMonth()+1+""+d.getDate()+(""+d.getFullYear()).substr(2,2);
   info.invoiceNo=pre+n.seqNo;
   var arvind = new orders(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
      seqs.findOneAndUpdate(query,n.updateData,{},function (err, seqData) {
                   if (err) return next(err);
                         
                          info.order=data._id;
                          info.status="Paid";
                          delete info["_id"];
                          var b=new bills(info);
                           b.save(function (err, billData) {
                              
                               bills.aggregate([
                               { $match: { "order": billData.order,"status":"Paid" } },
                               {
                                $project:
                                {
                                   order:1,receiveTotal:1,tip:1,
                                   change:{$cond: [ { $gte: [ "$change", 0 ] }, "$change", 0 ]}
                                }
                               },
                               {  $group: {
                                  _id: "$order", 
                                  receiveTotal: { $sum: "$receiveTotal" } ,
                                  change: { $sum:"$change"}   ,
                                  tip: { $sum: "$tip" } ,

                                } 
                               }
                               
                             
                           ]).exec(function(err,billData){
                             
                          var billData=billData[0];

                               var orderQuery={"_id":billData._id};

                               var orderUpdata={};
                               var unpaid=toFixed(info.grandTotal-(billData.receiveTotal-billData.change-billData.tip),2);
                                 orderUpdata.status="Paid";

                               if(unpaid>0){
                                orderUpdata.status="Semi-Paid";   
                                  
                               }
				
					orderUpdata.unpaid=unpaid==0?-billData.change:unpaid;
                                 orders.findOneAndUpdate(orderQuery,orderUpdata,{},function (err, orderData) {
                                             if (err) return next(err);
                                             var initOrder={
                                               subTotal:0,
                                               tax:0,
                                                taxRate:0,
                                                tip:0,
                                                tipRate:0,
                                                discount:0,
                                                discountRate:0,
                                                grandTotal:0,
                                               receiveTotal:0,
                                               orderDetails:[]
                                             };
                                             res.json(initOrder);
                                          })
                   

                           })
                           })

                  }) 
 });
}, function(n) {
  res.json({"code":"90005"});
});
})
router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
 console.log("---------------------sssssssssss-------------");
   console.log(info);
   log.info("NewOrder",info);
   var name="orderNo";
   info.merchantId=req.token.merchantId; 
   var query={"merchantId":info.merchantId,"name":name};
   info.operator={};
   info.operator.id=req.token.id;
   info.operator.user=req.token.user;
   info.createdBy=info.operator;
   if(info.pickUpTime){
   try{info.pickUpTime=new Date(info.pickUpTime) } catch(ex){ console.log(ex)}}
   console.log("=====================================");
console.log(info);

 
   var d=new Date();
   info.createdAt=d;//new Date();
   info.updatedAt=d;//new Date();
   info.status="Unpaid"; //paid ,void
   info.unpaid=info.grandTotal;
   var p1=tools.getNextSequence(query);
   p1.then(function(n){
   info.orderNo=n.seqNo;
    var pre=d.getMonth()+1+""+d.getDate()+(""+d.getFullYear()).substr(2,2);
   info.invoiceNo=pre+n.seqNo;
   var arvind = new orders(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
      seqs.findOneAndUpdate(query,n.updateData,{},function (err, data2) {
                   if (err) return next(err);
                          res.json(data);  
                         
                    }) 
 });
}, function(n) {
  res.json({"code":"90005"});
});
})

router.put('/:id',  security.ensureAuthorized,function(req, res, next) {
var info=req.body;
     log.info("updateOrder",info);
     info.operator={};
    info.operator.id=req.token.id;
    info.operator.user=req.token.user;
    info.updatedAt=new Date();
    info.status="Unpaid";
    var query={"_id":req.params.id};
    var options = {new: true};
 console.log("==========================");
console.log(req.params.id);
console.log("===============");   
  if(info.pickUpTime){
   try{info.pickUpTime=new Date(info.pickUpTime) } catch(ex){}}
info.unpaid=info.grandTotal;
         bills.aggregate([
                               { $match: { "order":mongoose.Types.ObjectId(req.params.id),"status":"Paid" } },
                               {
                                $project:
                                {
                                   order:1,receiveTotal:1,tip:1,
                                   change:{$cond: [ { $gte: [ "$change", 0 ] }, "$change", 0 ]}
                                }
                               },
                               {  $group: {
                                  _id: "$order",
                                  receiveTotal: { $sum: "$receiveTotal" } ,
                                  change: { $sum:"$change"}   ,
                                  tip: { $sum: "$tip" } ,

                                }
                               }


                           ]).exec(function(err,billData){
                              if (err) return next(err);
                               console.log(billData);
              
                               var billData=billData[0];
                               if(billData){
                               console.log("=================AAA=================");
                                   var orderQuery={"_id":billData.order};
                                   var unpaid=toFixed(info.grandTotal-(billData.receiveTotal-billData.change-billData.tip),2);
                                   info.status="Paid";
                                    if(unpaid>0){
                                    info.status="Semi-Paid";

                                   }
                                    info.unpaid=unpaid==0?-billData.change:unpaid;
                                  }
                                   console.log(info);

                                                        orders.findOneAndUpdate(query,info,options,function (err, orderData) {
                                             if (err) return next(err);

                                             res.json(orderData);
                                    })
 })

})                           
    


module.exports = router;

var toFixed=function(num, s) {                        //00003
          var tempnum = num.toFixed(s+4);
      return Number(Math.round(tempnum+'e'+s)+'e-'+s);
}
