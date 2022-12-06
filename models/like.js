const {Schema, model} = require("mongoose");

const likeSchema = new Schema({
    // TODO: MS Users Integration
    // user: { type: Schema.Types.ObjectId, required: true },
    song: Schema.Types.ObjectId,
    user: String,
    date: { type: Date, default: Date.now }
});

const Like = model('Like', likeSchema);

module.exports = Like;