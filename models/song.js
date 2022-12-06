const {Schema, model} = require("mongoose");

const songSchema = new Schema({
    title: String,
    artists: [String],
    releaseDate: Date,
    albumCover: String,
    url: String,
    lyrics: String,
    spotifyId: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like'}]
});

const Song = model('Song', songSchema);

module.exports = Song;