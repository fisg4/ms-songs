function postTicketToChangeVideoUrl({ id, url }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1500);
  });
}

module.exports = {
  postTicketToChangeVideoUrl: postTicketToChangeVideoUrl,
};
