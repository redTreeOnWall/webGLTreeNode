var express = require('express');
var app = express();
//静态html
app.use(express.static(__dirname));

console.log("node started");
app.listen(8080);
