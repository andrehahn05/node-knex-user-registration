const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json());
app.use(routes);


const port = 3333;
app.listen(port, () =>
  console.log(`Server is up and running on port : ${port}`)
);

module.exports = app;

