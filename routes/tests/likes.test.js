const app = require("../../app");
const Song = require("../../models/song");
const User = require("../../models/user");
const Like = require("../../models/like");
const request = require("supertest");

const BASEPATH_ENDPOINT = "/api/v1";

const songs = [
  {
    title: "Duki: Bzrp Music Sessions, Vol. 50",
    artists: ["Bizarrap", "Duki"],
    albumCover: "https://i.scdn.co/image/ab67616d0000b27393c4eec56cea95c9022ed28f",
    releaseDate: "2022-11-16",
    lyrics: "",
    url: "https://www.youtube.com/watch?v=Gzs60iBgd3E&ab_channel=Bizarrap",
    spotifyId: "7MkylDYvKTSuWgrsBhHlsG",
    likes: ["5f9f1b9f1f1d8d5c46e31c3f", "5f9f1b9f1f1d8d5c46e31c3e"],
    id: "639266d51f1d8d5c46e31c3f",
  },
  {
    title: "DESPECHÁ",
    artists: ["ROSALÍA"],
    albumCover: "https://i.scdn.co/image/ab67616d0000b2738f072024e0358fc5c62eba41",
    releaseDate: "2022-07-28",
    url: "https://p.scdn.co/mp3-preview/c9bada701f6ef03ef67d5ae0e8ff8bde40499313?cid=d9d5c6f2f2224912a23530862aa9fec3",
    spotifyId: "5ildQOEKmJuWGl2vRkFdYc",
    likes: ["5f9f1b9f1f1d8d5c46e31c3d"],
    id: "639319967a53a5498109fcb0",
  },
  {
    title: "Hey Mor",
    artists: ["Ozuna", "Feid"],
    albumCover: "https://i.scdn.co/image/ab67616d0000b273125624f2e04f5a1ccb0dfb45",
    releaseDate: "2022-10-07",
    lyrics: "",
    url: "https://www.youtube.com/watch?v=u8jb8z3zUJM&ab_channel=Ozuna",
    spotifyId: "1zsPaEkglFvxjAhrM8yhpr",
    likes: [],
    id: "639319967a53a5498109fcb1",
  },
];

const users = [
  {
    username: "user1",
    likes: ["5f9f1b9f1f1d8d5c46e31c3f", "5f9f1b9f1f1d8d5c46e31c3d"],
    id: "user1",
  },
  {
    username: "user2",
    likes: ["5f9f1b9f1f1d8d5c46e31c3e"],
    id: "user2",
  },
  {
    username: "user3",
    likes: [],
    id: "user3",
  },
];

const likes = [
  {
    song: "639266d51f1d8d5c46e31c3f",
    user: "user1",
    date: Date.now(),
    id: "5f9f1b9f1f1d8d5c46e31c3f",
  },
  {
    song: "639266d51f1d8d5c46e31c3f",
    user: "user2",
    date: Date.now(),
    id: "5f9f1b9f1f1d8d5c46e31c3e",
  },
  {
    song: "639319967a53a5498109fcb0",
    user: "user1",
    date: Date.now(),
    id: "5f9f1b9f1f1d8d5c46e31c3d",
  }
];


describe("Songs API", () => {
  describe("GET /likes", () => {
    // By song
    it("Should return all the likes of a song", async () => {
      const findMock = jest.spyOn(Like, "find");
      const whereMock = jest.fn(() => { return { equals: equalsMock } });
      const equalsMock = jest.fn(() => { return { populate: populateMock } });
      const populateMock = jest.fn(() => populatedSongLikes);

      const cleanSongMock = jest.spyOn(Like.prototype, "cleanSong");

      const populatedSongLikes = [
        {
          user: {
            username: "user1",
            id: "user1"
          },
          date: Date.now(),
          id: "5f9f1b9f1f1d8d5c46e31c3f",
          cleanSong: cleanSongMock
        },
        {
          user: {
            username: "user2",
            id: "user2"
          },
          date: Date.now(),
          id: "5f9f1b9f1f1d8d5c46e31c3e",
          cleanSong: cleanSongMock
        }
      ];

      findMock.mockImplementation(() => {
        return {
          where: whereMock,
        };
      });

      cleanSongMock.mockImplementation(() => {
        return {};
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/likes?songId=` + songs[0].id);
      expect(findMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(equalsMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(cleanSongMock).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("json"));
      expect(response.body).toBeArrayOfSize(2);
    });

    it("Should return No Content state if the song has no likes", async () => {
      const findMock = jest.spyOn(Like, "find");
      const whereMock = jest.fn(() => { return { equals: equalsMock } });
      const equalsMock = jest.fn(() => { return { populate: populateMock } });
      const populateMock = jest.fn(() => []);

      findMock.mockImplementation(() => {
        return {
          where: whereMock,
        };
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/likes?songId=` + songs[2].id);
      expect(findMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(equalsMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(204);
    });

    it("Should return Bad Request state if the song does not exist", async () => {
      const findMock = jest.spyOn(Like, "find");
      const whereMock = jest.fn(() => { return { equals: equalsMock } });
      const equalsMock = jest.fn(() => undefined);

      findMock.mockImplementation(() => {
        return {
          where: whereMock,
        };
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/likes?songId=` + 'awsedrftgyhujikolp');
      expect(findMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(equalsMock).toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    // By user
    it("Should return all the likes given by the user", async () => {
      const findMock = jest.spyOn(Like, "find");
      const whereMock = jest.fn(() => { return { equals: equalsMock } });
      const equalsMock = jest.fn(() => { return { populate: populateMock } });
      const populateMock = jest.fn(() => populatedUserLikes);

      const cleanUserMock = jest.spyOn(Like.prototype, "cleanUser");

      const populatedUserLikes = [
        {
          song: {
            title: "Duki: Bzrp Music Sessions, Vol. 50",
            artists: ["Bizarrap", "Duki"],
            albumCover: "https://i.scdn.co/image/ab67616d0000b27393c4eec56cea95c9022ed28f",
            id: "639266d51f1d8d5c46e31c3f"
          },
          id: "5f9f1b9f1f1d8d5c46e31c3f",
          cleanUser: cleanUserMock
        },
        {
          song: {
            title: "DESPECHÁ",
            artists: ["ROSALÍA"],
            albumCover: "https://i.scdn.co/image/ab67616d0000b2738f072024e0358fc5c62eba41",
            id: "639319967a53a5498109fcb0"
          },
          id: "5f9f1b9f1f1d8d5c46e31c3d",
          cleanUser: cleanUserMock
        }
      ];

      findMock.mockImplementation(() => {
        return {
          where: whereMock,
        };
      });

      cleanUserMock.mockImplementation(() => {
        return {};
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/likes?userId=` + users[0].id);
      expect(findMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(equalsMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(cleanUserMock).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
      expect(response.type).toEqual(expect.stringContaining("json"));
      expect(response.body).toBeArrayOfSize(2);
    });

    it("Should return No Content state if the user has no likes", async () => {
      const findMock = jest.spyOn(Like, "find");
      const whereMock = jest.fn(() => { return { equals: equalsMock } });
      const equalsMock = jest.fn(() => { return { populate: populateMock } });
      const populateMock = jest.fn(() => []);

      findMock.mockImplementation(() => {
        return {
          where: whereMock,
        };
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/likes?userId=` + users[2].id);
      expect(findMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(equalsMock).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalled();
      expect(response.status).toBe(204);
    });

    it("Should return Bad Request state if the song does not exist", async () => {
      const findMock = jest.spyOn(Like, "find");
      const whereMock = jest.fn(() => { return { equals: equalsMock } });
      const equalsMock = jest.fn(() => undefined);

      findMock.mockImplementation(() => {
        return {
          where: whereMock,
        };
      });

      const response = await request(app).get(`${BASEPATH_ENDPOINT}/likes?userId=` + 'awsedrftgyhujikolp');
      expect(findMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
      expect(equalsMock).toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    it("Should return Not Found state if the url is not well formed", async () => {
      const response = await request(app).get(`${BASEPATH_ENDPOINT}/likes?song=asdfghjkl`);
      expect(response.status).toBe(404);
    });
  });

});
