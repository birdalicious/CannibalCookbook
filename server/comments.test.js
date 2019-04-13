const comments = require("./comments.js");

test("dfsgiushgfg", () => {
	return comments.getCharacterComments(6)
		.then(results => {
			console.log(results);
		})
		.catch(err => {
			console.log(err);
		});
	// return comments.generateChains()
	// 	.then(data => {
	// 		console.log(data);
	// 	});
});