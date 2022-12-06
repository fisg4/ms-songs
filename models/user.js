const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    // TODO: MS Users Integration
    // _id: { type: Schema.Types.ObjectId, required: true },
    _id: String,
    username: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like'}]
});

const User = model('User', userSchema);

module.exports = User;