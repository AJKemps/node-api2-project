const express = require("express");
const postsRouter = require("./posts/posts-router");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send(`hello world`);
});

server.use("/api/posts", postsRouter);

const port = 4001;
server.listen(port, () => {
  console.log(`*** server running on http://localhost:${port}`);
});
