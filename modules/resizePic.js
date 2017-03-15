console.log("ok")


/*
var images = require("images");
var fs = require("fs");
var path = require("path");
    


var images = require("images");

images(path.join(__dirname, './image/A1.jpg'))                    //Load image from file 
                                        //加载图像文件
    .size(400)                          //Geometric scaling the image to 400 pixels width
                                        //等比缩放图像到400像素宽
    //.draw(images("logo.png"), 10, 10)   //Drawn logo at coordinates (10,10)
                                        //在(10,10)处绘制Logo
    .save("output.jpg", {               //Save the image to a file,whih quality 50
        quality : 50                    //保存图片到文件,图片质量为50
    });
  
*/
  //编码图片依赖模块https://github.com/zhangyuanwei/node-images  

var images = require("images");
var fs = require("fs");
var path = require("path");
var gm = require('gm');   
function readFile(src,dst){
    console.log(src);
    console.log(dst);

  
    if(fs.existsSync(src)){
    
        //读取文件夹
       fs.readdir(src,function(err,files){
            if(err){
                throw err;
            }   

         
         files.forEach(function(filePath){
                console.log(filePath);
                
                
                var url = path.join(__dirname,src+"\\"+filePath),
                    dest = path.join(__dirname,dst+"\\"+filePath);
                    console.log(url);
                    console.log(dest);
                fs.stat(url,function(err,stats){
                    if(err)throw err;
                    
                    //是文件
                   if(stats.isFile()){
                        //正则判定是图片
                       // if(/.*\.(jpg|png|gif)$/i.test(url)){
                            encoderImage(url,dest);
                      //  }
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

//这里处理文件跟复制有点相关，输出要检测文件是否存在，不存在要新建文件
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


function encoderImage(sourceImg,destImg){
    /*console.log(sourceImg);
    console.log(destImg);
    images(sourceImg)     //加载图像文件
        .size(700)          //等比缩放图像到1000像素宽
       // .draw(images("pficon.jpg"),10,10)   //在(10,10)处绘制Logo
        .save(destImg,{
            quality :80     //保存图片到文件,图片质量为50
        });*/
      
gm(sourceImg)
.resize(240)
.noProfile()
.write(destImg, function (err) {
  if (!err) console.log('done');
  console.log(err)
});
      /*  (new images(sourceImg)).encode(sourceImg, 100, 100,
        function (data, error) {
            console.log("xx");
                // fs.writeFile("out.png", destImg, "binary", function(err) {
             // console.log(err); // writes out file without error, but it's not a valid image
                //});
        }
    );*/
}
readFile('src','out');





/*module.exports = readFile;*/