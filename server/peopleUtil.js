const wiki = require("./wikiFetch.js");

function getPageIdsFromSearch(query) {
	return new Promise((resolve, reject) => {
		if(typeof query != "string") {
			reject("Invalid Query");
		}

		try {
			//Get the page results
			wiki.searchFetch(query)
				.then(response => response.json())
				.then(body => {
					let response = body.query.search;

					let queries = [];
					for(let i = 0, length = response.length; i < length; i += 1) {
						queries.push(response[i].pageid);
					}

					resolve(queries);
				})
				.catch(err => {
					reject(err);
				});
		} catch(err) {
			reject(err);
		}
	});
}

function selectPeople(body) {
	return new Promise((resolve, reject) => {
		try {

			let ids = [];
			let pages = body.query.pages;

			pages = Object.values(pages);

			for(let i = 0, length = pages.length; i < length; i += 1) {
				let page = pages[i];

				if(!page.revisions ) {
					continue;
				}
				let content = page.revisions[0]["*"];

				if(content.indexOf("birth_date") != -1) {
					ids.push(page.pageid);
				}
			}

			resolve(ids);

		} catch(err) {
			reject(err);
		}
	});
}

function getShortDescription(content) {
	content = content.revisions[0]["*"];

	const descriptionStringTag = "short description|";
	let descriptionIndex = content.indexOf(descriptionStringTag);
	if(descriptionIndex == -1) {
		return "";
	}
	descriptionIndex += descriptionStringTag.length;

	let description = "";
	let i = descriptionIndex;
	while(content[i] != "}") {
		description += content[i];
		i += 1;
	}

	return description;
}

function getImages(queries) {
	return new Promise((resolve, reject) => {
		try {

			wiki.imagesByIdFetch(queries)
				.then(response => response.json())
				.then(body => {
					let result = {};

					for(let i = 0, length = queries.length; i < length; i += 1) {
						let imageContent = body.query.pages[queries[i]];

						if(imageContent.thumbnail && imageContent.thumbnail.source) {
							result[queries[i]] = imageContent.thumbnail.source;
						} else {
							result[queries[i]] = "";
						}
					}

					resolve(result);
				})
				.catch(err => reject(err));

		} catch(err) {
			reject(err);
		}
	});
}

function getRelatedLinks(content) {
	return new Promise((resolve, reject) => {
		try {
			content = content.revisions[0]["*"];
			let lastCharacter = "";
			let linkCount = 0;
			let readingName = false;
			let titles = "";

			for(let i = 0, l = content.length; i < l; i += 1) {
				if(content[i] == "[" && lastCharacter == "[") {
					readingName = true;
				} else if(readingName) {
					if(content[i] == "]") {
						readingName = false;
						titles += "|";
						linkCount += 1;
					} else {
						titles += content[i];
					}
				}

				// Stop the query from getting too big
				if(linkCount > 49) {
					break;
				}

				lastCharacter = content[i];
			}
			titles = titles.slice(0, -1); //Remove the final '|'

			resolve(titles);

		} catch(err) {
			reject(err);
		}
	});
}

module.exports = {
	getPageIdsFromSearch: getPageIdsFromSearch,
	selectPeople: selectPeople,
	getShortDescription: getShortDescription,
	getImages: getImages,
	getRelatedLinks: getRelatedLinks
};