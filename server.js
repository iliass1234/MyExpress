const myExpress = require('./myExpress');

const app = new myExpress();

function myMiddle(req, res){
    res.sayHello = ()=>{
        res.end('<h1>hello said</h1>');
    }
    return [req, res];
}
app.use(myMiddle);

app.get('/', (req, res)=>{
    res.end('<h1>'+req.method + ' hello ilias'+'<h1>');
})
app.get('/ren', (req, res)=>{
    res.render('./hello.html');
})
app.get('/ts', (req, res)=>{
    res.sayHello();
})

app.listen(3000);