const fetch = require("node-fetch");

const search = function(query, callback) {
	let searchURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=";0
	let pagesURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&rvsection=0&pageids=";
	let imagesURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=name|thumbnail&pithumbsize=300&pageids=";
	searchURL += query;

	let pageids = [];

	let results = {};

	fetch(searchURL)
	.then(response => response.text())
	.then(body => {
		// Get all the search results as an array
		let results = JSON.parse(body).query.search;

		// Build the query to get page information
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
		pages = Object.values(pages);

		for(let i = 0, length = pages.length; i < length; i += 1) {
			let page = pages[i];
			// The wikitext
			let content = page.revisions[0]["*"];

			// Check if they are a person
			if(content.indexOf("birth_date") != -1) {
				let result = {};

				result.title = page.title;
				result.id = page.pageid;

				pageids.push(page.pageid)
				
				results[page.pageid] = result;
			}
		}

		// Build query to get image information
		for(let i = 0, l = pageids.length; i < l - 1; i += 1) {
			imagesURL += pageids[i] + "|"
		}
		imagesURL += pageids[pageids.length - 1];

		return fetch(imagesURL);
	})
	.then(response => response.text())
	.then(body => {
		let images = JSON.parse(body).query.pages;

		let data = {
			"status": 200,
			"data": []
		};

		for(let i = 0, l = pageids.length; i < l; i += 1) {
			let result = {}

			result.title = results[pageids[i]].title;
			result.id = pageids[i];

			// Try to get image info
			let image
			try {
				image = images[pageids[i]].thumbnail.source
			} catch(err) {
				image = false
			}

			result.image = "";
			if(image) {
				result.image = image;
			}

			data.data.push(result);
		}

		callback(data)
	})
	.catch(err => {
		let data = {
			"status": 500,
			"data": []
		}

		callback(data);
	});
}

const getPageInfo = function(id, callback) {
	let relatedPeople = 5;

	let pageTitleURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&titles="
	let pageidURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&pageids=";

	fetch(pageidURL + id)
	.then(response => response.text())
	.then(body => {
		// Get the page infomation
		let pages = JSON.parse(body).query.pages;
		pages = Object.values(pages);

		if(pages.length != 1) {
			callback({
				status: 400,
				data: "Invalid ID"
			});
			return;
		}

		let content = pages[0].revisions[0]["*"];

		if(content.indexOf("birth_date") == -1) {
			callback({
				status: 400,
				data: "Not a person"
			});
			return;
		}

		let data = {
			title: pages[0].title,
			id: id
		};
		
		callback("stuff");
	})
}

module.exports = {
	search: search,
	getPageInfo: getPageInfo
};