
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    stores = require('../models/stores'),
     tools = require('../modules/tools'),
     licenses = require('../modules/license');
router.get('/', function(req, res, next) {
     log.debug(req.token);
       stores.findOne({}).sort({"_id":-1}).exec(function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});

router.post('/decrypt',  function(req, res, next) {
  var info=req.body;

  var key=licenses.decryptLicense(info.licenseKey);  
  try{
          var keyJSON=JSON.parse(key);
           console.log(keyJSON);
        console.log(keyJSON.merchantId);
        if(keyJSON.merchantId==info.merchantId && keyJSON.active==true){
            var currentDate=Date.now();
            var expires=new Date(keyJSON.expires);
         
               keyJSON.expiresTotal=Math.ceil(new Date(currentDate-expires).getTime()/(24*60*60*1000));
   if(currentDate>expires){
               keyJSON.active=false;
               
             //  keyJSON.expiresTotal=Math.ceil(new Date(currentDate-expires).getTime()/(24*60*60*1000));
               res.json(keyJSON);
            }else{
             // keyJSON.expiresTotal=0;
              res.json(keyJSON);
            }
        }else{
             return next({"code":"90007"});
  }
  }catch(ex){
        return next({"code":"90007"});
  }
 

})
router.post('/active',  function(req, res, next) {
   var info=req.body;
   var query={
     "merchantId":info.merchantId
   }
   var update={};
    update.merchantId=info.merchantId;
    update.licenseKey=info.licenseKey;
    update.expires=new Date(info.expires);
    var options={
         "upsert": true,
         "new":true
    }
     stores.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
          res.json(data);
    }
    );
})
router.get('/qrc/:id',function(req, res, next) {
      var query={"qrcUrl":req.params.id};
     stores.findOne(query, function (err, data) {
        if (err) return next(err);
        console.log(data);
         res.json(data);
      });
     
});
router.get('/merchants/id', security.ensureAuthorized,function(req, res, next) {
   
     var query={"merchantId":req.token.merchantId};
     

       stores.findOne(query, function (err, data) {
        if (err) return next(err);
        console.log(data);
         res.json(data);
      });
     
});
router.get('/:id', security.ensureAuthorized,function(req, res, next) {
     log.debug(req.token);
       stores.findById(req.params.id, function (err, data) {
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
   info.addressInfo.loc={
      "type":"Point","coordinates":[40.751351,-73.8597127]
  }
  var arvind = new stores(info);
   arvind.save(function (err, data) {
   if (err) return next(err);
          res.json(data);
      });
})
router.put('/',  security.ensureAuthorized,function(req, res, next) {
var info=req.body;
info.updatedAt=Date.now();
info.operator={};
info.operator.id=req.token.id;
info.operator.user=req.token.user;
var query = {"merchantId": req.token.merchantId};
var options = {new: true};
//try{
  //info.addressInfo.40.7623381,-73.8474097 location.coordinates=info.addressInfo.location.coordinates?info.addressInfo.location.coordinates.split(","):[];}catch(ex){}
 stores.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
          res.json(data);
    });
})
router.delete('/',function(req, res, next) {
     stores.remove({}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
});
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
     stores.remove({"_id":req.params.id}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
});

module.exports = router;

/*
var PersonSchema = new Schema({
      name:{
        first:String,
        last:String
      }
    });
  PersonSchema.virtual('name.full').get(function(){
      return this.name.first + ' ' + this.name.last;
    });

Post.find({}).sort('test').exec(function(err, docs) { ... });
Post.find({}).sort({test: 1}).exec(function(err, docs) { ... });
Post.find({}, null, {sort: {date: 1}}, function(err, docs) { ... });
Post.find({}, null, {sort: [['date', -1]]}, function(err, docs) { ... });

db.inventory.aggregate( [ { $unwind: "$sizes" } ] )
db.inventory.aggregate( [ { $unwind: { path: "$sizes", includeArrayIndex: "arrayIndex" } } ] )
https://docs.mongodb.com/manual/reference/operator/aggregation/group/
[
   /*{ $project : { title : 1 , author : 1 } } addToSet*/
/*    { $match: { status: "A" } },*
 { $group : {_id : "$permission_group", perms:{$push:{"subject":"$subject","action":"$action","perm":"$perm","status":"$status","value":"$_id","key":"$perm"} } } }
  // _id : { month: "$permission_group", day: { $dayOfMonth: "$date" }, year: { $year: "$date" } }

  /*    {
        $group : {
          _id:{permissionGroup:"$permission_group",subjects:{$push:"$subject"}}
         
    sort({"order" : 1})
        }
      }*/
/*users.update({"_id":key},{"$addToSet":{"permissions":{"$each":info.value}}},function(err,data){*/


