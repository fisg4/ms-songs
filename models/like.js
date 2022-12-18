const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
  // TODO: MS Users Integration
  // user: { type: Schema.Types.ObjectId, required: true },
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
    date: this.date,
  };
};

likeSchema.methods.cleanSong = function () {
  return {
    id: this.id,
    user: this.user,
    date: this.date,
  };
};

likeSchema.statics.alreadyExists = async function (songId, userId) {
  const result = await Like.findOne({ song: songId, "user._id": userId });
  if (!result) return false;
  else return result;
};

const Like = model("Like", likeSchema);

module.exports = Like;
