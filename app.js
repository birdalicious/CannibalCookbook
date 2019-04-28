const express = require("express");

const people = require("./server/people/people.js");
const recipes = require("./server/recipes/recipe.js");
const comments = require("./server/comments/comments.js");
var Auth = require("./server/auth.js");

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

app.post("/api/recipes/add", function(req, resp){
	if(!req.body.auth || !req.body.recipe) {
		resp.status(400).send({status: 400, data: "missing data"});
		return;
	}

	let auth = new Auth(req.body.auth);

	if(!auth.canModifyRecipes) {
		resp.status(403).send({status: 403, data: "don't have permission"});
		return;
	}

	recipes.addRecipe(JSON.parse(req.body.recipe))
		.then(() => {
			resp.status(200).send({status: 200, data: {}});
		})
		.catch(err => {
			resp.status(500).send({status: 500, data: err});
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
	if(!req.body.id || !req.body.auth || !req.body.name || !req.body.comment) {
		resp.status(400).send({
			status: 400,
			data: "Not all required fields provided"
		});
		return;
	}

	let auth = new Auth(req.body.auth);

	if(!auth.canComment) {
		resp.status(403).send({
			status: 403,
			data: "Invalid auth code"
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


app.post("/auth/update", function(req, resp) {
	if(!req.body.auth || !req.body.changeAuth || !req.body.permissions) {
		resp.status(400).send({
			status: 400,
			data: "Missing data"
		});
		return;
	}

	let auth = new Auth(req.body.auth);

	if(!auth.canModifyAuth) {
		resp.status(403).send({
			status: 403,
			data: "Don't have the permission to modify"
		});
		return;
	}

	auth.modifyAuth(req.body.changeAuth, req.body.permissions)
		.then(response => {
			resp.status(response.status).send(response);
		})
		.catch(err => {
			resp.status(err.status).send(err);
		});

});

module.exports = app;