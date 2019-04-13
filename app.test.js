jest.mock("./server/wikiFetch");

const request = require("supertest");

const app = require("./app.js");

test("/api/recipes/homepage", () => {
	return request(app).get("/api/recipes/homepage")
	.expect(200)
	.expect('Content-Type', /json/);
});

test("/api/recipes/search", () => {
	return request(app).get("/api/recipes/search/steve")
	.expect(200)
	.expect('Content-Type', /json/);
});

test("/api/people/search/", () => {
	return request(app).get("/api/people/search/minecraft steve")
	.expect(200)
	.expect('Content-Type', /json/);
});

test("/api/comments/", () => {
	return request(app).get("/api/comments/736")
	.expect(200)
	.expect('Content-Type', /json/);
});