const express = require("express");
const app = express();

app.get('/', function(req, resp){
   resp.send('Hello world')
});

module.exports = app;