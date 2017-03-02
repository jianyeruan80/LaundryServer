var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var admins = require('./routes/admins');
var W3CWebSocket = require('websocket').w3cwebsocket;

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
var timerID=0;
var apiToken={};
var returnData={};
returnData.success=true;
var app = express();
app.use(compress());

app.engine('html',ejs.__express) ;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('superSecret',"ruanjy520");
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));


app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb',extended: false }));
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



app.post('/api/upload',security.ensureAuthorized,function(req, res, next) {
console.log(req.token.merchantId);
var fold=req.token.merchantId;
var photoPath=path.join(__dirname, 'public')+'/'+fold;
mkdirp(photoPath, function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});
var form = new multiparty.Form({uploadDir:  photoPath});
var  store={};
     store.success=true;
    form.parse(req, function(err, fields, files) {

    store.message=files;

   res.json(store);
 })
 })
app.post('/api/uploadPic',security.ensureAuthorized,function(req, res, next) {

var fold=req.token.merchantId;
var photoPath=path.join(__dirname, 'public')+'/'+fold;
mkdirp(photoPath, function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});
var form = new multiparty.Form({uploadDir:  photoPath});
    var pic="";
    
    form.parse(req, function(err, fields, files) {
      
       if(!!files &&  !!files.picture && files.picture[0].size>0){
          console.log(files);
          var path=files.picture[0].path.split("/");
          pic=path[path.length-1];
       }

      res.json(pic);
 })
 })

 var customerError={
         "11000":"Item already exists !",
         "90001":"token not match !",
         "90002":"user password is not match !",
         "90003":"User Type not match !",
         "90004":"Your account is disable,please contact admin !",
         "90005":"Your Link is false !",
         "90006":"Save order is fail !",
         "90007":"License is fail !" ,
         "90008":"License is expires !" ,
         "90009":"User or password already exists!",
         "90010":"Transfer parameters is error !",
         "99999":"Transfer parameters is error !"
 }

app.get('/api/ext',function(req, res, next) {
    var info = req.query;
    var address={};
    var args = {};
    console.log(info)
     var address=info.address;
      rest.get("api/stores").on('complete', function(data, response) {
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
        code:err.code?err.code:err.status,
        message: customerError[err.code]?customerError[err.code]:err.message,
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


var server = app.listen(3003, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server is running at http://%s:%s', host, port)
});
var client =null;
function connect() { 
client = new W3CWebSocket('ws://service520.com:3333/', 'bossreport');  
client.onerror = function() {
    console.log('Connection Error');
    /* client.onclose();*/
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
     heartCheck.start();
     client.send('{"user":"M01"}');
};
 
client.onclose = function() {
    console.log('echo-protocol Client Closed');
       setTimeout(function() {
      connect();
    }, 4000)
};
 
client.onmessage = function(e) {
 

 // try{
   var clientData=JSON.parse(e.data);  
   

   if(!!clientData && !!clientData.to){
      var sendData={},dataJson={};
  
     /*                 console.log(data);
                    rest.get("http://service520.com:3003/api/stores",{"headers":"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoidGFlciIsImlkIjoiNTgwMmRjYTdhYTI4MGIwMDBlMzc0MWI2IiwidXNlciI6ImFkbWluIiwiaWF0IjoxNDgyNzE3MTg0LCJleHAiOjE0ODI3MjQzODR9.bCuewoiS6GKTLfhg_a9RWdZFRfgQafnf-i5xbaT3zsw"}).on('complete', function(data, response) {
                            if (data instanceof Error)  {
                              console.log(data);
                             }*/
         /* window.setTimeout(function(client){*/
        

              
//(function (client,clientData) {
       
                            sendData.from=clientData.to;
                            sendData.to=clientData.from;
                            sendData.error="";
                          console.log(clientData)
                
         rest.get(clientData.action,
          {"headers":"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoidGFlciIsImlkIjoiNTgwMmRjYTdhYTI4MGIwMDBlMzc0MWI2IiwidXNlciI6ImFkbWluIiwiaWF0IjoxNDgyNzE3MTg0LCJleHAiOjE0ODI3MjQzODR9.bCuewoiS6GKTLfhg_a9RWdZFRfgQafnf-i5xbaT3zsw"}).
         on('complete', function(data, response) {
                            if (data instanceof Error) return next(data);
                      
                        
                            sendData.data=data;
                            client.send(JSON.stringify(sendData));
                         })    
                
      
   // })(client,data);

   heartCheck.reset(); 
 }
}
}
 var heartCheck = {
    timeout: 60000,
    timeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
　　　　 this.start();
    },
    start: function(){
        this.timeoutObj = setTimeout(function(){
            client.send("HeartBeat", "beat");
        }, this.timeout)
    }
}
connect();
  
/*console.log(util.inspect(result, false, null))
schemaModel.findOne({name:'loong'},function(err,doc){
        doc.set({baseinfo:{age:26}});
        doc.save();
    });
*/

