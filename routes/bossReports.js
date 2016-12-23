
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    md5 = require('md5'),
    bossReports = require('../models/bossReports');
    

router.post('/webLogin',  security.ensureAuthorized,function(req, res, next) {
   var info=req.body;
   var query={
           "email":info.email,
           "password":security.encrypt(md5(password))
    }
    bossReports.findOne(query,function(err, data){
            if (err) return next(err);
            if (!data) return next({"code":"90002"});
            if(data.status==false) return next({"code":"90004"});
               res.json(data);
    })
})
router.post('/',  security.ensureAuthorized,function(req, res, next) {
 var info=req.body;
 info.operator={};
 info.operator.id=req.token.id;
 info.operator.user=req.token.user;
 info.password=security.encrypt(md5(password));
 var dao = new bossReports(info);
   dao.save(function (err, data) {
   if (err) return next(err);
          res.json(data);
      });
})
router.put('/:id',  security.ensureAuthorized,function(req, res, next) {
var info=req.body;
log.debug(info);
var id=req.params.id;
info.updated_at=new Date();
var query = {"_id": id};
var options = {new: true};
info.operator={};
info.operator.id=req.token.id;
info.operator.user=req.token.user;
bossReports.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
          res.json(data);
    });
})
router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
     bossReports.remove({"_id":req.params.id}, function (err, data) {
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

