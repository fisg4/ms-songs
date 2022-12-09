const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    // TODO: MS Users Integration
    // _id: { type: Schema.Types.ObjectId, required: true },
    _id: { type: String, required: true },
    username: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
        delete returnedObject._id,
        delete returnedObject.__v
    }
});

const User = model('User', userSchema);

module.exports = User;