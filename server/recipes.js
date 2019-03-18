const seedrandom = require("seedrandom");
const recipes = require("./recipes.json");
const people = require("./people.js");

const search = function(query, callback) {
	//one recipe per person
	people.search(query, data => {
		// console.log(data)
		if(data.status != 200) {
			callback({
				status: data.status,
				data: []
			});
			return;
		}

		let recipesCount = recipes.generator.length;

		let content = data.data;

		let returnResults = []

		for(let i = 0, l = content.length; i < l; i += 1) {
			let rng = seedrandom(content[i].id);

			let randomIndex = Math.floor(rng()*recipesCount);

			let recipe = recipes.generator[randomIndex];

			let result = {};

			result.id = content[i].id;
			result.title = recipe.title.replace("(*)", content[i].title);
			result.image = content[i].image != "" ? content[i].image : recipe.image;

			result.description = content[i].description;

			result.cooksIn = recipe.cooksIn;
			result.serves = recipe.serves;

			returnResults.push(result)
		}

		callback(returnResults)
	})
}

module.exports = {
	search: search
}