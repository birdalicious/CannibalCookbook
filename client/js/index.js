var searchBox = document.getElementById("searchBox");
var searchResults;

searchBox.addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		
		let query = this.value;
		
		searchContainer.innerHTML = "<img src=\"./assets/loading.gif\" id=\"loadingImage\">"

		fetch("/api/recipes/search/" + query)
		.then(response => response.text())
		.then(body => {
			body = JSON.parse(body)

			let searchContainer = document.getElementById("searchContainer");
			searchContainer.innerHTML = ""

			let people = body.data;

			if(people.length == 0) {
				searchContainer.innerHTML = "<div id=\"noResults\"> No results found :( </div>";
				return;
			}

			for(let i = 0; i < people.length; i += 1) {
				let time = ""
				if(people[i].cooksIn > 60) {
					time += Math.floor(people[i].cooksIn/60) + "h " + people[i].cooksIn%60 + "mins"
				} else {
					time += people[i].cooksIn + "mins"
				}

				let html = ""

				html += "<div class=\"resultCard\" id=\"" + people[i].id + "\">"

				html += "<div class=\"resultImg\" style=\"background-image: url('" + people[i].image + "')\"></div>"

				html += "<div class=\"resultTitle\">" + people[i].title + "</div>"

				html += "<div class=\"resultDescription\">" + people[i].description + "</div>"

				html += "<div class=\"resultCooksIn\">Cooks in " + time + "</div>"
				
				html +=  "<div class=\"resultServes\">Serves " + people[i].serves + "</div>"

				html += "</div>"

				searchContainer.innerHTML += html
			}

			searchResults = document.getElementsByClassName("resultCard");

			for(let i = 0; i < searchResults.length; i += 1) {
				searchResults[i].addEventListener("click", clickSearchResult)
			}
		})
		.catch(() => {
			searchContainer.innerHTML = "<div id=\"noResults\"> An error occured :( </div>"
		})
	}
});

function clickSearchResult() {
	console.log(this.getAttribute("id"))
}