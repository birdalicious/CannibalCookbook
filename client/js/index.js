var searchBox = document.getElementById("searchBox");

searchBox.addEventListener("keyup", function(event) {
	// Number 13 is the "Enter" key on the keyboard
	if (event.keyCode === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		
		let query = this.value;
		
		fetch("/api/recipes/search?q=" + query)
		.then(response => response.text())
		.then(body => {
			console.log(body)
		})
	}
});