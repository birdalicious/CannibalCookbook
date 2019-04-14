const comments = require("./comments.js");

test("getUserComments Existing Comment", () => {
	return comments.getUserComments(28089486)
	.then(comments => {
		expect(comments[0]).toHaveProperty("name")
		expect(comments[0]).toHaveProperty("comment")
	})
});

test("getUserComments Non-Existing Comment", () => {
	return comments.getUserComments(1)
	.then(comments => {
		expect(comments.length).toBe(0);
	})
});

test("getCharacterComments", () => {
	return comments.getCharacterComments(1)
	.then(comments => {
		expect(comments[0]).toHaveProperty("name")
		expect(comments[0]).toHaveProperty("comment")
	})
});