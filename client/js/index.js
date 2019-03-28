var searchBox = document.getElementById("searchBox");
let searchContainer = document.getElementById("searchContainer");
let recipeContainer = document.getElementById("recipeContainer");
var searchResults;

window.addEventListener("resize", setSearchBoxSize);
window.onload = setSearchBoxSize;

searchBox.addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		
		let query = this.value;
		
		recipeContainer.innerHTML = ""
		searchContainer.innerHTML = "<img src=\"./assets/loading.gif\" id=\"loadingImage\">"

		fetch("/api/recipes/search/" + query)
		.then(response => response.text())
		.then(body => {
			body = JSON.parse(body)

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
	let id = this.getAttribute("id")

	searchContainer.innerHTML = "<img src=\"./assets/loading.gif\" id=\"loadingImage\">"
	recipeContainer.innerHTML = "";

	fetch("/api/recipes/recipe/" + id)
	.then(response => response.text())
	.then(body => {
		body = JSON.parse(body)
		if(body.status != 200) {
			searchContainer.innerHTML = "<div id=\"noResults\"> Something went wrong :( </div>";
			recipeContainer.innerHTML = "";
			return
		}

		let content = body.data;

		fillInRecipe(content)

		let recommended = document.getElementsByClassName("recommended");
		for(let i = 0; i < recommended.length; i += 1) {
			recommended[i].addEventListener("click", clickSearchResult)
		}	

	})
}

function fillInRecipe(content) {
	let HTML = ""

	//Left

	//Person Image
	HTML += "<div id=\"recipeLeft\">"
	if(content.personImage != -1) {
		HTML += "<img id=\"recipePersonImage\" src=\"" + content.personImage + "\"></img>"
	}

	//Ingredients
	HTML += "<div id=\"recipeIngredients\">"
	HTML += "<h2>Ingredients</h2><br>"
	HTML += "<ul>"

	for(let i = 0, ingredients = content.ingredients, length = ingredients.length; i < length; i += 1) {
		HTML += "<li>" + ingredients[i].quantity + " " + ingredients[i].name + "</li>"
	}

	HTML += "</ul>"
	HTML += "</div>"
	HTML += "</div>"

	//Main

	HTML += "<div id=\"recipeMain\">"
	HTML += "<img id=\"recipeFoodImage\" src=\"" + content.foodImage + "\">"

	HTML += "<div id=\"recipeInfo\">"

	HTML += "<h1 id=\"recipeTitle\">" + content.title + "<hr></h1>"

	if(content.intro != "") {
		HTML += "<div id=\"recipeIntro\">" + content.intro + "<hr></div>"
	}	

	HTML += "<div id=\"recipeCookingInfo\">Cooks In: " + content.cooksIn + "<br>Serves: " + content.serves + "</div>"

	HTML += "</div>"

	HTML += "<div id=\"recipeMethod\">"
	HTML += "<h2>Method</h2><br>"
	

	if(content.method.length == 1) {
		HTML += "<p>" + content.method[0] + "</p>"
	} else {
		HTML += "<ol>"
		for(let i = 0, steps = content.method, length = steps.length; i < length - 1; i += 1) {
			HTML += "<li>" + steps[i] + "</li><br>"
		}
		HTML += "<li>" + content.method[content.method.length - 1] + "</li>"
		HTML += "</ol>"
	}

	HTML += "</div>"

	HTML += "</div>"

	//Right
	HTML += "<div id=\"recipeRight\">"

	HTML += "<h2>Recommened</h2>";

	for(let i = 0, related = content.related, length = related.length > 4? 4: related.length; i < length; i += 1) {
		HTML += "<div class=\"recommended\" id=\"" + related[i].id + "\">"

		HTML += "<div class=\"recommendedImg\" style=\"background-image: url('" + related[i].image + "')\"></div>"

		HTML += "<div class=\"recommendedTitle\"><h3>" + related[i].title + "</h3></div>"

		HTML += "</div>"
	}

	HTML += "</div>"



	searchContainer.innerHTML = ""
	recipeContainer.innerHTML = HTML
}

function setSearchBoxSize() {
	let width = window.innerWidth;

	if(width < 608) {
		searchBox.style.padding = "";
		searchBox.style.width = (width - 20 - 4) + "px";

		// document.getElementById("recipeMain").style.width = width
	} else {
		searchBox.style.width = "584px"
	}
}