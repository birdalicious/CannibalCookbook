const searchFetch = function(query) {
	return Promise.resolve(
		require("./searchSteveIrwin.json")
    );
}

const pagesByIdFetch = function(queries) {
	if(queries == "select people") {
		return Promise.resolve(
			require("./pagesIrwin.json")
		);
	} else {
		return Promise.resolve(
			require("./pageSteveIrwin.json")
		);
	}
}

const pagesByTitleFetch = function(stringQueries) {
	return Promise.resolve(
		require("./titlesFetch.json")
	);
}

const imagesByIdFetch = function(queries) {
	if(queries.length == 1) {
		return Promise.resolve(
			require("./singleImage.json")
		);
	}
	else {
		return Promise.resolve(
			require("./multipleImages.json")
		);
	}
}

module.exports = {
	searchFetch: searchFetch,
	pagesByIdFetch: pagesByIdFetch,
	pagesByTitleFetch: pagesByTitleFetch,
	imagesByIdFetch: imagesByIdFetch
}