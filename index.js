const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*'); //自定义中间件，设置跨域需要的响应头。
// });
app.use(express.static("./public"));

app.get('/', function (req, res) {
    // var fileName = "./public/index.html";
    // fs.readFile(fileName, function (err, data) {
    //     if (err)
    //         console.log("对不起，您所访问的路径出错");
    //     else {
    //         res.write(data);
    //     }
    // })
    console.log(req)
     let fileName = path.resolve('./public/index.html');
     res.sendFile(fileName)
})

app.listen(3000)