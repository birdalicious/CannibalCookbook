const express = require("express");
const fetch = require("node-fetch");
const seedrandom = require("seedrandom");

const recipe2 = require("./server/recipe2.js")

const people = require("./server/people.js");
const recipes = require("./server/recipes.js");

const app = express();

app.use("/", express.static("client"));

app.get("/api/recipes/search/:query/", function(req, resp){
	search = req.params.query;

	recipes.search(search, (data) => {
		resp.send(data)
	});
});

app.get("/api/recipes/recipe/:query/", function(req, resp){
	id = req.params.query;

	recipes.getRecipe(id, (data) => {
		resp.send(data)
	});
});

app.get("/api/people/search/:query/", function(req, resp){
	search = req.params.query;

	people.search(search, (data) => {
		resp.send(data)
	});
});

app.get("/api/people/pageInfo/:query/", function(req, resp){
	search = req.params.query;

	people.getPageInfo(search, (data) => {
		resp.send(data)
	});
});

app.get("/api/people/image/:query/", function(req, resp){
	search = req.params.query;

	people.getImages([search], (data) => {
		resp.send(data)
	});
});




app.get("/test", function(req,resp) {
	recipe2.getRecipeData("Steve", 736)
	.then(data => resp.send(data))
})

app.get("/random", function(req, resp){
	var rng = seedrandom("hello")
	resp.send(rng().toString() + " " + rng().toString())
})

module.exports = app;