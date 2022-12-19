const debug = require("debug")("ms-songs:server");

module.exports = (err, req, res, next) => {
    console.log(err);
    debug("DB problem", err);

    if (err?.name === "CastError" || err?.name === "TypeError")
        res.sendStatus(400).end();

    else if (err?.message === "Invalid song or user")
        res.status(400).send("Bad Request: Invalid song or user").end();

    else if (err?.message?.includes("Failed to get user"))
        res.status(400).send("Bad Request: Invalid user").end();

    else
        res.sendStatus(500).end();
};