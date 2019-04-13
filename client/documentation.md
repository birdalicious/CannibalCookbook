# Index.js

## homepage
Called as soon as the page is loaded and populates the page with some predefined search results from a get request to the search.

## searchBox EventListener
Stops the default action of a form submit when the enter key is pressed and sends a get request to the endpoint `/api/recipes/search/ + query` to get the recipes.

Then populates the screen with data it receives, if there is an error or no data an appropriate message is displayed.

## fillInSearch(body)
body is the direct response of the api. Takes all the search results and puts it in HTML to be displayed. Handles any errors and displays the approprate message.

## fillInRecipe(body)
body is the direct response of the api. Turns the JSON into HTML to display, do not handle any error status codes.

## fillInComments(body)
body is the direct response of the api. Turns the comments JSON into HTML. Handles errors where status code is not 200.

## clickSearchResult()
Function to bind to event listeners. Gets the elements id and uses it to get the recipe information from the endpoint `/api/recipes/recipe/ + id`. Then it fills in the page with the recipe information and gets comment data from `/api/comments/ + id` and fills in that data using `fillInRecipe` and `fillInComments`.

## clickCommentAdd()
Function to bind to the event listener for the add button in the comments section. Switches the button between an 'add' button and a 'submit' button.

The 'add' functionality creates a form for the user to input their comment, changing the 'add' button to a 'submit' button.

The 'submit' functionality checks all the data is there then sends it to the api via a post request to `/api/comments/`. Then it reloads the commets from the api and refills the comments section. The button then goes back to being an 'add' button.