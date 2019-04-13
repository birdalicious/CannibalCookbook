const express = require("express");

const people = require("./server/people.js");
const recipes = require("./server/recipe.js");
const comments = require("./server/comments.js");

const recipeJson = require("./server/recipes.json");
const fs = require("fs");

var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static("client"));

app.get("/api/recipes/search/:query/", function(req, resp){
	let search = req.params.query;

	recipes.search(search, (data) => {
		resp.status(data.status);
		resp.send(data);
	});
});

app.get("/api/recipes/recipe/:query/", function(req, resp){
	let id = req.params.query;

	recipes.getRecipe(id, (data) => {
		resp.status(data.status);
		resp.send(data);
	});
});

app.get("/api/recipes/homepage", function(req, resp){
	recipes.homepageSearch((data) => {
		resp.status(data.status);
		resp.send(data);
	});
});



app.get("/api/people/search/:query/", function(req, resp){
	let search = req.params.query;

	people.searchByQuery(search, (data) => {
		resp.status(data.status);
		resp.send(data);
	});
});

app.get("/api/people/pageInfo/:query/", function(req, resp){
	let search = req.params.query;

	people.getPageInfo(search, (data) => {
		resp.status(data.status);
		resp.send(data);
	});
});

app.get("/api/people/image/:query/", function(req, resp){
	let search = req.params.query;

	people.getImages([search], (data) => {
		resp.status(data.status);
		resp.send(data);
	});
});


app.get("/api/comments/:query/", function(req, resp){
	let id = req.params.query;

	comments.getComments(id, (data) => {
		resp.status(data.status);
		resp.send(data);
	});
});

app.post("/api/comments", function(req, resp){
	console.log(req.body)
	comments.submitUserComment(
		req.body.id,
		req.body.name,
		req.body.comment)
	.then(response => {
		if(response == 200 || response == 201) {
			resp.status(response);
			resp.send({
				status: response
			});
			
		} else {
			resp.status(500);
			resp.send({
				status: 500,
				data: response
			});
		}
	})
	
});


// app.get("/api/refresh/comments", function(req, resp){
// 	comments.generateChains()
// 	.then(data => resp.send(data))
// });

module.exports = app;