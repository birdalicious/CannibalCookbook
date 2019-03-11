const express = require("express");
const fetch = require("node-fetch");
const seedrandom = require("seedrandom");

const people = require("./server/people.js");

const app = express();

app.use("/", express.static("client"));

app.get("/people", function(req, resp){
	search = req.query.q;

	people.search(search, (data) => {
		resp.send(data)
	});
});

app.get("/test", function(req,resp) {
	people.getPageInfo(736, (data) => {
		resp.send(data)
	})
})

app.get("/random", function(req, resp){
	var rng = seedrandom("hello")
	resp.send(rng().toString() + " " + rng().toString())
})

module.exports = app;