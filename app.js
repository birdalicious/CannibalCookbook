const express = require("express");

const people = require("./server/people/people.js");
const recipes = require("./server/recipes/recipe.js");
const comments = require("./server/comments/comments.js");

var bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", express.static("client"));

app.get("/api/recipes/search/:query/", function(req, resp){
	let search = req.params.query;

	recipes.search(search, (data) => {
		return resp.status(data.status).send(data);
	});
});

app.get("/api/recipes/recipe/:query/", function(req, resp){
	let id = req.params.query;

	recipes.getRecipe(id, (data) => {
		return resp.status(data.status).send(data);
	});
});

app.get("/api/recipes/homepage", function(req, resp){
	recipes.homepageSearch((data) => {
		return resp.status(data.status).send(data);
	});
});



app.get("/api/people/search/:query/", function(req, resp){
	let search = req.params.query;

	people.searchByQuery(search, (data) => {
		return resp.status(data.status).send(data);
	});
});

app.get("/api/people/pageInfo/:query/", function(req, resp){
	let search = req.params.query;

	people.getPageInfo(search, (data) => {
		return resp.status(data.status).send(data);
	});
});


app.get("/api/comments/:query/", function(req, resp){
	let id = req.params.query;

	comments.getComments(id, (data) => {
		return resp.status(data.status).send(data);
	});
});

app.post("/api/comments", function(req, resp){
	if(!req.body.id || !req.body.name || !req.body.comment) {
		resp.status(400).send({
			status: 400,
			data: "Not all required fields provided"
		});
		return;
	}

	comments.submitUserComment(
		req.body.id,
		req.body.name,
		req.body.comment)
		.then(response => {
			if(response == 200 || response == 201) {
				return resp.status(response).send({
					status: response,
					data: {}
				});
			
			} else {
				return resp.status(500).send({
					status: 500,
					data: response
				});
			}
		})
		.catch(err => {
			return resp.status(500).send({
				status: 500,
				data: err
			});
		});
	
});

app.get("/api/refresh/comments", function(req, resp){
	comments.generateChains()
		.then(data => resp.send(data));
});

module.exports = app;