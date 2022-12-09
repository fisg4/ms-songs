const axios = require("axios");
const urlJoin = require("url-join");
const querystring = require("node:querystring");

const SPOTIFY_APP_CLIENT_ID = process.env.SPOTIFY_APP_CLIENT_ID;
const SPOTIFY_APP_CLIENT_SECRET = process.env.SPOTIFY_APP_CLIENT_SECRET;

const getAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type: "client_credentials",
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            SPOTIFY_APP_CLIENT_ID + ":" + SPOTIFY_APP_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": null,
      },
    }
  );
  if (response.status === 200) {
    const access_token = response.data.access_token;
    return {
      access_token,
      status: response.status,
    };
  } else {
    return {
      status: response.status,
    };
  }
};

const searchSongs = async (title, artist) => {
  const { access_token, status } = await getAccessToken();
  if (status === 200) {
    let url = urlJoin(
      "https://api.spotify.com/v1/search",
      `?q=${title}`,
      "&type=track&include_external=audio"
    );

    if (artist !== "") {
      url = urlJoin(
        "https://api.spotify.com/v1/search",
        `?q=${title}%20artist:${artist}`,
        "&type=track&include_external=audio"
      );
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
        "Accept-Encoding": null,
      },
    });

    if (response.status == 200) {
      const songs = response.data;
      return {
        songs,
        status: response.status,
      };
    } else {
      return {
        status: response.status,
      };
    }
  } else {
    return {
      status,
    };
  }
};

module.exports = {
  searchSongs,
};
