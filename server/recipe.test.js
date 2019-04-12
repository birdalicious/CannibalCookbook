jest.mock("./wikiFetch");
jest.mock("./people");
const recipe = require("./recipe.js");

test("search", done => {
	recipe.search("This input doesn't matter", (data) => {
		expect(data).toHaveProperty("status");
		expect(data).toHaveProperty("data");

		expect(data.data[0]).toHaveProperty("cooksIn");
		expect(data.data[0]).toHaveProperty("serves");
		expect(data.data[0]).toHaveProperty("title");
		expect(data.data[0]).toHaveProperty("id");
		expect(data.data[0]).toHaveProperty("image");
		expect(data.data[0]).toHaveProperty("description");

		expect(data.status).toBe(200);

		expect(data.data[0].image).not.toBe("");
		expect(data.data[0].description).not.toBe("");

		done();
	});
});

test("getRecipe", done => {
	recipe.getRecipe(736, (data) => {
		expect(data).toHaveProperty("status");
		expect(data).toHaveProperty("data");

		expect(data.status).toBe(200);

		expect(data.data).toHaveProperty("id");
		expect(data.data).toHaveProperty("title");
		expect(data.data).toHaveProperty("intro");
		expect(data.data).toHaveProperty("foodImage");
		expect(data.data).toHaveProperty("personImage");
		expect(data.data).toHaveProperty("serves");
		expect(data.data).toHaveProperty("cooksIn");
		expect(data.data).toHaveProperty("ingredients");
		expect(data.data).toHaveProperty("method");
		expect(data.data).toHaveProperty("related");

		expect(data.data.related[0]).toHaveProperty("id");
		expect(data.data.related[0]).toHaveProperty("title");
		expect(data.data.related[0]).toHaveProperty("image");

		done();
	});
});