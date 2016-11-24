var fs = require('fs');
var path = require('path');
var S3FS = require('s3fs');
var options={
  "accessKeyId":"AKIAIOEFE7NF2ZAPDNAA",
  "secretAccessKey":"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"
}
var filePath="/home/jianyeruan/app/mongotar/ALL.2016112421.tar.gz";
var fsImpl = new S3FS('amazondb', options);
var fold=getYearMonthDate();
fsImpl.exists(flod).then(function(files) {
        if(files){
            fsImpl.mkdirp(flod).then(function() {
               fsImpl=new S3FS('amazondb/'+flod, options);

            }) 
        }else{
              fsImpl=new S3FS('amazondb/'+flod, options);

        }
               var fileName=fileName || new Date().getTime();
               var readStream = fs.createReadStream(filePath);
               fsImpl.writeFile(fileName,readStream).then(function(){
                   console.log(reason);
               })
},function(reason) {
  console.log(reason);
        
});
/*
docker run -it --volumes-from=data  --link mongo:mongo -e APPPATH="jaynode" --rm jianyeruan/node /run.sh node modules/createSuper.js
*/