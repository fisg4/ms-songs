const express = require("express");
const debug = require('debug')('ms-songs:server');

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
      const result = await Like.$where('this.user == "'+ filter.userId +'"')
        .populate('song', {
          title: 1,
          artists: 1,
          albumCover: 1
        }
      );
      if (result.length > 0) res.send(result.map(like => like.cleanUser()));
      else res.sendStatus(204);

    } else if (filter.hasOwnProperty("songId")) {
      const result = await Like.$where('this.song == "'+ filter.songId +'"')
        .populate('user', {
          username: 1
        }
      );
      if (result.length > 0) res.send(result.map(like => like.cleanSong()));
      else res.sendStatus(204);

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
      const alreadyExists = Like.alreadyExists(songId, userId);
      if (!alreadyExists) {
        const savedLike = await like.save();
        user.likes = user.likes.concat(savedLike._id);
        song.likes = song.likes.concat(savedLike._id);
        user.save();
        song.save();
        res.sendStatus(201);
      } else {
        res.status(409).send('Conflict: Duplicate');
      }
    } else {
      next();
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
  res.sendStatus(400).end();
});

router.use((err, req, res, next) => {
  console.log(err);
  debug("DB problem", err);
  if (err.name === "CastError") res.sendStatus(400).end();
  else res.sendStatus(500).end();
});

module.exports = router;
