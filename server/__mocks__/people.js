function search(query, callback) {
	callback(require("./peopleSearchSteveIrwin.json"))
}

function getPageInfo(id, callback) {
	callback(require("./peoplePageInfoSteveIrwin.json"))
}

module.exports = {
	search: search,
	getPageInfo: getPageInfo
}