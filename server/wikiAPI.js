const fetch = require("node-fetch");

const search = function(query, callback) {
	let searchURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="
	let pagesURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&rvsection=0&pageids="
	searchURL += query

	fetch(searchURL)
	.then(response => response.text())
	.then(body => {
		// Get all the search results as an array
		let results = JSON.parse(body).query.search;

		// Now search through the search results for people
		for(let i = 0, l = results.length; i < l - 1; i += 1) {
			pagesURL += results[i].pageid + "|"
		}
		pagesURL += results[results.length - 1].pageid

		return fetch(pagesURL)
	})
	.then(response => response.text())
	.then(body => {
		// Get the page infomation
		let pages = JSON.parse(body).query.pages;
		pages = Object.values(pages)

		for(let i = 0, length = pages.length; i < length; i += 1) {
			let page = pages[i];
			// The wikitext
			let content = page.revisions[0]["*"];

			if(content.indexOf("birth_date") != -1) {
				console.log(page.title);
			}
		}
	});
}

module.exports = {
	search: search
};