const searchFetch = function(query) {
	return Promise.resolve(
		{
			json: function() {return require("./searchSteveIrwin.json")}
		}
    );
}

const pagesByIdFetch = function(queries) {
	if(queries == "select people") {
		return Promise.resolve({
			json: function() { return require("./pagesIrwin.json")}
		});
	} else {
		return Promise.resolve({
			json: function() {return require("./pageSteveIrwin.json")}
		});
	}
}

const pagesByTitleFetch = function(stringQueries) {
	return Promise.resolve({
		json: function() {return require("./titlesFetch.json")}
	});
}

const imagesByIdFetch = function(queries) {
	if(queries.length == 1) {
		return Promise.resolve({
			json: function() {return require("./singleImage.json")}
		});
	}
	else {
		return Promise.resolve({
			json: function() {return require("./multipleImages.json")}
		});
	}
}

module.exports = {
	searchFetch: searchFetch,
	pagesByIdFetch: pagesByIdFetch,
	pagesByTitleFetch: pagesByTitleFetch,
	imagesByIdFetch: imagesByIdFetch
}