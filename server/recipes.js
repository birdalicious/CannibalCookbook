const seedrandom = require("seedrandom");
const recipes = require("./recipes.json");
const people = require("./people.js");

const search = function(query, callback) {
	people.search(query, data => {
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
			let random = rng()
			let randomIndex = Math.floor(random*recipesCount);

			let recipe = recipes.generator[randomIndex];

			let result = {};

			result.id = content[i].id;
			result.title = recipe.title.replace("(*)", content[i].title);
			result.image = content[i].image != "" ? content[i].image : recipe.image;


			// Create the description
			if(content[i].description == -1) {
				let desc = "";

				if(recipe.intro == "") {
					desc = content[i].title + " in a delicous dish"
				} else {
					let intro = recipe.intro.replace('(*)', content[i].title);

					let characterLimit = 150
					if(intro.length > characterLimit) {
						desc = intro.substring(0,characterLimit) + "...";
					} else {
						desc = intro
					}
				}

				result.description = desc;
			} else {
				result.description = content[i].description
			}

			result.cooksIn = recipe.cooksIn;
			result.serves = recipe.serves;

			returnResults.push(result)
		}

		callback({
			status: 200,
			data: returnResults
		})
	})
}

const getRecipe = function(id, callback) {
	let recipesCount = recipes.generator.length;

	let rng = seedrandom(parseInt(id));
	let random = rng()
	let randomIndex = Math.floor(random*recipesCount);

	let recipe = recipes.generator[randomIndex];

	let result = {};

	people.getPageInfo(id, (data) => {
		if(data.status != 200) {
			callback({
				status: data.status,
				data: []
			})
			return
		}

		let content = data.data;

		result.title = recipe.title.replace("(*)", content.title);
		result.intro = recipe.intro;
		result.foodImage = recipe.image;
		result.personImage = content.image;
		result.serves = recipe.serves;
		result.cooksIn = recipe.cooksIn;

		let ingredients = [];

		for(let i = 0, ingred = recipe.ingredients, length = ingred.length; i < length; i += 1) {
			let name = ingred[i].name.replace("(*)", content.title)
			
			ingredients.push({
				name: name,
				quantity: ingred[i].quantity
			})
		}

		result.ingredients = ingredients;

		let method = [];

		for(let i = 0, rmethod = recipe.method, length = rmethod.length; i < length; i += 1) {
			method.push(
				rmethod[i].replace("(*)", content.title)
			);
		}

		result.method = method;

		callback({
			status: 200,
			data: result
		})
	})
}

module.exports = {
	search: search,
	getRecipe: getRecipe
}