const http = require('http');
const fs = require('fs');

class MyExpress {
    constructor(){
        this.server = http.createServer();
        this.gets = [];
        this.posts = [];
        this.middleWares = [];
    }
    use(...args){
        console.log('args: ', args);
        args.forEach(middleWare => {
            this.middleWares.push(middleWare);
        });
    }
    get(endpoint, callback){
        this.gets.push({endpoint: endpoint, callback: callback});
    }
    post(endpoint, callback){
        this.posts.push({endpoint: endpoint, callback: callback});
    }
    listen(port){
        this.gets.forEach(getInstance =>{
                this.server.on('request',(req, res) => {
                    if(this.middleWares.length > 0){
                        this.middleWares.forEach(middleWare => {
                            let [reqN, resN] = middleWare(req, res);
                            req = reqN;
                            res = resN;
                        });
                    }
                    res.render = (filePath)=>{
                        fs.readFile(filePath, 'utf-8',(err, data)=>{
                            if(!err){
                                res.end(String(data));
                            }else{
                                console.log(err)
                            }
                        })
                    }
                    if(req.url === getInstance.endpoint && req.method === 'GET'){
                        getInstance.callback(req, res);
                    }
                })
            });
            this.posts.forEach(postInstance => {
                this.server.on('request', (req, res) => {
                    res.render = (filePath)=>{
                        fs.readFile(filePath, 'utf-8',(err, data)=>{
                            if(!err){
                                res.end(String(data));
                            }else{
                                console.log(err)
                            }
                        })
                    }
                    if(this.server.req.url === postInstance.endpoint && req.method === 'POST'){
                        postInstance.callback(req, res);
                    }
                })
            })
        this.server.listen(port);
    }
}

module.exports = MyExpress;