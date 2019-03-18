const express = require("express");
const fetch = require("node-fetch");
const seedrandom = require("seedrandom");

const people = require("./server/people.js");
const recipes = require("./server/recipes.js");

const app = express();

app.use("/", express.static("client"));

app.get("/api/recipes/search", function(req, resp){
	search = req.query.q;

	people.search(search, (data) => {
		resp.send(data)
	});
});

app.get("/api/people/search", function(req, resp){
	search = req.query.q;

	people.search(search, (data) => {
		resp.send(data)
	});
});

app.get("/api/people/pageInfo", function(req, resp){
	search = req.query.q;

	people.getPageInfo(search, (data) => {
		resp.send(data)
	});
});





app.get("/test", function(req,resp) {
	recipes.search("barack obama", (data) => {
		resp.send(data)
	})
})

app.get("/random", function(req, resp){
	var rng = seedrandom("hello")
	resp.send(rng().toString() + " " + rng().toString())
})

module.exports = app;