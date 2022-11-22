const express = require("express");
const crypto = require("crypto");

const router = express.Router();

let songs = require("../data/db").songs;

router.get("/", function (req, res, next) {
  if (Object.keys(req.query).length === 0) res.send(songs);
  else if (req.query.hasOwnProperty("title")) next();
  else res.sendStatus(404);
});

router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  const result = songs.find((song) => {
    return song.id == id;
  });
  if (result) res.send(result);
  else next();
});

/* GET songs by title */
router.get("/", function (req, res, next) {
  const title = req.query.title.toLocaleLowerCase().trim();
  const result = songs.filter((song) => {
    return song.title.toLocaleLowerCase().includes(title);
  });
  if (result) res.send(result);
  else res.sendStatus(404);
});

router.post("/", function (req, res, next) {
  const song = req.body;
  const newSong = {
    id: crypto.randomUUID(),
    title: song.title,
    artists: song.artists,
    genre: song.genre,
    date: song.date,
    lyrics: typeof song.lyrics !== "undefined" ? song.lyrics : "",
    url: typeof song.url !== "undefined" ? song.url : "",
  };
  songs.push(newSong);
  res.sendStatus(201);
});

router.put("/", function (req, res, next) {
  const song = req.body;
  const result = songs.find((s) => {
    return s.id == song.id;
  });
  if (result) {
    if (typeof song.lyrics !== "undefined") result.lyrics = song.lyrics;
    if (typeof song.url !== "undefined") result.url = song.url;
    res.send(result);
  } else {
    res.sendStatus(400);
  }
});

router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  songs = songs.filter((song) => song.id !== id);
  res.sendStatus(204);
});

module.exports = router;
