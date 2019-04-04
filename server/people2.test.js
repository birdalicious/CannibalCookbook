jest.mock("./wikiFetch");
const people = require("./people2.js");

test("search for page ids", () => {
	people.getPageIdsFromSearch("Steve Irwin")
	.then((data) => {
		expect(data).toContain(6873934)
		expect(data).toContain(53236627)
		expect(data).toContain(7075860)
		expect(data).toContain(1719252)
		expect(data).toContain(14324616)
		expect(data).toContain(6877527)
		expect(data).toContain(8894434)
		expect(data).toContain(7578749)
		expect(data).toContain(1719289)
		expect(data).toContain(6986688)
	})
})

test("select poeple", () => {
	people.selectPeople({"query": {"pages": {1719252: {"pageid": 1719252,"title": "Terri Irwin","revisions": [{"*": "birth_date"}]},1719289: {"pageid": 1719289,"title": "Australia Zoo","revisions": [{"*": ""}]}}}})
	.then(data => {
		expect(data).toContain(1719252) // Terri Irwin
		expect(data).not.toContain(1719289) // Australia Zoo
	})
})

test("search", () => {
	people.search("foobar", (data) => {
		expect(data)
		.toHaveProperty("status", 200);

		expect(data)
		.toHaveProperty("data");

		expect(data.data[0])
		.toHaveProperty("image")

		expect(data.data[0])
		.toHaveProperty("title")

		expect(data.data[0])
		.toHaveProperty("id")

		expect(data.data[0])
		.toHaveProperty("description")

		expect(data.data[0])
		.not.toHaveProperty("name")

		expect(data.data[0])
		.not.toHaveProperty("related")
	})
})