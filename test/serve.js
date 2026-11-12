const http=require('http'),fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..','dist');
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p==='/')p='/CodeCraft 学习站.html';
  const f=path.join(root,p);
  fs.readFile(f,(e,d)=>{
    if(e){res.writeHead(404);res.end('404');return;}
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    res.end(d);
  });
}).listen(8777,'127.0.0.1',()=>console.log('http://127.0.0.1:8777'));
