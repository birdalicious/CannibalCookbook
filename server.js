const app = require("./app.js");

// Update the chains for comment generation
const comments = require("./server/comments/comments.js");
comments.generateChains();

app.listen(80);