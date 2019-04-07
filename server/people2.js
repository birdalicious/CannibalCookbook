const wiki = require("./wikiFetch.js")

function getPageIdsFromSearch(query) {
	return new Promise((resolve, reject) => {
		if(typeof query != "string") {
			reject("Invalid Query");
		}

		//Get the page results
		wiki.searchFetch(query)
		.then(response => response.json())
		.then(body => {
			let response = body.query.search;

			let queries = [];
			for(let i = 0, length = response.length; i < length; i += 1) {
				queries.push(response[i].pageid)
			}

			resolve(queries)
		});
	})
}

//Get the ids of the query ids which are people
function selectPeople(body) {
	return new Promise((resolve, reject) => {
		let ids = []
		let pages;
		try {
			pages = body.query.pages;
			pages = Object.values(pages);
		} catch(err) {
			reject(err);
		}

		for(let i = 0, length = pages.length; i < length; i+= 1) {
			let page = pages[i];
			if(!page.revisions) {
				continue;
			}
			let content = page.revisions[0]["*"]

			if(content.indexOf("birth_date") != -1) {
				ids.push(page.pageid);
			}
		}

		resolve(ids);
	})
}

function getShortDescription(content) {
	const descriptionStringTag = "short description|";
	let descriptionIndex = content.indexOf(descriptionStringTag);
	if(descriptionIndex == -1) {
		return "";
	}
	descriptionIndex += descriptionStringTag.length;

	let description = "";
	let i = descriptionIndex
	while(content[i] != "}") {
		description += content[i]
		i += 1;
	}

	return description;
}

function search(query, callback) {
	let pages;
	let peopleIds;
	let results = [];

	wiki.searchFetch(query)
	.then(response => response.json())
	.then(body => {
		let response = body.query.search;

		let queries = [];
		for(let i = 0, length = response.length; i < length; i += 1) {
			queries.push(response[i].pageid)
		}

		return wiki.pagesByIdFetch(queries)
	})
	.catch(err => callback({status: 500, data: err}))
	.then(response => response.json())
	.then(body => {
		pages = body.query.pages;
		return selectPeople(body);
	})
	.catch(err => callback({status: 500, data: err}))
	.then(ids => {
		peopleIds = ids;
		return wiki.imagesByIdFetch(ids);
	})
	.then(response => response.json())
	.then(body => {
		// Collect all the data gathered together
		for(let i = 0, length = peopleIds.length; i < length; i += 1) {
			let result = {};
			let personContent = pages[peopleIds[i]];
			let imageContent = body.query.pages[peopleIds[i]];


			result.id = peopleIds[i];
			result.title = personContent.title;

			result.description = getShortDescription(personContent.revisions[0]["*"]);

			if(imageContent.thumbnail && imageContent.thumbnail.source) {
				result.image = imageContent.thumbnail.source;
			} else {
				result.image = "";
			}

			results.push(result	)
		}

		callback({
			status: 200,
			data: results
		})
	})
	.catch(err => {
		console.log(err)
		callback({
			status: 500,
			data: err
		})
	})
}

function getPageInfo(id, callback) {
	let pages;
	let page;
	let titles = "";
	let result = {};

	if(typeof id == 'object') {
		callback({
			status: 500,
			data: "There should only be one id"
		})
	}

	wiki.pagesByIdFetch([id])
	.then(response => response.json())
	.then(body => {
		pages = body.query.pages;
		pages = Object.values(pages);

		if(pages.length != 1) {
			callback({
				status: 400,
				data: "Invalid Id"
			});
			return;
		}

		//Check the page is a person
		return selectPeople(body)
	})
	.catch(err => callback({status: 500, data: err}))
	.then(ids => {
		if(ids.length != 1 || id != ids[0]) {
			callback({
				status: 400,
				data: "Not a person"
			});
			return;
		}

		page = pages[0];

		result.id = id;
		result.title = page.title;
		result.description = getShortDescription(page.revisions[0]["*"]);

		//Related People
		let content = page.revisions[0]["*"];
		let lastCharacter = "";
		let linkCount = 0;
		let readingName = false;
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
			if(linkCount > 20) {
				break;
			}

			lastCharacter = content[i];
		}
		titles = titles.slice(0, -1); //Remove the final '|'

		//Get image
		return wiki.imagesByIdFetch([id])
	})
	.then(response => response.json())
	.then(body => {
		let imageContent = body.query.pages[id];

		if(imageContent.thumbnail && imageContent.thumbnail.source) {
			result.image = imageContent.thumbnail.source;
		} else {
			result.image = "";
		}

		//Get the related people
		return wiki.pagesByTitleFetch(titles);
	})
	.then(response => response.json())
	.then(body => {
		return selectPeople(body)
	})
	.catch(err => callback({status: 500, data: err}))
	.then(ids => {
		//Get images for related people
		return wiki.imagesByIdFetch(ids)
	})
	.then(response => response.json())
	.then(body => {
		let data = body.query.pages;
		data = Object.values(data);

		let related = [];
		for(let i = 0, length = data.length > 4? 4: data.length; i < length; i += 1) {
			let person = {}
			person.id = data[i].pageid;
			person.title = data[i].title;

			if(data[i].thumbnail && data[i].thumbnail.source) {
				person.image = data[i].thumbnail.source;
			} else {
				person.image = "";
			}

			related.push(person);
		}

		result.related = related;


		callback(result)
	})
	.catch(err => {
		callback({
			status: 500,
			data: err
		})
	})
}


module.exports = {
	search: search,
	getPageInfo: getPageInfo,

	getPageIdsFromSearch: getPageIdsFromSearch,
	selectPeople: selectPeople
}