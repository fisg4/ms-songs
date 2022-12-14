const { Schema, model } = require("mongoose");

const songSchema = new Schema({
    title: { type: String, required: true },
    artists: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    albumCover: { type: String, required: true },
    audioUrl: { type: String, required: true },
    videoUrl: { type: String },
    lyrics: { type: String },
    spotifyId: { type: String, unique: true, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }]
});

songSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
        returnedObject.releaseDate = returnedObject.releaseDate.toISOString().split('T')[0],
        delete returnedObject._id,
        delete returnedObject.__v
    }
});

const Song = model('Song', songSchema);

module.exports = Song;