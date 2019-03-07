const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use("/", express.static("client"));

app.get("/api", function(req, resp){
   resp.send("Hello world")
});

module.exports = app;