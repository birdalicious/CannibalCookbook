const seedrandom = require("seedrandom");
const recipes = require("../data/recipes.json");

function getRecipeData(title, id) {
	return new Promise((resolve, reject) => {
		try {
			let result = {};

			let rng = seedrandom(parseInt(id));
			let random = rng();

			let recipeIndex = Math.floor(random*recipes.length);

			let recipe = recipes.generator[recipeIndex];

			result.title = recipe.title.replace("(*)", title);
			result.intro = recipe.intro.replace("(*)", title);

			result.image = recipe.image;
			result.serves = recipe.serves;
			result.cooksIn = recipe.cooksIn;

			result.ingredients = [];
			result.method = [];

			for(let i = 0; i < recipe.ingredients.length; i += 1) {
				result.ingredients[i] = recipe.ingredients[i].replace("(*)", title);
			}
			for(let i = 0; i < recipe.method.length; i += 1) {
				result.method[i] = recipe.method[i].replace("(*)", title);
			}

			resolve(result);
		} catch(err) {
			reject(err);
		}
	});
}

function getSearchResult(personData) {
	return new Promise((resolve, reject) => {
		try {
			getRecipeData(personData.title, personData.id)
				.then(recipe => {
					let result = {};
					result.id = personData.id;
					result.title = recipe.title;

					//image
					if(personData.image != "") {
						result.image = personData.image;
					} else {
						result.image = recipe.image;
					}

					//description
					if(personData.description != "") {
						result.description = personData.description;
					} else if(recipe.intro != "") {
						result.description = recipe.intro;
					} else {
						result.description = personData.title + " in a delicious dish";
					}

					//info
					result.serves = recipe.serves;
					result.cooksIn = recipe.cooksIn;

					resolve(result);	
				});
		} catch(err) {
			reject(err);
		}
	});
}

module.exports = {
	getRecipeData: getRecipeData,
	getSearchResult: getSearchResult
};