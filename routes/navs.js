
var express = require('express'),
    router = express.Router(),
    log = require('../modules/logs'),
    security = require('../modules/security'),
    navs = require('../models/navs');
    
router.get('/merchantId', function(req, res, next) {
       
    navs.find({"parent":null}).populate({
    path: 'children',populate: {
        path: 'children'}
    }).exec(function (err, data) {
          if (err) return next(err);
          res.json(data);
     });
});
router.get('/:id', function(req, res, next) {
     navs.findById(req.params.id,function (err, data) {
          if (err) return next(err);
          res.json(data);
    });
});
router.post('/', function(req, res, next) {
       log.debug(req.token);
       var info=req.body;
       var navsDao = new navs(info);
       navsDao.save(function (err, data) {
         if (err) return next(err);
               if(info.parent){

                     navs.findByIdAndUpdate(info.parent,{"$push":{"children":data._id}},{},function (err, data) {
                          if (err) return next(err);
                          res.json(data);
                    });
               }else{
                res.json(data);
               }
               
       });
      
     
});

router.put('/:id', function(req, res, next) {
       log.debug(req.token);
       var info=req.body;
       var options={};
       var query={"_id":info._id};
    navs.findOneAndUpdate(query,info,options,function (err, data) {
          if (err) return next(err);
          res.json(data);
    });
});
module.exports = router;

