jest.mock("./wikiFetch");
const people = require("./people.js");

test("search", done => {
	people.search("steve irwin", (data) => {
		expect(data).toHaveProperty("status");
		expect(data).toHaveProperty("data");

		expect(data.status).toBe(200);

		expect(data.data.length).toBe(1);
		expect(data.data[0]).toHaveProperty("id");
		expect(data.data[0]).toHaveProperty("title");
		expect(data.data[0]).toHaveProperty("description");
		expect(data.data[0]).toHaveProperty("image");

		done();
	});
});

test("getPageInfo", done => {
	people.getPageInfo(6873934, (data) => {
		expect(data).toHaveProperty("status");
		expect(data).toHaveProperty("data");

		expect(data.status).toBe(200);

		expect(data.data).toHaveProperty("id");
		expect(data.data).toHaveProperty("title");
		expect(data.data).toHaveProperty("description");
		expect(data.data).toHaveProperty("image");
		expect(data.data).toHaveProperty("related");
		
		expect(data.data.title).toBe("Steve Irwin");
		expect(data.data.related.length).toBe(4);

		done();
	});
});