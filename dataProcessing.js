// Data
// https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&pageids=534366&rvprop=content&rvsection=0


// Image
// https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&pageids=534366&piprop=name|thumbnail&pithumbsize=300

function isPerson(content) {
	if(content.indexOf("birth_date")) {
		return true;
	}
	return false
}