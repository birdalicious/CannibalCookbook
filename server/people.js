const wiki = require("./wikiFetch.js");
const util = require("./peopleUtil.js");

function searchByQuery(query, callback) {
	//get ids
	util.getPageIdsFromSearch(query)
		.then(queries => {
		//select people
			return wiki.pagesByIdFetch(queries);
		})
		.then(response => response.json())
		.then(body => {
			return getSearchResults(body);
		})
		.then(results => callback({
			status: 200,
			data: results
		}))
		.catch(err => callback({
			status: 500,
			data: err
		}));
}

function searchByPageIds(ids, callback) {
	wiki.pagesByIdFetch(ids)
		.then(response => response.json())
		.then(body => {
			return getSearchResults(body);
		})
		.then(results => callback({
			status: 200,
			data: results
		}))
		.catch(err => callback({
			status: 500,
			data: err
		}));
}

function getSearchResults(body) {
	return new Promise((resolve, reject) => {
		let pages;
		let peopleIds;
		let results = [];

		try {
			pages = body.query.pages;
			//select people
			util.selectPeople(body)
				.then(ids => {
					peopleIds = ids;

					//get images
					return util.getImages(ids);
				})
				.then(images => {
				//collect all the data
					for(let i = 0, length = peopleIds.length; i < length; i += 1) {
						let result = {};
						let personContent = pages[peopleIds[i]];
						let image = images[peopleIds[i]];

						result.id = peopleIds[i];
						result.title = personContent.title;
						result.description = util.getShortDescription(personContent);
						result.image = image;

						results.push(result);
					}

					resolve(results);
				})
				.catch(err => reject(err));
		} catch(err) {
			reject(err);
		}
	});
}

function getPageInfo(id, callback) {
	let pages;
	let page;
	let result = {};

	let relatedIds;
	let relatedPages;

	let maxRelatedPeople = 4;

	if(typeof id == "object") {
		callback({
			status: 500,
			data: "There should only be one id"
		});
	}

	//get page
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
			return util.selectPeople(body);
		})
		.then(ids => {
			if(ids.length != 1 || id != ids[0]) {
				callback({
					status: 400,
					data: "Not a person"
				});
				return;
			}

			page = pages[0];

			return util.getImages([id]);
		})
		.then(images => {
		//collect all the information so far

			result.id = id;
			result.title = page.title;
			result.description = util.getShortDescription(page);
			result.image = images[id];

			//get related people
			return util.getRelatedLinks(page);
		})
		.then(titles => {
			return wiki.pagesByTitleFetch(titles);
		})
		.then(response => response.json())
		.then(body => {
			relatedPages = body.query.pages;

			//select the poeple
			return util.selectPeople(body);
		})
		.then(ids => {
			relatedIds = ids.splice(0, maxRelatedPeople); // Limit lenght of related poeple
		
			return util.getImages(relatedIds);
		})
		.then(images => {
		//compile the related people data
			let related = [];
			for(let i = 0, length = relatedIds.length; i < length; i += 1) {
				let person = {};
				person.id = relatedIds[i];
				person.title = relatedPages[relatedIds[i]].title;
				person.image = images[relatedIds[i]];

				related.push(person);
			}

			result.related = related;

			callback({
				status: 200,
				data: result
			});
		})
		.catch(err => callback({
			status: 500,
			data: err
		}));
}


module.exports = {
	searchByQuery: searchByQuery,
	searchByPageIds: searchByPageIds,
	getPageInfo: getPageInfo
};