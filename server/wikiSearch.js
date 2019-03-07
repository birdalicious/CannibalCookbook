const fetch = require("node-fetch");

const wikiSearch = function(query) {
	fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + query)
	.then(response => response.text())
	.then(body => {
		let results = JSON.parse(body).query.search;

		let ids = [];
		for(let i = 0, length = results.length; i < length; i += 1) {
			ids.push(results[i].pageid)
		}

		getPeople(ids)

	})
}

const getPeople = function(ids) {
	let URL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&rvsection=0&pageids=";
	
	for(let i = 0, length = ids.length; i < length - 1; i += 1) {
		URL += ids[i] + "|";
	}
	URL += ids[ids.length - 1];

	fetch(URL)
	.then(response => response.text())
	.then(body => {
		let poeple = [];

		let pages = JSON.parse(body).query.pages;
		pages = Object.values(pages)

		for(let i = 0, length = pages.length; i < length; i += 1) {
			let page = pages[i];
			let content = page.revisions[0]["*"];

			if(content.indexOf("birth_date") != -1) {
				console.log(page.title);
			}
		}
	})
}

module.exports = wikiSearch;