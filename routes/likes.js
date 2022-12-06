const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const Like = require("../models/like");
const Song = require("../models/song");
const User = require("../models/user");
const userService = require("../services/users");

/* GET likes by userId or songId */
router.get("/", async function (req, res, next) {
  try {
    const filter = req.query;

    if (filter.hasOwnProperty("userId")) {
      console.log(filter.userId);
      const result = await Like.$where('this.user == "'+ filter.userId +'"');
      res.send(result);

    } else if (filter.hasOwnProperty("songId")) {
      console.log(filter.songId);
      const result = await Like.$where('this.song == "'+ filter.songId +'"');
      res.send(result);

    } else {
      next();
    }
  } catch(err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const {songId, userId} = req.body;
    const like = new Like({
      song: songId,
      user: userId
    });
    const user = await userService.getUserById(userId);
    const song = await Song.findById(songId);

    if (user && song) {
      const savedLike = await like.save();
      user.likes = user.likes.concat(savedLike._id);
      song.likes = song.likes.concat(savedLike._id);
      user.save();
      song.save();
      res.sendStatus(201);

      console.log(user);
      console.log(song);
      console.log(savedLike);
    } else {
      res,sendStatus(400);
    }

  } catch(err) {
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const result = await Like.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
});

router.use((req, res, next) => {
  res.sendStatus(404).end();
});

router.use((err, req, res, next) => {
  console.log(err);
  debug("DB problem", err);
  if (err.name === "CastError") res.sendStatus(400).end();
  else res.sendStatus(500).end();
});

module.exports = router;
