const app = require("./app.js");

// Update the chains for comment generation
const comments = require("./server/comments/comments.js");
comments.generateChains();

// app.listen(80);

app.listen(process.env.PORT || 80, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});