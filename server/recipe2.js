const people = require("./people.js");
const util = require("./recipeUtil.js");

function search(query, callback) {
	let peopleData;
	let results = [];

	//search wiki
	people.search(query, (data) => {
		peopleData = data.data;

		if(data.status != 200) {
			callback({
				status: data.status,
				data: data.data
			});
			return;
		}

		let searchPromises = [];

		//collate people data with recipe data
		for(let i = 0, length = peopleData.length; i < length; i += 1) {
			searchPromises.push(
				util.getSearchResult(peopleData[i])
			);
		}

		Promise.all(searchPromises)
		.then(results => callback({
			status: 200,
			data: results
		}));
	})
}


module.exports = {
	search: search
}