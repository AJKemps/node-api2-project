const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.find({})
    .then((postdata) => {
      res.status(200).json({ data: postdata });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.message });
    });
});

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).send({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    Posts.insert(req.body)
      .then((postID) => {
        Posts.findById(postID.id).then((postBody) => {
          res.status(201).json({ data: postBody });
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

module.exports = router;
