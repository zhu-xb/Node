'use strict'

const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const mime = require('./mine.js')
const urlencode = require('urlencode');


// ES6语法 创建并导出静态类
module.exports = class StaticServer {

    /**
     * 构造函数初始化
     * @param {object} options 选项
     */
    constructor(options) {
        // http对象
        this.currentServer = null
        // 默认选项
        this.options = {
            port: 3000,
            host: '127.0.0.1',
            filePath: '',
            homePage: ''
        }
        // 选项合并
        for (let key in options) {
            this.options[key] = options[key]
        }
    }

    /**
     * 服务器启动函数
     */
    run() {
        // 实例绑定
        let self = this

        // 创建http服务
        this.currentServer = http.createServer((req, res) => {
			console.log('----------start------');
            // 使用url模块解析url字符串
            let tmpUrl = url.parse(req.url).pathname;
			console.log('tmpUrl:'+tmpUrl);
			
            // 自动指定首页
            let reqUrl = tmpUrl === '/' ? self.options.homePage : tmpUrl;			
			console.log('reqUrl:'+reqUrl);
			
            // 组装文件地址
            //let filePath = self.options.filePath + reqUrl;
			
			
			var staticPath = path.resolve(__dirname, this.options.filePath);
			console.log('staticPath:'+staticPath);
			
			var pathObj = url.parse(req.url, true);
			
			console.log('pathname:'+pathObj.pathname);
			var pathname = pathObj.pathname==='/' ? this.options.homePage : pathObj.pathname;
			
			var name =  urlencode.decode(pathname, 'utf-8');
			console.log('filename:'+name);
			
			var filePath = path.join(staticPath,name);
			console.log('filePath:'+filePath);

			// 判断文件是否存在
			fs.stat(filePath, (err, stat) => {
			  if (!err) {
				  console.log('success');
				
	
				  fs.readFile(filePath, function(err2, content){
					if(err2){
					  res.writeHead('404', 'haha Not Found');
					  return res.end();
					}
					var extname=path.extname(filePath).substring(1);
					console.log(mime.types[extname])
					
					res.writeHead(200, {
						// 获取文件类型头,去掉最开始的那个/ 故从1开始截取
						
						'Content-Type': mime.types[extname]
					})
					res.write(content)
					res.end()
					console.log('----------end------');
				  });
  
			
			  } else {
				  res.writeHead('404', 'haha Not Found');
				  return res.end();
				  console.log('error');
			  }
			});
			

        }).listen(this.options.port, () => {
            console.log("listening " + this.options.port)
        })
    }
	

    // 关闭服务
    close() {
        this.currentServer.close(() => {
            close.log('Server closed.')
        })
    }

    // 捕获404错误
    catch404(res) {
        // 响应头
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        })
        // 响应体
        res.write('Error 404. Resource not found.')
        // 结束行
        res.end()
    }

}