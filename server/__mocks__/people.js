function searchByQuery(query, callback) {
	callback(require("./peopleSearchSteveIrwin.json"));
}

function searchByPageIds(ids, callback) {
	callback(require("./peopleSearchSteveIrwin.json"));
}

function getPageInfo(id, callback) {
	callback(require("./peoplePageInfoSteveIrwin.json"));
}

module.exports = {
	searchByQuery: searchByQuery,
	searchByPageIds: searchByPageIds,
	getPageInfo: getPageInfo
};