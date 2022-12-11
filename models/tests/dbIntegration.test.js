const mongoose = require("mongoose");
const Song = require("../song");
const dbConnect = require("../../db");

describe("Songs DB connection", () => {
  beforeAll(() => {
    return dbConnect();
  });

  beforeEach((done) => {
    Song.deleteMany({}, (err) => {
      done();
    });
  });

  it("Writes a song in the database", (done) => {
    const song = new Song({
      title: "Duki: Bzrp Music Sessions, Vol. 50",
      artists: ["Bizarrap", "Duki"],
      releaseDate: "2022-11-16",
      albumCover: "http://tocoversong.com/d78c0d7",
      lyrics: "",
      url: "https://www.youtube.com/watch?v=Gzs60iBgd3E&ab_channel=Bizarrap",
      spotifyId: "d78c0d7",
      likes: [],
    });
    song.save((err, song) => {
      expect(err).toBeNull();
      Song.find({}, (err, songs) => {
        expect(songs).toBeArrayOfSize(1);
        done();
      });
    });
  });

  afterAll((done) => {
    const connectionClosed = mongoose.connection.db.dropDatabase();
    connectionClosed.then((isClosed) => {
      if (isClosed) mongoose.connection.close(done);
    });
  });
});
