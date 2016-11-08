
var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    root_path=path.join(__dirname, '../logs/');
    tools = require('../modules/tools');
    var  container=[];
    var sign="";
   router.get('/',function(req, res, next) {
         
  container=[];
  var p1=tools.logsList();
          p1.then(function(n){
            var html='<a href="/api/logs" style="text-decoration: none;"><h1>logs</h1></a><p>';
            for(var i=0;i<n.length;i++){
             html+='<a href="/api/logs/'+n[i]+'" style="padding:10px;background:#000;color:#fff;margin:10px;font-size:20px;text-decoration: none;">'+n[i]+'</a>';
             }
            res.set('Content-Type', 'text/html');
	   res.send(html);
          })
});
router.get('/:id/down',function(req, res, next) {
        container=[];
        var id=req.params.id;
        var html='<a href="/api/logs" style="text-decoration: none;margin-rigth:50px;padding:10px;font-size:30px">logs</a>';
            html+='<a href="/api/logs/'+id+'/down" style="text-decoration: none;font-size:30px;padding:10px;margin-right:0 50px">&uarr;</a>';
            html+='<a href="/api/logs/'+id+'" style="text-decoration: none;font-size:30px;padding:10px;">&darr;</a></p><p>';
 //       var data=html+fs.readFileSync(root_path+id,"utf-8");  
          var input = fs.createReadStream(root_path+id);
      sign="down";
        var p1= readLines(input, func);
       p1.then(function(n){
        console.log(n)


          res.set('Content-Type', 'text/html');
          res.send('<pre>'+html+n.join("\n")+'</pre>');
       })
})

router.get('/:id',function(req, res, next) {
	        container=[];
        var id=req.params.id;
        var html='<a href="/api/logs" style="text-decoration: none;margin-rigth:50px;padding:10px;font-size:30px">logs</a>';
            html+='<a href="/api/logs/'+id+'/down" style="text-decoration: none;font-size:30px;padding:10px;margin-right:0 50px">&uarr;</a>';
            html+='<a href="/api/logs/'+id+'" style="text-decoration: none;font-size:30px;padding:10px;">&darr;</a></p><p>';
 //       var data=html+fs.readFileSync(root_path+id,"utf-8");
          var input = fs.createReadStream(root_path+id);
      sign=null;
        var p1= readLines(input, func);
       p1.then(function(n){
        console.log(n)


          res.set('Content-Type', 'text/html');
          res.send('<pre>'+html+n.join("\n")+'</pre>');
       })

})



 
function readLines(input, func) {
return new Promise(function(resolve, reject) {
  var remaining = '';
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
 
  });
 
  input.on('end', function() {
    if (remaining.length > 0) {
      func(remaining);
    }
      resolve(container);
  });
})
}
function func(data) {
 
if(!sign){
console.log(data);
 container.unshift(data);
}else{
 console.log("=============");
  container.push(data);}
}
 

module.exports = router;

