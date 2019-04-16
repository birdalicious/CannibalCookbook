const fetch = require("node-fetch");

function convertQueryArrayToString(queries) {
	let string = "";
	let length = queries.length;
	for(let i = 0; i < length - 1; i += 1) {
		string += queries[i] + "|";
	}
	string += queries[length - 1];

	return string;
}

function searchFetch(query) {
	let searchURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=";
	return fetch(searchURL + encodeURI(query));
}

function pagesByIdFetch(queries) {
	let pagesByIdURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&rvsection=0&pageids=";
	let stringQueries = convertQueryArrayToString(queries);
	return fetch(pagesByIdURL + encodeURI(stringQueries));
}

function pagesByTitleFetch(stringQueries) {
	let pagesByTitleURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvsection=0&rvprop=content&titles=";
	return fetch(pagesByTitleURL + encodeURI(stringQueries));
}

function imagesByIdFetch(queries) {
	let imagesURL = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=name|thumbnail&pithumbsize=300&pageids=";
	let stringQueries = convertQueryArrayToString(queries);
	return fetch(imagesURL + encodeURI(stringQueries));
}


module.exports = {
	searchFetch: searchFetch,
	pagesByIdFetch: pagesByIdFetch,
	pagesByTitleFetch: pagesByTitleFetch,
	imagesByIdFetch: imagesByIdFetch
};