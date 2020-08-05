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
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
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

router.get("/:id", (req, res) => {
  let postID = req.params.id;

  Posts.findById(postID)
    .then((response) => {
      if (response.length === 0) {
        return res
          .status(404)
          .send({ message: "The post with the specified ID does not exist." });
      } else {
        return res.status(201).send(response);
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .send({ error: "The post information could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  let deletePost = req.params.id;

  Posts.remove(deletePost)
    .then((response) => {
      console.log(response);

      if (response === 0) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        return res.status(202).json({
          message: `Records of post with ID ${deletePost} have successfully been deleted`,
        });
      }
    })
    .catch((response) => {
      return res.status(500).json({ error: "The post could not be removed" });
    });
});

router.get("/:id/comments", (req, res) => {
  requestedPost = req.params.id;

  Posts.findPostComments(requestedPost)
    .then((response) => {
      console.log(response);

      if (response.length === 0) {
        return res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }

      return res.status(200).json(response);
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
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

            return res.status(404).send({
              error: "The post with the specified ID does not exist.",
            });
          });
      })
      .catch((error) => {
        console.log(error);

        return res
          .status(404)
          .send({ message: "The post with the specified ID does not exist." });
      });
  }
});

module.exports = router;
