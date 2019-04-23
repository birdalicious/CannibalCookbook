# Cannibal Cookbook API

## People Endpoints:
Fetches data from wikipedia's API and formats it in a useful way.

### `/api/people/search/:query/` *GET*
Searches wikipedia for entries that match the query and selects the results which are people.
#### Encoded Variables
`:query` **string** the query string used to search wikipida.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **array** of **objects**.
	* `id` **number** unique page identifier used by wikipedia.
	* `title` **string** the title of the wikipedia page.
	* `description` **string** the short description of the person provided by wikipedia. If wikipedia doesn't have a short description then the string is empty.
	* `image` **string** the url of a picture of the person provided by wikipedia. If there is no image of wikipedia then this is an empty string.

### `/api/people/pageInfo/:id/` *GET*
Gets infomation about a single person and some simple information about people that have links to that person.
#### Encoded Variables
`:id` **number** the unique identifier of a wikipedia page. If the id provided doesn't link to a person the response will give a 4** code.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **object**.
	* `id` **number** same id as the id provided in the encoded variable.
	* `title` **string** the title of the wikipedia page.
	* `description` **string** the short description of the person provided by wikipedia. If wikipedia doesn't have a short description then the string is empty.
	* `image` **string** the url of a picture of the person provided by wikipedia. If there is no image of wikipedia then this is an empty string.
	* `related` **array** of **objects** people that are linked on main person's wikipedia page, limited to 4 people.
		* `id` **number** unique page identifier used by wikipedia.
		* `title` **string** title of the wikipedia page linked on the main person's page
		* `image` **string** url of image of this person provided by wikipedia. If there is no image this is an empty string.

## Recipes Endpoints:
Uses the people data and combines it with some preformatted recipe data.

### `/api/recipes/homepage/` *GET*
A set of predefined recipes to provide.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **array** of **objects**.
	* `id` **number** unique page identifier used by wikipedia.
	* `title` **string** title of the recipe.
	* `description` **string** this is either the short description from wikipedia, the introduction of the recipe, or a predefined string based on whether these peices of data exist.
	* `image` **string** the url of an image, either of the person or the food dish depending on if there is a wikipedia image.
	* `serves` **number** the nuber of people the recipe serves.
	* `cooksIn` **number** amount of time in minutes it takes to prepare the recipe.

### `/api/recipes/search/:query/` *GET*
Searches people that match the query and returns recipes that are made with those people.
#### Encoded Variables
`:query` **string** the query string used to search for recipes, search by people's names.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **array** of **objects**.
	* `id` **number** unique page identifier used by wikipedia.
	* `title` **string** title of the recipe.
	* `description` **string** this is either the short description from wikipedia, the introduction of the recipe, or a predefined string based on whether these peices of data exist.
	* `image` **string** the url of an image, either of the person or the food dish depending on if there is a wikipedia image.
	* `serves` **number** the nuber of people the recipe serves.
	* `cooksIn` **number** amount of time in minutes it takes to prepare the recipe.

### `/api/recipes/recipe/:id/` *GET*
Gets the full recipe of a person and some simple recipe information of related people.
#### Encoded Variables
`:id` **number** the unique identifier of a wikipedia page. If the id provided doesn't link to a person the response will give a 4** code.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **object**.
	* `id` **number** same id as the id provided in the encoded variable.
	* `title` **string** title of the recipe.
	* `intro` **string** introduction to the recipe, can be an empty string.
	* `foodImage` **string** url of the image of the food dish.
	* `personImage` **string** url of the image of the person the recipe is about. Can be an empty string if ther is no image of the person.
	* `serves` **number** the nuber of people the recipe serves.
	* `cooksIn` **number** amount of time in minutes it takes to prepare the recipe.
	* `ingredients` **array** of **strings** each an ingredient for the recipe
	* `method` **array** of **strings** each a step in the recipe, can be an array of length 1 with all the steps in paragraphs.
	* `related` **array** of **objects** recipes of people with links to this person, max length of 4.
		* `id` **number** unique page identifier used by wikipedia.
		* `title` **string** title of the recipe.
		* `image` **string** url of an image of the person or the food dish depending on what data is available.

## Comments Endpoints:
Get and post user submitted comments for specific recipes and also get some generated comments.

### `/api/comments/:id/` *GET*
Gets a combination of user submitted comments and generated comments for the page id provided.

#### Encoded Variables
`:id` **number** the unique identifier of a wikipedia page.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **array** of **objects** each a comment.
	* `name` **string** the name of the person who created the comment or the name of the character the comment is generated for. 
	* `comment` **string** the comment.

### `/api/comments/` *POST*
Submit a comment.

#### Encoded Variables *JSON*
* `id` **number** the id of the page the comment is associated with.
* `auth` **string** auth code to allow you to edit server resources.
* `name` **string** your name.
* `comment` **string** your comment.

*All are required*

#### Response *JSON*
* `status` **number** the status code of the response. 201 if the comment was submitted, 200 if the comment already existed.
* `data` blank object if everything went well, can be an error, string, or blank depending on the error that occured.