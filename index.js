const express = require("express");

const server = express();

server.use(express.json());

server.listen(4001, () => {
  console.log("*** server running on http://localhost:4001");
});

server.get("/", (req, res) => {
  res.send(`hello world`);
});
