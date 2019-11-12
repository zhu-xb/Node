'use strict'

const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const mime = require('./mine.js')
const urlencode = require('urlencode');


// ES6�﷨ ������������̬��
module.exports = class StaticServer {

    /**
     * ���캯����ʼ��
     * @param {object} options ѡ��
     */
    constructor(options) {
        // http����
        this.currentServer = null
        // Ĭ��ѡ��
        this.options = {
            port: 3000,
            host: '127.0.0.1',
            filePath: '',
            homePage: ''
        }
        // ѡ��ϲ�
        for (let key in options) {
            this.options[key] = options[key]
        }
    }

    /**
     * ��������������
     */
    run() {
        // ʵ����
        let self = this

        // ����http����
        this.currentServer = http.createServer((req, res) => {
			console.log('----------start------');
            // ʹ��urlģ�����url�ַ���
            let tmpUrl = url.parse(req.url).pathname;
			console.log('tmpUrl:'+tmpUrl);
			
            // �Զ�ָ����ҳ
            let reqUrl = tmpUrl === '/' ? self.options.homePage : tmpUrl;			
			console.log('reqUrl:'+reqUrl);
			
            // ��װ�ļ���ַ
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

			// �ж��ļ��Ƿ����
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
						// ��ȡ�ļ�����ͷ,ȥ���ʼ���Ǹ�/ �ʴ�1��ʼ��ȡ
						
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
	

    // �رշ���
    close() {
        this.currentServer.close(() => {
            close.log('Server closed.')
        })
    }

    // ����404����
    catch404(res) {
        // ��Ӧͷ
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        })
        // ��Ӧ��
        res.write('Error 404. Resource not found.')
        // ������
        res.end()
    }

}