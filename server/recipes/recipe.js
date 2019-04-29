const fs = require("fs");
const people = require("../people/people.js");
const util = require("./recipeUtil.js");
var recipes = require("../data/recipes.json");

function search(query, callback) {
	let peopleData;

	//search wiki
	people.searchByQuery(query, (data) => {
		peopleData = data.data;

		if(data.status != 200) {
			callback({
				status: data.status,
				data: data.data
			});
			return;
		}

		let searchPromises = [];

		//collate people data with recipe data
		for(let i = 0, length = peopleData.length; i < length; i += 1) {
			searchPromises.push(
				util.getSearchResult(peopleData[i])
			);
		}

		Promise.all(searchPromises)
			.then(results => callback({
				status: 200,
				data: results
			}))
			.catch(err => callback({
				status: 500,
				data: err
			}));
	});
}

function homepageSearch(callback) {
	let ids = [6873934, 63390, 104940, 166103, 161570];
	people.searchByPageIds(ids, (results) => {
		if(results.status != 200) {
			callback({
				status: results.status,
				data: results.data
			});
		}

		let peopleData = results.data;

		let searchPromises = [];
		for(let i = 0, length = peopleData.length; i < length; i += 1) {
			searchPromises.push(
				util.getSearchResult(peopleData[i])
			);
		}

		Promise.all(searchPromises)
			.then(results => callback({
				status: 200,
				data: results
			}))
			.catch(err => callback({
				status: 500,
				data: err
			}));
	});
}

function getRecipe(id, callback) {
	people.getPageInfo(id, (data) => {
		if(data.status != 200) {
			callback({
				status: data.status,
				data: data.data
			});
			return;
		}

		let personData = data.data;
		let result = {};

		//Get the recipe
		util.getRecipeData(personData.title, personData.id)
			.then(recipe => {
			//Bind the data together
				result.id = personData.id;
				result.title = recipe.title;
				result.intro = recipe.intro;
				result.foodImage = recipe.image;
				result.personImage = personData.image;
				result.serves = recipe.serves;
				result.cooksIn = recipe.cooksIn;
				result.ingredients = recipe.ingredients;
				result.method = recipe.method;

				//Get the recipes for the related people
				let relatedPromises = [];
				for(let i = 0, related = personData.related, length = related.length; i < length; i += 1) {
					relatedPromises.push(
						util.getRecipeData(related[i].title, related[i].id)
					);
				}

				return Promise.all(relatedPromises);
			})
			.then(results => {
				if(results.length != personData.related.length) {
					callback({
						status: 500,
						data: "Problem with related people"
					});
					return;
				}

				result.related = [];

				for(let i = 0, related = personData.related, length = related.length; i < length; i += 1) {
					let image;
					if(related[i].image != ""){
						image = related[i].image;
					} else {
						image = results[i].image;
					}
					result.related.push({
						id: related[i].id,
						title: results[i].title,
						image: image
					});
				}

				callback({
					status: 200,
					data: result
				});
			})
			.catch(err => callback({
				status: 500,
				data: err
			}));
	});
}

function addRecipe(recipe) {
	return new Promise((resolve, reject) => {
		try {
			if(!recipe.title ||
				!recipe.intro ||
				!recipe.image ||
				!recipe.serves ||
				!recipe.cooksIn ||
				!recipe.ingredients ||
				!recipe.method) {
				reject("Incomplete data");
				return;
			}

			recipes.generator.push(recipe);
			recipes.length = recipes.length + 1;

			fs.writeFile("./server/data/recipes.json", JSON.stringify(recipes), (err) => {
				if(err) {
					reject(err);
					return;
				}

				resolve(200);
			});

		} catch(err) {
			reject(err);
		}
	});
}

module.exports = {
	search: search,
	homepageSearch: homepageSearch,
	getRecipe: getRecipe,
	addRecipe: addRecipe
};