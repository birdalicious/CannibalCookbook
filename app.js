const express = require("express");
const fetch = require("node-fetch");

const wiki = require("./server/wikiSearch.js")

const app = express();

app.use("/", express.static("client"));

app.get("/wiki", function(req, resp){
	search = req.query.q;

	wiki(search);

	resp.send("working")



	// fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=" + search)
	// .then(response => response.text())
	// .then((body) => {
	// 	let obj = JSON.parse(body).query.search;

	// 	// console.log(obj);
	// 	// resp.send()

	// 	let string = ""

	// 	for(let i = 0, length = obj.length; i < length; i += 1) {
	// 		string += obj[i].pageid + ", "
	// 	}

	// 	resp.send(string);
	// })

	// // resp.send(req.query)
});

module.exports = app;