require("dotenv").config();

const mongoose = require("mongoose");
const Song = require("../../song");
const Like = require("../../like");
const dbConnect = require("../../../db");

describe("Microservice integration tests with database", () => {
  let songId, song;

  beforeAll(() => {
    return dbConnect();
  });

  it("Writes a song in the database", async () => {
    song = await Song.create({
      title: "Shakira: Bzrp Music Sessions, Vol. 53",
      artists: ["Bizarrap", "Shakira"],
      releaseDate: "2023-01-11",
      albumCover:
        "https://i.scdn.co/image/ab67616d0000b273511a66760837c2496d3375ca",
      lyrics: "",
      audioUrl:
        "https://p.scdn.co/mp3-preview/7cb90e276c88316ad14f268ebe52a6f04bbddfea?cid=4719ec888a3d4d1099df0534d0e98f41",
      spotifyId: "4nrPB8O7Y7wsOCJdgXkthe",
      likes: [],
    });
    songId = song._id;
    const songs = await Song.find({});
    expect(song).not.toBeNull();
    expect(song.title).toBe("Shakira: Bzrp Music Sessions, Vol. 53");
    expect(songs.length).toBe(1);
  });

  it("Return error if song already exists", async () => {
    try {
      await Song.create({
        title: "Shakira: Bzrp Music Sessions, Vol. 53",
        artists: ["Bizarrap", "Shakira"],
        releaseDate: "2023-01-11",
        albumCover:
          "https://i.scdn.co/image/ab67616d0000b273511a66760837c2496d3375ca",
        lyrics: "",
        audioUrl:
          "https://p.scdn.co/mp3-preview/7cb90e276c88316ad14f268ebe52a6f04bbddfea?cid=4719ec888a3d4d1099df0534d0e98f41",
        spotifyId: "4nrPB8O7Y7wsOCJdgXkthe",
        likes: [],
      });
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });

  it("Get a song by id", async () => {
    const song = await Song.findById(songId);
    expect(song).not.toBeNull();
    expect(song.title).toBe("Shakira: Bzrp Music Sessions, Vol. 53");
  });

  it("Writes a like in the database", async () => {
    const like = await Like.create({
      song: songId,
      user: {
        id: "5f9f1b9f0f5ae127f8c9b1f3",
        username: "testUser",
      },
      date: "2021-11-16",
    });
    const likes = await Like.find({});
    expect(likes.length).toBe(1);
    expect(like).not.toBeNull();
    expect(like.song).toBe(songId);
    expect(like.user.username).toBe("testUser");
  });

  it("Return error if like already exists", async () => {
    try {
      await Like.create({
        song: songId,
        user: {
          id: "5f9f1b9f0f5ae127f8c9b1f3",
          username: "testUser",
        },
        date: "2021-11-16",
      });
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });

  it("Get a like by user id", async () => {
    const like = await Like.findOne({
      "user.id": "5f9f1b9f0f5ae127f8c9b1f3",
    });
    expect(like).not.toBeNull();
    expect(like.user.username).toBe("testUser");
  });

  it("Return an already existing like", async () => {
    const like = new Like({
      song,
      user: {
        id: "5f9f1b9f0f5ae127f8c9b1f3",
        username: "testUser",
      },
      date: "2021-11-16",
    });
    const res = await Like.alreadyExists(song._id, like.user.id);
    expect(res).not.toBe(false);
  });

  it("Delete a like from the database", async () => {
    await Like.deleteMany({});
    const like = await Like.create({
      song: songId,
      user: {
        id: "5f9f1b9f0f5ae127f8c9b1f9",
        username: "testUser",
      },
      date: "2021-11-16",
    });
    const likes = await Like.find({});
    expect(likes.length).toBe(1);
    await Like.findByIdAndDelete(like._id);
    const likesAfterDelete = await Like.find({});
    expect(likesAfterDelete.length).toBe(0);
  });

  afterAll((done) => {
    Song.deleteMany({}, (err) => {
      done();
    });
    Like.deleteMany({}, (err) => {
      done();
    });

    const connectionClosed = mongoose.connection.db.dropDatabase();
    connectionClosed.then((isClosed) => {
      if (isClosed) mongoose.connection.close(done);
    });
  });
});

describe("Method testing of microservice models", () => {
  let song;

  beforeAll(() => {
    song = new Song({
      title: "Shakira: Bzrp Music Sessions, Vol. 53",
      artists: ["Bizarrap", "Shakira"],
      releaseDate: "2023-01-11",
      albumCover:
        "https://i.scdn.co/image/ab67616d0000b273511a66760837c2496d3375ca",
      lyrics: "",
      audioUrl:
        "https://p.scdn.co/mp3-preview/7cb90e276c88316ad14f268ebe52a6f04bbddfea?cid=4719ec888a3d4d1099df0534d0e98f41",
      spotifyId: "4nrPB8O7Y7wsOCJdgXkthe",
      likes: [],
    });
  });

  it("Try the cleanUser method", () => {
    const like = new Like({
      song,
      user: {
        id: "5f9f1b9f0f5ae127f8c9b1f3",
        username: "testUser",
      },
      date: "2021-11-16",
    });
    const cleanLike = like.cleanUser();
    expect(cleanLike).not.toBeNull();
    expect(cleanLike.user).not.toBeDefined();
  });

  it("Try the cleanSong method", () => {
    const like = new Like({
      song,
      user: {
        id: "5f9f1b9f0f5ae127f8c9b1f3",
        username: "testUser",
      },
      date: "2021-11-16",
    });
    const cleanLike = like.cleanSong();
    expect(cleanLike).not.toBeNull();
    expect(cleanLike.song).not.toBeDefined();
  });
});
