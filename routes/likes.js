const express = require("express");
const crypto = require("crypto");

const router = express.Router();

let likes = require("../data/db").likes;

/* GET likes by userId or songId */
router.get("/", function (req, res, next) {
  const filter = req.query;
  let filteredLikes = [];

  if (filter.hasOwnProperty("userId"))
    filteredLikes = likes.filter(
      (like) => like.user.id === Number(filter.userId)
    );
  else if (filter.hasOwnProperty("songId"))
    filteredLikes = likes.filter((like) => like.song.id == filter.songId);

  if (filteredLikes.length) res.send(filteredLikes);
  else res.sendStatus(404);
});

router.post("/", function (req, res, next) {
  const like = req.body;
  const newlike = {
    id: crypto.randomUUID(),
    user: like.user,
    song: like.song,
  };
  likes.push(newlike);
  res.sendStatus(201);
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  likes = likes.filter((like) => like.id !== id);
  res.sendStatus(204);
});

module.exports = router;
