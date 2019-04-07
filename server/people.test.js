jest.mock("./wikiFetch");
const wiki = require("./wikiFetch.js")
const people = require("./people.js");

// test("search for page ids", () => {
// 	people.getPageIdsFromSearch("Steve Irwin")
// 	.then((data) => {
// 		expect(data).toContain(6873934)
// 		expect(data).toContain(53236627)
// 		expect(data).toContain(7075860)
// 		expect(data).toContain(1719252)
// 		expect(data).toContain(14324616)
// 		expect(data).toContain(6877527)
// 		expect(data).toContain(8894434)
// 		expect(data).toContain(7578749)
// 		expect(data).toContain(1719289)
// 		expect(data).toContain(6986688)
// 	})
// })

test("select poeple", () => {
	let body = wiki.pagesByIdFetch("select people");
	people.selectPeople(body)
	.then(data => {
		expect(data).toContain(6873934)
		expect(data).toContain(53236627)
		expect(data).toContain(7075860)
		expect(data).toContain(1719252)
		expect(data).toContain(6877527)

		expect(data).not.toContain(14324616)
		expect(data).not.toContain(8894434)
		expect(data).not.toContain(7578749)
		expect(data).not.toContain(1719289)
		expect(data).not.toContain(6986688)
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