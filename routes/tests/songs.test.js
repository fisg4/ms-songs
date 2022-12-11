const app = require("../../app");
const Song = require("../../models/song");
const request = require("supertest");

const BASEPATH_ENDPOINT = "/api/v1";

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
  });
});
