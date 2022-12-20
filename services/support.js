const axios = require("axios");
const urlJoin = require("url-join");

async function postTicketToChangeVideoUrl({ authorId, songId, text }) {
  const url = urlJoin(process.env.SUPPORT_HOST, "/support/v1/tickets");
  const response = await axios.post(
    url,
    {
      authorId,
      songId,
      text,
      title: "Video clip change request",
      priority: "medium",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (response.status === 201) {
    return {
      status: 201,
      message: "Support ticket posted succesfully",
      ticket: response.data,
    };
  } else {
    throw Error(
      `Failed to post support ticket, reported with status code: ${response.status}`
    );
  }
}

module.exports = {
  postTicketToChangeVideoUrl,
};
