var express = require("express"),
    app = express();

//Require our custom routes
//Ref: http://stackoverflow.com/a/6064205
require("./routes")(app);

app.listen(3000, function () {
  console.log("Twinprime Geckoboard proxy is now active!");
});