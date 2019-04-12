var searchBox = document.getElementById("searchBox");
let searchContainer = document.getElementById("searchContainer");
let recipeContainer = document.getElementById("recipeContainer");
var searchResults;

//Load homepage results
window.onload = homepage;

function homepage() {
	recipeContainer.innerHTML = "";
	searchContainer.innerHTML = "<img src=\"./assets/loading.gif\" id=\"loadingImage\">";
	
	fetch("/api/recipes/homepage")
		.then(response => response.json())
		.then(body => {
			fillInSearch(body);
		})
		.catch(() => {
			searchContainer.innerHTML = "<div id=\"noResults\"> An error occured :( </div>";
		});
}

searchBox.addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		
		let query = this.value;

		if(query == "") {
			homepage();
			return;
		}
		
		recipeContainer.innerHTML = "";
		searchContainer.innerHTML = "<img src=\"./assets/loading.gif\" id=\"loadingImage\">";

		fetch("/api/recipes/search/" + query)
			.then(response => response.text())
			.then(body => {
				body = JSON.parse(body);
				fillInSearch(body);
			})
			.catch(() => {
				searchContainer.innerHTML = "<div id=\"noResults\"> An error occured :( </div>";
			});
	}
});

function clickSearchResult() {
	let id = this.getAttribute("id");

	searchContainer.innerHTML = "<img src=\"./assets/loading.gif\" id=\"loadingImage\">";
	recipeContainer.innerHTML = "";

	fetch("/api/recipes/recipe/" + id)
		.then(response => response.text())
		.then(body => {
			body = JSON.parse(body);
			if(body.status != 200) {
				searchContainer.innerHTML = "<div id=\"noResults\"> Something went wrong :( </div>";
				recipeContainer.innerHTML = "";
				return;
			}

			let content = body.data;

			fillInRecipe(content);

			let recommended = document.getElementsByClassName("recommended");
			for(let i = 0; i < recommended.length; i += 1) {
				recommended[i].addEventListener("click", clickSearchResult);
			}	

		})
		.catch(() => {
			searchContainer.innerHTML = "<div id=\"noResults\"> An error occured :( </div>";
		});
}

function fillInSearch(body) {
	searchContainer.innerHTML = "";

	let people = body.data;

	if(people.length == 0) {
		searchContainer.innerHTML = "<div id=\"noResults\"> No results found :( </div>";
		return;
	}

	for(let i = 0; i < people.length; i += 1) {
		let time = "";
		if(people[i].cooksIn > 60) {
			time += Math.floor(people[i].cooksIn/60) + "h " + people[i].cooksIn%60 + "mins";
		} else {
			time += people[i].cooksIn + "mins";
		}

		let description;
		let maxDesLen = 175;
		if(people[i].description.length > maxDesLen) {
			description = people[i].description.slice(0, maxDesLen) + "...";
		} else {
			description = people[i].description;
		}

		let html = "";

		html += "<div class=\"resultCard\" id=\"" + people[i].id + "\">";

		html += "<div class=\"resultImg\" style=\"background-image: url('" + people[i].image + "')\"></div>";

		html += "<div class=\"resultTitle\">" + people[i].title + "</div>";

		html += "<div class=\"resultDescription\">" + description + "</div>";

		html += "<div class=\"resultCooksIn\">Cooks in " + time + "</div>";
	
		html +=  "<div class=\"resultServes\">Serves " + people[i].serves + "</div>";

		html += "</div>";

		searchContainer.innerHTML += html;
	}

	searchResults = document.getElementsByClassName("resultCard");

	for(let i = 0; i < searchResults.length; i += 1) {
		searchResults[i].addEventListener("click", clickSearchResult);
	}
}

function fillInRecipe(content) {
	let HTML = "";

	//Left

	//Person Image
	HTML += "<div id=\"recipeLeft\">";
	if(content.personImage != "") {
		HTML += "<img id=\"recipePersonImage\" src=\"" + content.personImage + "\"></img>";
	}

	//Ingredients
	HTML += "<div id=\"recipeIngredients\">";
	HTML += "<h2>Ingredients</h2><br>";
	HTML += "<ul>";

	for(let i = 0, ingredients = content.ingredients, length = ingredients.length; i < length; i += 1) {
		HTML += "<li>" + ingredients[i] + "</li>";
	}

	HTML += "</ul>";
	HTML += "</div>";
	HTML += "</div>";

	//Main

	HTML += "<div id=\"recipeMain\">";
	HTML += "<img id=\"recipeFoodImage\" src=\"" + content.foodImage + "\">";

	HTML += "<div id=\"recipeInfo\">";

	HTML += "<h1 id=\"recipeTitle\">" + content.title + "<hr></h1>";

	if(content.intro != "") {
		HTML += "<div id=\"recipeIntro\">" + content.intro + "<hr></div>";
	}

	let time;
	if(content.cooksIn > 60) {
		time = Math.floor(content.cooksIn / 60) + "hr " + content.cooksIn % 60 + "mins";
	} else {
		time = content.cooksIn + " minutes";
	}

	HTML += "<div id=\"recipeCookingInfo\">Cooks In: " + time + "<br>Serves: " + content.serves + "</div>";

	HTML += "</div>";

	HTML += "<div id=\"recipeMethod\">";
	HTML += "<h2>Method</h2><br>";
	

	if(content.method.length == 1) {
		HTML += "<p>" + content.method[0] + "</p>";
	} else {
		HTML += "<ol>";
		for(let i = 0, steps = content.method, length = steps.length; i < length - 1; i += 1) {
			HTML += "<li>" + steps[i] + "</li><br>";
		}
		HTML += "<li>" + content.method[content.method.length - 1] + "</li>";
		HTML += "</ol>";
	}

	HTML += "</div>";

	HTML += "</div>";

	//Right
	HTML += "<div id=\"recipeRight\">";

	HTML += "<h2>Recommened</h2>";

	if(content.related.length > 0) {
		for(let i = 0, related = content.related, length = related.length > 4? 4: related.length; i < length; i += 1) {
			HTML += "<div class=\"recommended\" id=\"" + related[i].id + "\">";

			HTML += "<div class=\"recommendedImg\" style=\"background-image: url('" + related[i].image + "')\"></div>";

			HTML += "<div class=\"recommendedTitle\"><h3>" + related[i].title + "</h3></div>";

			HTML += "</div>";
		}
	} else {
		HTML += "<br> No recommended recipes <br>";
	}
	HTML += "</div><br>";



	searchContainer.innerHTML = "";
	recipeContainer.innerHTML = HTML;
}