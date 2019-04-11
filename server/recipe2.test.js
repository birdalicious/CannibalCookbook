jest.mock("./wikiFetch");
const util = require("./recipeUtil.js");
const recipe = require("./recipe2.js");

test("search", done => {
	recipe.search("This input doesn't matter", (data) => {
		expect(data).toHaveProperty("status");
		expect(data).toHaveProperty("data");

		expect(data.data[0]).toHaveProperty("cooksIn");
		expect(data.data[0]).toHaveProperty("serves");
		expect(data.data[0]).toHaveProperty("title");
		expect(data.data[0]).toHaveProperty("id");
		expect(data.data[0]).toHaveProperty("image");
		expect(data.data[0]).toHaveProperty("description")

		expect(data.status).toBe(200);

		expect(data.data[0].image).not.toBe("");
		expect(data.data[0].description).not.toBe("");

		done();
	})
})