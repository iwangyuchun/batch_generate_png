let express=require('express');
const path=require('path');

let app=express();

app.use(express.static(path.join(__dirname,'views')));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'data')));

app.listen(8088,'0.0.0.0',function(){
    console.log("start server on 3000");
})


