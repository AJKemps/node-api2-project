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

router.post("/:id/comments", (req, res) => {
  let postID = req.params.id;
  let newComment = {
    text: req.body.text,
    post_id: postID,
  };

  if (!newComment.text) {
    res
      .status(400)
      .send({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.findById(postID)
      .then((response) => {
        let postRequested = response;
        console.log(postRequested);

        Posts.insertComment(newComment)
          .then((response) => {
            console.log(response);

            Posts.findCommentById(response.id)
              .then((response) => {
                console.log(response);

                let commentReturned = response;

                return res.status(201).send(commentReturned);
              })
              .catch((error) => {
                console.log(error);

                return res.status(500).send({
                  error:
                    "There was an error while saving the comment to the database",
                });
              });
          })
          .catch((error) => {
            console.log(error);

            return res.status(500).send({
              error:
                "There was an error while saving the comment to the database",
            });
          });
      })
      .catch((error) => {
        console.log(error);

        res
          .status(404)
          .send({ message: "The post with the specified ID does not exist." });
      });
  }
});

module.exports = router;
