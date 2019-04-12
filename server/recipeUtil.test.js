jest.mock("./wikiFetch");
const util = require("./recipeUtil.js");
const people = require("./people.js");

test("getRecipeData", done => {
	return util.getRecipeData("Albert Einstein", 736)
		.then(recipe => {
			expect(recipe).toHaveProperty("title");
			expect(recipe).toHaveProperty("intro");
			expect(recipe).toHaveProperty("image");
			expect(recipe).toHaveProperty("serves");
			expect(recipe).toHaveProperty("cooksIn");
			expect(recipe).toHaveProperty("ingredients");
			expect(recipe).toHaveProperty("method");

			expect(recipe.image).not.toBe(""); // Ensure there is an image

			expect(recipe.title.indexOf("Albert Einstein")).not.toBe(-1);

			// Ensure no placeholders are left
			expect(recipe.title.indexOf("(*)")).toBe(-1);
			for(let i = 0, ingredients = recipe.ingredients, length = ingredients.length; i < length; i += 1) {
				expect(ingredients[i].indexOf("(*)")).toBe(-1);
			}
			for(let i = 0, method = recipe.method, length = method.length; i < length; i += 1) {
				expect(method[i].indexOf("(*)")).toBe(-1);
			}

			done();
		});
});

test("getSearchResult", done => {
	people.searchByQuery("This doesn't matter", (data) => {
		let personData = data.data[0];

		util.getSearchResult(personData)
			.then(result => {
				expect(result).toHaveProperty("id");
				expect(result).toHaveProperty("title");
				expect(result).toHaveProperty("image");
				expect(result).toHaveProperty("description");
				expect(result).toHaveProperty("serves");
				expect(result).toHaveProperty("cooksIn");

				expect(result.image).not.toBe("");
				expect(result.description).not.toBe("");
				expect(result.serves).not.toBe("");
				expect(result.cooksIn).not.toBe("");

				done()
			});
	});
});