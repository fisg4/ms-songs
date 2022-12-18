const debug = require("debug")("ms-songs:server");

module.exports = (err, req, res, next) => {
    console.log(err);
    debug("DB problem", err);
    if (err.name === "CastError" || err.name === "TypeError")
        res.sendStatus(400).end();
    else
        res.sendStatus(500).end();
};