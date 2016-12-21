var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var admins = require('./routes/admins');
var superAdmin = require('./routes/superadmin');
/*var background = require('./routes/background');*/
/*var menuitem = require('./routes/menuitem');*/
var stores = require('./routes/stores');
var customers = require('./routes/customers');
var storeHours = require('./routes/storeHours');
var groups = require('./routes/groups');
var globalOptionGroups = require('./routes/globalOptionGroups');
var categories = require('./routes/categories');
var items = require('./routes/items');
var debug = require('./routes/debug');
var orders = require('./routes/orders');
var navs = require('./routes/navs');
var seqs = require('./routes/seqs');
var settings=require('./routes/settings');
var ejs = require('ejs');
var multiparty = require('multiparty');
var log=require('./modules/logs');
var mongoose = require('./modules/mongoose');
var util  =   require('util');
var security = require('./modules/security');
var tools = require('./modules/tools');
var mkdirp = require('mkdirp');
var compress = require('compression');
var rest = require('restler');
var SSE = require('sse')

var apiToken={};

var app = express();
app.use(compress());

app.engine('html',ejs.__express) ;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('superSecret',"ruanjy520");
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(bodyParser.json({limit: '150mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
limit: '150mb',
extended: true
})); */


app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb',extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

app.get('/', function (req, res) {
    res.send("index", "Start");
});
app.use('/superadmin', superAdmin);
app.use('/api/admin', admins);
app.use('/api/navs', navs);
app.use('/api/logs', debug);
app.use('/api/stores', stores);
app.use('/api/customers', customers);
app.use('/api/storehours', storeHours);
app.use('/api/groups', groups);
app.use('/api/globalOptionGroups', globalOptionGroups);
app.use('/api/categories', categories);
app.use('/api/items', items);
app.use('/api/orders', orders);
app.use('/api/settings',settings);
var testdata = "This is my message";



app.get('/test', (req, res) => {
    res.end(`
       <!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title></title>
</head>
<body>
<h1>获取服务端更新数据</h1>
<div id="result"></div>
var es = new EventSource('http://localhost:8080/sse');

<script type="text/javascript">
    if (typeof (EventSource) !== "undefined") {
        var source = new EventSource("http://192.168.1.100:3000/sse");
        source.addEventListener('server-time', function (e) {
                console.log("xxxxxxxxxx")
                console.log(e.data);
});
        source.onmessage = function (event) {
           console.log(event);
            document.getElementById("result").innerHTML += event.data + "<br>";
        };
        source.onerror = function (event) {
            console.log("error"+event);
        }
        source.onopen = function () {
            console.log('开始连接');
        }
    }
    else {
        document.getElementById("result").innerHTML = "抱歉，你的浏览器不支持 server-sent 事件...";
    }
</script>

</body>
</html>
      `);
  });
/*app.post('/api/upload',security.ensureAuthorized,function(req, res, next) {
console.log(req.token.merchantId);
var fold=req.token.merchantId;
var photoPath=path.join(__dirname, 'public')+'/'+fold;
mkdirp(photoPath, function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});
var options={
    uploadDir:  photoPath,
    maxFieldsSize:10
}
var form = new multiparty.Form(options);
var  store={};
     store.success=true;
    form.parse(req, function(err, fields, files) {

    store.message=files;

   res.json(store);
 })
 })*/
app.post('/api/uploadPic',security.ensureAuthorized,function(req, res, next) {
var fold=req.token.merchantId;
var photoPath=path.join(__dirname, 'public')+'/'+fold;
mkdirp(photoPath, function (err) {
    if (err) console.error(err)
    else console.log('uploadPic!')
});
var options={
    uploadDir:  photoPath,
    autoFiles:true
}
var form = new multiparty.Form(options);
   form.maxFilesSize =1*1024*1024;
    var pic="";
    form.parse(req, function(err, fields, files) {
       form.maxFilesSize = 1 ;
      if(err) {console.log(err);return next(err);}
      if(!!files &&  !!files.picture && files.picture[0].size>0){
          console.log(files);
          var path=files.picture[0].path.split("/");
          pic=path[path.length-1];
       }
       res.json(pic);
 })
 })
app.post('/api/uploadVideo',security.ensureAuthorized,function(req, res, next) {
var fold=req.token.merchantId;
var photoPath=path.join(__dirname, 'public')+'/'+fold;
mkdirp(photoPath, function (err) {
    if (err) console.error(err)
    else console.log('uploadVideo!')
});
var options={
    uploadDir:  photoPath,
    
}
var form = new multiparty.Form(options);
    form.maxFilesSize =100*1024*1024;
    var video="";
    form.parse(req, function(err, fields, files) {
       if(err) {console.log(err);return next(err);}
      if(!!files &&  !!files.video && files.video[0].size>0){
          console.log(files);
          var path=files.video[0].path.split("/");
          video=path[path.length-1];
       }
       res.json(video);
 })
 })

 var customerError={
         "11000":"Item already exists",
         "90001":"token not match",
         "90002":"user password is not match",
         "90003":"User Type not match",
         "90004":"Your account is disable,please contant admin!",
         "90005":"Your Link is false!",
         "90006":"Save order is fail",
         "90007":"License is fail",
         "90008":"License is expires",
         "90009":"User or password already exists",
         "99999":"Transfer parameters Is Error"
 }

app.get('/api/ext',function(req, res, next) {
    var info = req.query;
    var address={};
    var args = {};
    console.log(info)
     var address=info.address;
      rest.get("https://maps.googleapis.com/maps/api/geocode/json?address="+address).on('complete', function(data, response) {
        if (data instanceof Error) return next(data);
         console.log(data);
        // address.message=data.results[0];
         return   res.json(data.results[0]);
    });

 })


if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.error("Error:" + err.message);
    res.status(err.status || 500).json({

      success:false,
      message: customerError[err.code]?customerError[err.code]:err.message,
      code:err.code?err.code:0,

      error: err
    });
  });
}


app.use(function(err, req, res, next) {
  
  console.error("Error: " + err);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

var server = app.listen(3000, function (err) {
  if(err) throw err;
   var host = server.address().address;
  var port = server.address().port;
  console.log('Server is running at http://%s:%s', host, port)
});
var sse = new SSE(server)
sse.on('connection', function (connection) {
  console.log('new connection');
  var pusher = setInterval(function () {
    connection.send({
      event: 'server-time',
      data: new Date().toTimeString()
    })
  }, 1000);

  connection.on('close', function () {
    console.log('lost connection');
    clearInterval(pusher);
  });
})
/*var server = app.listen(3000, function () {
   if(err) throw err;
  console.log("server ready on http://localhost:8080")
});
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server is running at http://%s:%s', host, port)

var sse = new SSE(server)
sse.on('connection', function (connection) {
  console.log('new connection');
  var pusher = setInterval(function () {
    connection.send({
      event: 'server-time',
      data: new Date().toTimeString()
    })
  }, 1000);

  connection.on('close', function () {
    console.log('lost connection');
    clearInterval(pusher);
  });
  })*/
/*console.log(util.inspect(result, false, null))
schemaModel.findOne({name:'loong'},function(err,doc){
        doc.set({baseinfo:{age:26}});
        doc.save();
    });
*/
