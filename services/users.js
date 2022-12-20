const axios = require("axios");
const urlJoin = require("url-join");

async function getUserById(id) {
  const url = urlJoin(process.env.USERS_HOST, "/api/v1/users", id);
  const response = await axios.get(url);
  if (response.status === 200) {
    return {
      status: 200,
      user: response.data,
    };
  } else {
    throw Error(
      `Failed to get user, reported with the status code: ${response.status}`
    );
  }
}

module.exports = {
  getUserById,
};
