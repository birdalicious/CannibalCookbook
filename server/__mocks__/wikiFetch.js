const searchFetch = function(query) {
	return Promise.resolve(
		"{ 'query' : { 'search' :[ { title: 'Steve Irwin', pageid: 6873934 }, { title: 'Robert Irwin (television personality)', pageid: 53236627 }, { title: 'Bindi Irwin', pageid: 7075860 }, { title: 'Terri Irwin', pageid: 1719252 }, { title: 'MY Steve Irwin', pageid: 14324616 }, { title: 'Bob Irwin', pageid: 6877527 }, { title: 'Ocean\'s Deadliest', pageid: 8894434 },{ title: 'Hell on Earth 2006', pageid: 7578749 }, { title: 'Australia Zoo', pageid: 1719289},{ title: 'Wildlife Warriors', pageid: 6986688 } ]}}"
    );
}

const pagesByIdFetch = function(queries) {
	return Promise.resolve('{"query": {"pages": {1719252: {"pageid": 1719252,"title": "Terri Irwin","revisions": [{"*": "birth_date [[zoologist]] [[Bob Irwin]]"}]}}}}')
}

const pagesByTitleFetch = function(stringQueries) {
	return Promise.resolve("{'query': {'pages': {736: {'pageid': 736,'title': 'Albert Einstein','revisions': [{'*': 'birth_date [[Hans Albert Einstein]] [[German Physical Society]]'}]},534366: {'pageid': 534366,'title': 'Barack Obama','revisions': [{'*': 'birth_date [[Donald Trump]] [[Illinois]]'}] },6873934: {'pageid': 6873934,'title': 'Steve Irwin','revisions': [{'*': 'birth_date [[zoologist]] [[Bob Irwin]]'}]}}}}");
}

const imagesByIdFetch = function(queries) {
	return Promise.resolve("{'query': {'pages': {736: {'pageid': 736,'title': 'Albert Einstein','thumbnail': {'source': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Einstein_1921_by_F_Schmutzer_-_restoration.jpg/228px-Einstein_1921_by_F_Schmutzer_-_restoration.jpg'}},534366: {'pageid': 534366,'title': 'Barack Obama','thumbnail': {'source': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/240px-President_Barack_Obama.jpg'}},6873934: {'pageid': 6873934,'title': 'Steve Irwin','thumbnail': {'source': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Steve_Irwin.jpg/300px-Steve_Irwin.jpg'}}}}}");
}

module.exports = {
	searchFetch: searchFetch,
	pagesByIdFetch: pagesByIdFetch,
	pagesByTitleFetch: pagesByTitleFetch,
	imagesByIdFetch: imagesByIdFetch
}