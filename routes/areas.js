
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    areas = require('../models/areas');
    
router.get('/', function(req, res, next) {
     log.debug(req.token);
       areas.find({}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
     
});

router.get('/merchant/id', security.ensureAuthorized,function(req, res, next) {
     var query={"merchantId":req.token.merchantId};
       areas.findOne(query).sort({"order":1}).exec(function (err, data) {
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
   var areas = new areas(info);
   areas.save(function (err, data) {
   if (err) return next(err);
          res.json(data);
      });
})

router.put('/:id',  security.ensureAuthorized,function(req, res, next) {
var info=req.body;
var id=req.params.id;
info.updatedAt=new Date();
info.operator={};
info.operator.id=req.token.id;
info.operator.user=req.token.user;
var query = {"_id": id};
var options = {new: true};
areas.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
          res.json(data);
    });
})

router.delete('/:id', security.ensureAuthorized,function(req, res, next) {
     areas.remove({"_id":req.params.id}, function (err, data) {
        if (err) return next(err);
          res.json(data);
      });
});

module.exports = router;

