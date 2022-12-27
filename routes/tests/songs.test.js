const app = require("../../app");
const Song = require("../../models/song");
const Like = require("../../models/like");
const request = require("supertest");
const spotifyService = require("../../services/spotify");
const ticketService = require("../../services/support");

const BASEPATH_ENDPOINT = "/api/v1";
const TEST_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYTYzYzVlMDcyMjFjMzM2ODM4NzUyZiIsInJvbGUiOiJ1c2VyIiwicGxhbiI6ImZyZWUiLCJ1c2VybmFtZSI6Im1ydWFubyIsImVtYWlsIjoibXJ1YW5vQHVzLmVzIiwiaWF0IjoxNjcxODc5ODMwfQ.EDfJ-XZHpdEeIMQtlU83hlMo-1aV3fWLPQDeajeCpB0"

const songs = [
  {
    title: "Duki: Bzrp Music Sessions, Vol. 50",
    artists: ["Bizarrap", "Duki"],
    releaseDate: "2022-11-16",
    albumCover: "http://tocoversong.com/d78c0d7",
    lyrics: "",
    url: "https://www.youtube.com/watch?v=Gzs60iBgd3E&ab_channel=Bizarrap",
    spotifyId: "d78c0d7",
    likes: [],
    id: "639266d51f1d8d5c46e31c3f",
  },
  {
    title: "Hey Mor",
    artists: ["Ozuna", "Feid"],
    releaseDate: "2022-10-07",
    albumCover: "http://tocoversong.com/9095db3b",
    lyrics: "",
    url: "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna",
    spotifyId: "9095db3b",
    likes: [],
    id: "639319967a53a5498109fcb0",
  },
];

describe("Songs API", () => {
  describe("GET /songs", () => {
    it("Should return all the songs in the system", async () => {
      const findMock = jest.spyOn(Song, "find");
      const populateMock = jest.fn(() => songs);

      findMock.mockImplementation(() => {
        return {
          populate: populateMock,
        };
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/songs`);
      expect(findMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("json"));
      expect(response.body).toBeArrayOfSize(2);
    });

    it("Should return No Content state if there no songs in the system", async () => {
      const findMock = jest.spyOn(Song, "find");
      const populateMock = jest.fn();

      findMock.mockImplementation(() => {
        return {
          populate: populateMock,
        };
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/songs`);
      expect(findMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(204);
    });

    it("Should return Internal Server Error if there is an error in the database", async () => {
      const findMock = jest.spyOn(Song, "find");
      const populateMock = jest.fn(() => {
        throw new Error("Internal Server Error");
      });

      findMock.mockImplementation(() => {
        return {
          populate: populateMock,
        };
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/songs`);
      expect(findMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(500);
    });

    it("Should return 404 if the song is not found", async () => {
      const response = await request(app).get(
        `${BASEPATH_ENDPOINT}/songs/639266d51f1d8d5c46e31c21`
      );
      expect(response.status).toBe(404);
    });

    it("Should return a song by id", async () => {
      const findByIdMock = jest.spyOn(Song, "findById");
      const populateMock = jest.fn(() => songs[0]);

      findByIdMock.mockImplementation(() => {
        return {
          populate: populateMock,
        };
      });

      const response = await request(app).get(
        `${BASEPATH_ENDPOINT}/songs/639266d51f1d8d5c46e31c3f`
      );
      expect(findByIdMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("json"));
      expect(response.body).toEqual(songs[0]);
    });

    it("Should return a song by title", async () => {
      const findMock = jest.spyOn(Song, "find");
      const populateMock = jest.fn(() => [songs[1]]);

      findMock.mockImplementation(() => {
        return {
          populate: populateMock,
        };
      });

      const response = await request(app).get(
        `${BASEPATH_ENDPOINT}/songs?title=Hey Mor`
      );
      expect(findMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("json"));
      expect(response.body).toEqual([songs[1]]);
    });

    it("Should return 204 if the song is not found by title", async () => {
      const findMock = jest.spyOn(Song, "find");
      const populateMock = jest.fn(() => []);

      findMock.mockImplementation(() => {
        return {
          populate: populateMock,
        };
      });

      const response = await request(app).get(
        `${BASEPATH_ENDPOINT}/songs?title=Hey Mor`
      );
      expect(findMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(204);
    });

    it("Should return a searched song in Spotify", async () => {
      const searchMock = jest.spyOn(spotifyService, "searchSongs");

      searchMock.mockImplementation(() => {
        return {
          status: 200,
          songs: {
            tracks: {
              items: [
                {
                  name: "Hey Mor",
                  artists: [{ name: "Ozuna" }, { name: "Feid" }],
                  releaseDate: "2022-10-07",
                  album: {
                    images: [
                      {
                        url: "http://tocoversong.com/9095db3b",
                      },
                    ],
                    release_date: "2022-10-07",
                  },
                  preview_url:
                    "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna",
                  id: "9095db3b",
                },
              ],
            },
          },
        };
      });

      const response = await request(app).get(
        `${BASEPATH_ENDPOINT}/songs/spotify?title=hey mor`
      );
      expect(searchMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("json"));
    });
  });

  describe("POST /songs/ticket", () => {
    it("Should post a ticket to ms-support", async () => {
      const ticketServiceMock = jest.spyOn(
        ticketService,
        "postTicketToChangeVideoUrl"
      );

      ticketServiceMock.mockImplementation(() => {
        return {
          status: 201,
          ticket: {},
        };
      });

      const response = await request(app)
        .post(`${BASEPATH_ENDPOINT}/songs/ticket`)
        .send({
          songId: "639266d51f1d8d5c46e31c3f",
          videoUrl:
            "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna",
          userId: "632266d51f1d8d5c46e31109",
        }).set(
          "Authorization",
          "Bearer " + TEST_JWT
        );
      expect(ticketServiceMock).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.type).toEqual(expect.stringContaining("json"));
    });
  });

  describe("POST /songs", () => {
    it("Should post a song", async () => {
      const saveSongMock = jest.spyOn(Song.prototype, "save");

      saveSongMock.mockImplementation(() => {
        return {
          status: 201,
          song: songs[1],
        };
      });

      const response = await request(app)
        .post(`${BASEPATH_ENDPOINT}/songs`)
        .send({
          title: "Hey Mor",
          artists: ["Ozuna"],
          album: "Nibiru",
          releaseDate: "2022-10-07",
          albumCover: "http://tocoversong.com/9095db3b",
          videoUrl:
            "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna",
          audioUrl: "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab.mp3",
          lyrics: "",
          spotifyId: "9095db3b",
        }).set(
          "Authorization",
          "Bearer " + TEST_JWT
        );
      expect(saveSongMock).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.type).toEqual(expect.stringContaining("json"));
      expect(response.body.title).toEqual("Hey Mor");
    });

    it("Should return 409 if the song already exists", async () => {
      const saveSongMock = jest.spyOn(Song.prototype, "save");

      saveSongMock.mockImplementation(() => {
        throw {
          code: 11000,
        };
      });

      const response = await request(app)
        .post(`${BASEPATH_ENDPOINT}/songs`)
        .send({
          title: "Hey Mor",
          artists: ["Ozuna"],
          album: "Nibiru",
          releaseDate: "2022-10-07",
          albumCover: "http://tocoversong.com/9095db3b",
          videoUrl:
            "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna",
          audioUrl: "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab.mp3",
          lyrics: "",
          spotifyId: "9095db3b",
        }).set(
          "Authorization",
          "Bearer " + TEST_JWT
        );
      expect(saveSongMock).toHaveBeenCalled();
      expect(response.status).toBe(409);
      expect(response.type).toEqual(expect.stringContaining("text"));
    });
  });

  describe("PUT /songs", () => {
    it("Should update a song", async () => {
      const updateSongMock = jest.spyOn(Song, "findByIdAndUpdate");
      const populateMock = jest.fn(() => songs[1]);

      updateSongMock.mockImplementation(() => {
        return {
          populate: populateMock,
        };
      });

      const response = await request(app)
        .put(`${BASEPATH_ENDPOINT}/songs`)
        .send({
          id: "639266d51f1d8d5c46e31c3f",
          lyrics: "",
          url: "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna",
        }).set(
          "Authorization",
          "Bearer " + TEST_JWT
        );
      expect(updateSongMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("json"));
      expect(response.body.title).toEqual("Hey Mor");
    });
  });

  describe("DELETE /songs", () => {
    it("Should delete a song", async () => {
      const deleteSongMock = jest.spyOn(Song, "findByIdAndDelete");
      const deleteLikesMock = jest.spyOn(Like, "deleteMany");

      deleteSongMock.mockImplementation(() => {
        return {
          status: 200,
        };
      });

      deleteLikesMock.mockImplementation(() => {
        return {
          status: 200,
        };
      });

      const response = await request(app).delete(
        `${BASEPATH_ENDPOINT}/songs/639266d51f1d8d5c46e31c3f`
      ).set(
        "Authorization",
        "Bearer " + TEST_JWT
      );
      expect(deleteSongMock).toHaveBeenCalled();
      expect(deleteLikesMock).toHaveBeenCalled();
      expect(response.status).toBe(204);
    });

    it("Should return 404 if the song does not exist", async () => {
      const deleteSongMock = jest.spyOn(Song, "findByIdAndDelete");
      const deleteLikesMock = jest.spyOn(Like, "deleteMany");

      deleteSongMock.mockImplementation(() => {
        return null
      });

      const response = await request(app).delete(
        `${BASEPATH_ENDPOINT}/songs/639266d51f1d8d5c46e31c3f`
      ).set(
        "Authorization",
        "Bearer " + TEST_JWT
      );
      expect(deleteSongMock).toHaveBeenCalled();
      expect(deleteLikesMock).toHaveBeenCalled();
      expect(response.status).toBe(404);
    });
  });
});
