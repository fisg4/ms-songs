const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
    // TODO: MS Users Integration
    // user: { type: Schema.Types.ObjectId, required: true },
    song: { type: Schema.Types.ObjectId, required: true, ref: 'Song' },
    user: { type: String, required: true, ref: 'User' },
    date: { type: Date, default: Date.now }
});

likeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id,
        delete returnedObject._id,
        delete returnedObject.__v
    }
});

likeSchema.methods.cleanUser = function() {
    return {
        song: this.song,
        date: this.date
    }
};

likeSchema.methods.cleanSong = function() {
    return {
        user: this.user,
        date: this.date
    }
};

// TODO: Añadir validación de duplicado
likeSchema.statics.alreadyExists  = function(songId, userId) {
    const query  = Like.where({ song: songId, user: userId });
    query.findOne(function (err, result) {
    if (!result) return false;
    else return result;
    });
}

const Like = model('Like', likeSchema);

module.exports = Like;