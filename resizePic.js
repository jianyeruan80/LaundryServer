

var images = require("images");
var fs = require("fs");
var path = require("path");
var gm = require('gm');   
function readFile(src,dst){
    if(fs.existsSync(src)){
       fs.readdir(src,function(err,files){
            if(err){
                throw err;
            }   

         
         files.forEach(function(filePath){
                console.log(filePath);
                
                
                var url = path.join(__dirname,src+"\\"+filePath),
                    dest = path.join(__dirname,dst+"\\"+filePath);
                  //  console.log(url);
                    //console.log(dest);
                fs.stat(url,function(err,stats){
                    if(err)throw err;
                    
                    //是文件
                   if(stats.isFile()){
                        //正则判定是图片
                       //if(/.*\.(jpg)$/i.test(url)){
                            encoderImage(url,dest);
                       /*}else  if(/.*\.(png|gif)$/i.test(url)){
                            encoderjpg(url,dest);
                            
                       }*/
                    }else if(stats.isDirectory()){
                        exists(url,dest,readFile);
                    }
                
                })
            });
        
        });
        
        
    }else{
        throw "no files,no such!"
    }
}

function exists(url,dest,callback){

    fs.exists(dest,function(exists){
        if(exists){
            callback && callback(url,dest);
        }else{
            //第二个参数目录权限 ，默认0777(读写权限)
            fs.mkdir(dest,0777,function(err){
                if (err) throw err;
                callback && callback(url,dest);
            });
        }
    });    
}

function encoderImage(url,destImg){

    var sourceImg = images(url);

      if(/.*\.(jpg)$/i.test(url) && sourceImg.width()>600){
        sourceImg    //加载图像文件
        .size(600)          //等比缩放图像到1000像素宽
       // .draw(images("pficon.jpg"),10,10)   //在(10,10)处绘制Logo
        .save(destImg,{
            quality :80     //保存图片到文件,图片质量为50
        });
      }else if(/.*\.(png|gif)$/i.test(url) && sourceImg.width()>250){
       
          gm(url).quality(80)
        .resize(250)
        .write(destImg, function (err) {
          if (!err) console.log('done');
          console.log(err)
        });

      }


   





readFile('src','out');



/*文字到图片
https://cnodejs.org/topic/583c5d9fba57ffba06c24a89*/

/*module.exports = readFile;*/