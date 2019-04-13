/*eslint no-console: ["error", { allow: ["log","warn", "error"] }] */

var comments = require("./comments.json");
const seedrandom = require("seedrandom");
const fs = require("fs");

function getComments(id, callback) {
	let comments;
	getCharacterComments(id)
		.then(characterComments => {
			comments = characterComments;

			return getUserComments(id);
		})
		.then(userComments => {
			comments.push.apply(comments, userComments);

			callback({
				status: 200,
				data: comments
			});
		})
		.catch(err => callback({
			status: 500,
			data: err
		}));
}

function getUserComments(id) {
	return new Promise((resolve, reject) => {
		try{
			if(comments.userSubmitted[id]) {
				resolve(comments.userSubmitted[id]);
			} else {
				resolve([]);
			}
		} catch(err) {
			reject(err);
		}
	});
}

function submitUserComment(id, name, comment) {
	return new Promise((resolve, reject) => {
		try {
			if(!comments.userSubmitted[id]) {
				comments.userSubmitted[id] = [];
			}

			//check the same comment doesn't exist
			let userComments = comments.userSubmitted[id];
			for(let i = 0, length = userComments.length; i < length; i += 1) {
				if(userComments[i].name == name && userComments[i].comment == comment) {
					resolve(200);
					return;
				}
			}

			comments.userSubmitted[id].push({
				name: name,
				comment: comment
			});

			fs.writeFile("./server/comments.json", JSON.stringify(comments), err => {
				if(err) {
					reject(err);
				}
				resolve(201);
			});
		} catch(err) {
			reject(err);
		}
	});
}

function getCharacterComments(id) {
	return new Promise((resolve, reject) => {
		try {
			const characterCommentChance = 0.25;

			let rng = seedrandom(parseInt(id));
			let results = [];

			for(let i = 0; i < comments.characters.length; i += 1) {
				if(rng() < characterCommentChance) {
					let character = comments.characters[i];

					let text = comments.sourceText[character].split(" ");
					let textLength = text.length;
					
					//Get starting point
					let j = Math.floor(rng()*textLength);
					let lastCharacter = text[j][text[j].length - 1];
					while(lastCharacter != ".") {
						j += 1;
						j %= textLength;

						lastCharacter = text[j][text[j].length - 1];
					}
					j += 1;
					j %= textLength;

					let chain = comments.chains[character];
					let comment = [text[j]];

					let condition = true;
					while(condition) {
						let threshold = rng();
						let following = chain[comment[comment.length -1]];
						let thresholds = Object.keys(following);
						let next;
						for(let k = 0, length = thresholds.length; k < length -1; k +=1 ){
							if(threshold > parseInt(thresholds[k])) {
								next = following[thresholds[k]];
							}
						}
						if(!next) {
							next = following[thresholds[thresholds.length - 1]];
						}
						// console.log(next);
						comment.push(next);
						
						let lastCharacter = next[next.length -1];
						if((lastCharacter == "." || lastCharacter == "?" || lastCharacter == "!") && rng() < 0.75) {
							comment = comment.join(" ");
							condition = false;
						}
					}

					results.push({
						name: character,
						comment: comment
					});
				}
			}

			resolve(results);
		} catch(err) {
			reject(err);
		}
	});
}

function generateChains() {
	return new Promise((resolve, reject) => {
		try {
			for(let i = 0; i < comments.characters.length; i += 1) {
				let character = comments.characters[i];
				let source = comments.sourceText[character].split(" ");
				let chain = {};

				//Get frequency of words following other words
				for(let j = 0, length = source.length; j < length -1; j += 1) {
					let word = source[j];
					let following = source[j +1];
					if(!chain[word]) {
						chain[word] = {};
					}

					if(chain[word][following]) {
						chain[word][following] = chain[word][following] +1;
					} else {
						chain[word][following] = 1;
					}		
				}

				//Turn frequencies into thresholds
				for(let j = 0, keys = Object.keys(chain), length = keys.length; j < length; j += 1) {
					let key = keys[j];
					let total = 0;
					for(let k = 0, subKeys = Object.keys(chain[key]); k < subKeys.length; k += 1) {
						let subKey = subKeys[k];
						total += chain[key][subKey];
					}

					let lower = 0;
					for(let k = 0, subKeys = Object.keys(chain[key]); k < subKeys.length; k += 1) {
						let subKey = subKeys[k];
						chain[key][subKey] = lower + (chain[key][subKey]/total);
						lower = chain[key][subKey];
					}

					//Flip the keys so the threshold point to the following word
					for(let k = 0, subKeys = Object.keys(chain[key]); k < subKeys.length; k += 1) {
						let subKey = subKeys[k];
						let threshold = chain[key][subKey];
						chain[key][threshold] = subKey;
						delete chain[key][subKey];
					}

				}

				comments.chains[character] = chain;
			}

			fs.writeFile("./server/comments.json", JSON.stringify(comments), err => {
				if(err) {
					reject(err);
				}
				resolve(201);
			});
		} catch(err) {
			reject(err);
		}
	});
}

module.exports = {
	getComments: getComments,
	getUserComments: getUserComments,
	submitUserComment: submitUserComment,
	generateChains: generateChains,
	getCharacterComments: getCharacterComments
};