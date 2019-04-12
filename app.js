const express = require("express");

const people = require("./server/people.js");
const recipes = require("./server/recipe.js");

const app = express();

app.use("/", express.static("client"));

app.get("/api/recipes/search/:query/", function(req, resp){
	let search = req.params.query;

	recipes.search(search, (data) => {
		resp.send(data);
	});
});

app.get("/api/recipes/recipe/:query/", function(req, resp){
	let id = req.params.query;

	recipes.getRecipe(id, (data) => {
		resp.send(data);
	});
});

app.get("/api/people/search/:query/", function(req, resp){
	let search = req.params.query;

	people.search(search, (data) => {
		resp.send(data);
	});
});

app.get("/api/people/pageInfo/:query/", function(req, resp){
	let search = req.params.query;

	people.getPageInfo(search, (data) => {
		resp.send(data);
	});
});

app.get("/api/people/image/:query/", function(req, resp){
	let search = req.params.query;

	people.getImages([search], (data) => {
		resp.send(data);
	});
});




app.get("/test", function(req,resp) {
	people.getPageInfo(6873934, (data) => {
		resp.send(data);
	});
});

module.exports = app;