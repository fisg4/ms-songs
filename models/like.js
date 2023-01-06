const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
  song: { type: Schema.Types.ObjectId, required: true, ref: "Song" },
  user: { type: Object, required: true },
  date: { type: Date, default: Date.now },
});

likeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    (returnedObject.id = returnedObject._id),
      delete returnedObject._id,
      delete returnedObject.__v;
  },
});

likeSchema.methods.cleanUser = function () {
  return {
    id: this.id,
    song: this.song,
    date: this.date.toISOString().split("T")[0],
  };
};

likeSchema.methods.cleanSong = function () {
  return {
    id: this.id,
    user: this.user,
    date: this.date.toISOString().split("T")[0],
  };
};

likeSchema.statics.alreadyExists = async function (songId, userId) {
  const result = await Like.findOne({ song: songId, "user.id": userId });
  if (!result) return false;
  else return result;
};

const Like = model("Like", likeSchema);

module.exports = Like;
