const seedrandom = require("seedrandom");
const recipes = require("./recipes.json");
const people = require("./people.js");

function getRecipeData(title, id) {
	return new Promise((resolve, reject) => {
		let rng = seedrandom(parseInt(id));
		let random = rng();

		let recipeIndex = Math.floor(random*recipes.length);

		let recipe = recipes.generator[recipeIndex];

		recipe.title = recipe.title.replace("(*)", title);
		recipe.intro = recipe.intro.replace("(*)", title);

		for(let i = 0; i < recipe.ingredients.length; i += 1) {
			recipe.ingredients[i] = recipe.ingredients[i].replace("(*)", title);
		}
		for(let i = 0; i < recipe.method.length; i += 1) {
			recipe.method[i] = recipe.method[i].replace("(*)", title);
		}

		resolve(recipe);
	});
}

module.exports = {
	getRecipeData: getRecipeData
}