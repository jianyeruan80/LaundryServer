
var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    root_path=path.join(__dirname, '../logs/');
    tools = require('../modules/tools');
     

router.get('/',function(req, res, next) {
         var p1=tools.logsList();
          p1.then(function(n){
            var html='<a href="logs" style="text-decoration: none;"><h1>logs</h1></a><p>';
            for(var i=0;i<n.length;i++){
             html+='<a href="logs/'+n[i]+'" style="padding:10px;background:#000;color:#fff;margin:10px;font-size:20px;text-decoration: none;">'+n[i]+'</a>';
             }
            res.set('Content-Type', 'text/html');
	   res.send(html);
          })
});
router.get('/:id',function(req, res, next) {
        var id=req.params.id;
        var html='<a href="../logs" style="text-decoration: none;"><h1>logs</h1></a><p>';

        var data=html+fs.readFileSync(root_path+id,"utf-8");  
        
          res.set('Content-Type', 'text/html');
         res.send('<pre>'+new Buffer(data)+'</pre>');
    
});
module.exports = router;

