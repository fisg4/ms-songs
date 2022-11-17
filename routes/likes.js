const express = require('express');
const crypto = require('crypto');

const router = express.Router();

let users = [
  {
    "id": 1,
    "email": "user1@email.com"
  },
  {
    "id": 2,
    "email": "user2@email.com"
  },
  {
    "id": 3,
    "email": "user3@email.com"
  }
]

let likes = [
  {
    "id": "9ec101ce-cf73-472e-9578-7db93e91469b",
    "user": 1,
    "song": "bd733288-3305-4b29-8c92-c629925fbb3c"
  },
  {
    "id": "bdbec1d7-49cf-40c0-b9aa-2a234332cb6a",
    "user": 1,
    "song": "9e05db06-e565-4bb2-98b4-79ac8cec0f03"
  },
  {
    "id": "a8a57dbd-1c4c-46e0-94f2-ddde251a654f",
    "user": 1,
    "song": "c2bc5007-edb4-47ee-8039-9081a3dcc5a4"
  },
  {
    "id": "78a0595f-17ee-4760-9e43-97f16f45cb7c",
    "user": 2,
    "song": "9095db3b-8ed0-4e25-92ed-d78c0d7ddeca"
  },
  {
    "id": "8ec4b189-7589-40dd-b35c-dc6aa8fdcd83",
    "user": 2,
    "song": "9e05db06-e565-4bb2-98b4-79ac8cec0f03"
  },
  {
    "id": "d07ff13e-d43a-4d0a-9812-877e15906df0",
    "user": 3,
    "song": "fd4e9edf-8931-4af0-a4f9-2a82208ea26b"
  },
  {
    "id": "72ad867f-434e-4fb2-abec-e9a4bfdeaa52",
    "user": 3,
    "song": "9e05db06-e565-4bb2-98b4-79ac8cec0f03"
  }
]

/* GET likes by userId or songId */
router.get('/', function (req, res, next) {
  const filter = req.query;
  let filteredLikes = [];

  if (filter.hasOwnProperty('userId'))
    filteredLikes = likes.filter(like => like.user === Number(filter.userId));

  else if (filter.hasOwnProperty('songId'))
    filteredLikes = likes.filter(like => like.song == filter.songId);

  if (filteredLikes.length)
    res.send(filteredLikes);
  else
    res.sendStatus(404);
});

router.post('/', function (req, res, next) {
  const like = req.body;
  const newlike = {
    "id": crypto.randomUUID(),
    "user": like.user,
    "song": like.song
  }
  likes.push(newlike);
  res.sendStatus(201);
});

router.delete('/:id', function (req, res, next) {
  const id = req.params.id;
  likes = likes.filter(like => like.id !== id);
  res.sendStatus(204);
});

module.exports = router;
