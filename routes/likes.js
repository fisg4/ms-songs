const express = require("express");
const passport = require("passport");

const router = express.Router();

const Like = require("../models/like");
const Song = require("../models/song");
const userService = require("../services/users");
const notFound = require("./notFound");
const handleErrors = require("./handleErrors");

/* GET likes by userId or songId */
router.get("/", async function (req, res, next) {
  try {
    const filter = req.query;

    if (filter.hasOwnProperty("userId")) {
      const result = await Like.find()
        .where("user._id")
        .equals(filter.userId)
        .populate("song", {
          title: 1,
          artists: 1,
          albumCover: 1,
        });
      if (result?.length > 0) res.send(result.map((like) => like.cleanUser()));
      else res.sendStatus(204);

    } else if (filter.hasOwnProperty("songId")) {
      const result = await Like.find()
        .where("song")
        .equals(filter.songId)
        .populate("user", {
          username: 1,
        });
      if (result?.length > 0) res.send(result.map((like) => like.cleanSong()));
      else res.sendStatus(204);

    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const { songId, userId } = req.body;
      const { user } = await userService.getUserById(userId);
      const song = await Song.findById(songId);

      const like = new Like({
        song: songId,
        user,
      });

      if (user && song) {
        const alreadyExists = await Like.alreadyExists(songId, user._id);
        if (!alreadyExists) {
          const savedLike = await like.save();
          song.likes = song.likes.concat(savedLike._id);
          song.save();
          res.sendStatus(201);
        } else {
          throw new Error("Duplicate like");
        }
      } else {
        throw new Error("Invalid song or user");
      }
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async function (req, res, next) {
    try {
      const id = req.params.id;
      const result = await Like.findByIdAndDelete(id);
      res.sendStatus(204);
    } catch (err) {
      err = new Error("Failed to delete like")
      next(err);
    }
  }
);

router.use(notFound);

router.use(handleErrors);

module.exports = router;
