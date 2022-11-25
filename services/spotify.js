const axios = require("axios");
const urlJoin = require("url-join");
const querystring = require("node:querystring");
const debug = require("debug")("ms-songs:spotify-service");

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
      },
    }
  );
  console.log(response.data); // Esto debería ser un json como el ejemplo:
  /*
  data: {
    access_token: 'BQAaeR3FEGqXEssqRHKLIZ-feTIO6uIsESe5r0M6vKlRR_-f187Y6mIrUFQUSsJb9uQAhRDcVa9SiP4qLIC32pPsUiR269kQjf7oiY6TEzZVJXYGJPI',
    token_type: 'Bearer',
    expires_in: 3600
  }
  */
  if (response.status === 200) {
    // Entra, porque es 200, pero el token está como encriptado
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

const searchSongs = async (title) => {
  const { access_token, status } = await getAccessToken();
  if (status === 200) {
    const url = urlJoin(
      "https://api.spotify.com/v1/search",
      `?q=${title}`,
      "&type=track&include_external=audio"
    );
    const response = await axios.get(url, {
      headers: {
        Authorization: "Bearer " + access_token,
        "Content-Type": "application/json",
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
  getAccessToken,
};
