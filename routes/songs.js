require("dotenv").config();
const express = require("express");
const router = express.Router();

const Song = require("../models/song");
const Like = require("../models/like");
const ticketService = require("../services/support");
const spotifyService = require("../services/spotify");
const notFound = require("./notFound");
const handleErrors = require("./handleErrors");

router.get("/", async function (req, res, next) {
  try {
    if (Object.keys(req.query).length === 0) {
      const result = await Song.find().populate("likes", {
        user: 1,
        date: 1,
      });
      if (result?.length > 0) res.send(result);
      else res.sendStatus(204);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    if (Object.keys(req.query).length === 0) {
      const result = await Song.findById(id).populate("likes", {
        user: 1,
        date: 1,
      });
      if (result?.length > 0) res.send(result);
      else res.sendStatus(204);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

/* GET songs by title */
router.get("/", async function (req, res, next) {
  try {
    if (req.query.hasOwnProperty("title")) {
      const title = req.query.title.toLocaleLowerCase().trim();
      const regexTitle = new RegExp(`\\b${title}\\b`, "i");
      const result = await Song.find({ title: regexTitle }).populate("likes", {
        user: 1,
        date: 1,
      });
      if (result?.length > 0) res.send(result);
      else res.sendStatus(204);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

router.get("/spotify", async function (req, res, next) {
  try {
    const title = req.query.title.toLocaleLowerCase().trim();
    let artist = "";
    if (req.query.hasOwnProperty("artist")) artist = req.query.artist.trim();

    const response = await spotifyService.searchSongs(title, artist);
    if (response.status) {
      const result = { songs: [] };
      if (response.songs.tracks) {
        for (track of response.songs.tracks.items) {
          let newSong = {
            title: track.name,
            artists: [],
            albumCover: track.album.images[0].url,
            releaseDate: track.album.release_date,
            url: track.preview_url,
            spotifyId: track.id,
          };
          track.artists.forEach((artist) => {
            newSong.artists.push(artist.name);
          });
          result.songs.push(newSong);
        }
      }

      if (result.songs.length > 0) res.send(result);
      else res.sendStatus(204);
    } else {
      res.sendStatus(response.status);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const { title, artists, releaseDate, albumCover, url, lyrics, spotifyId } =
      req.body;
    const song = new Song({
      title,
      artists,
      releaseDate: new Date(releaseDate),
      albumCover,
      url,
      lyrics,
      spotifyId,
      likes: [],
    });
    await song.save();
    return res.sendStatus(201);
  } catch (err) {
    if (err?.code === 11000) res.status(409).send("Conflict: Duplicate");
    else next(err);
  }
});

router.post("/ticket", async function (req, res, next) {
  // it calls ms-support to post a new ticket
  try {
    const song = req.body;
    const result = ticketService
      .postTicketToChangeVideoUrl({
        id: song.id,
        url: song.url,
      })
      .then((value) => value);

    if (await result) {
      res.sendStatus(201);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/", async function (req, res, next) {
  try {
    const { id, url, lyrics } = req.body;
    if (Object.keys(req.query).length === 0) {
      const newInfo = {};
      if (typeof url !== "undefined") newInfo.url = url;
      if (typeof lyrics !== "undefined") newInfo.lyrics = lyrics;

      const result = await Song.findByIdAndUpdate(id, newInfo, {
        new: true,
      }).populate("likes", {
        user: 1,
        date: 1,
      });
      res.send(result);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const result = await Song.findByIdAndDelete(id);
    const deletedLikes = await Like.deleteMany({ song: id });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.use(notFound);

router.use(handleErrors);

module.exports = router;
