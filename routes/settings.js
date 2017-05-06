
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
     tools = require('../modules/tools'),
    security = require('../modules/security'),
    settings = require('../models/settings');
    
router.get('/', function(req, res, next) {


settings.aggregate( [
  {$unwind:"$settingInfo"},
    {
     $project: {key:1,marchantId:1,type:1,group:1,values:"$settingInfo.values"}    
    },
    {
     $match:{"values":{$elemMatch:{"name":"Status","value":true}}  }
    }, 
        {
         $project: {
             
             "values":"$values",
              "type":1,
              "group":1,
             "key":
              {
                  $cond: { if: { $eq: [ "$key", "PAYMENT" ] },
                 then: '$values.select', else: "$group"
                      
            }
     }}},{$unwind:"$key"},
     {
         $group:{
             _id:"$type",values:{$push:"$$ROOT"}
         }
     }

],function (err, data) {
        if (err) return next(err);
           var returnJson={};
           for(var i=0;i<data.length;i++){
		//returnJson[data[i]["_id"]]={};
                var settingJson={};    
		for(var j=0;j<data[i].values.length;j++){
			settingJson[data[i].values[j].key]={};
              		for(var k=0;k<data[i].values[j].values.length;k++){
                         
				if(data[i].values[j].values[k].select){
				settingJson[data[i].values[j].key][data[i].values[j].values[k].name]=data[i].values[j].values[k].select;
				}else{
				settingJson[data[i].values[j].key][data[i].values[j].values[k].name]=data[i].values[j].values[k].value;
				}
				
			}
			console.log(settingJson);
		returnJson[data[i]._id]=settingJson;
                      
 	       }
		 //returnJson[data[i]["_id"]][data[i].values[j].key]=settingJson;
             	//returnJson[data[i]._id]=settingsJson;
	 
           }
           res.json(returnJson);
      });
     
});
router.get('/merchant/id',function(req, res, next) {

     log.debug(req.token);
       var info=req.query;
       var query={
          "type":info.type
       }
       if(!!info.type && info.type=="!Device"){
          query["type"]={$ne:"Device"};
        }
      settings.find({}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});

router.post('/',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
   info.merchantId=req.token.merchantId; 
   info.operator={};
   info.operator.id=req.token.id;
   info.operator.user=req.token.user;
   var arvind = new settings(info);
   settings.save(function (err, data) {
   if (err) return next(err);
          res.json(data);
      });
})
router.put('/:id',function(req, res, next) {
var info=req.body;
info.updatedAt=Date.now();
info.operator={};
//info.operator.id=req.token.id;
//info.operator.user=req.token.user;

 if(req.params.id=="NEW"){
   var dao = new settings(info);
   dao.save(function (err, data) {
   if (err) return next(err);
          res.json(data);
      });
 }else{
    settings.findByIdAndUpdate(req.params.id,info,{new:true},function (err, data) {
          if (err) return next(err);
          res.json(data);
    }); 
 }
 
})


router.delete('/:id',function(req, res, next) {
     settings.remove({"_id":req.params.id}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
});

module.exports = router;

