const debug = require("debug")("ms-songs:server");

module.exports = (err, req, res, next) => {
    debug("DB problem", err);

    if (err?.name === "CastError" || err?.name === "TypeError")
        res.sendStatus(404).end();

    else if (err?.message === "Invalid song" || err?.message === "Invalid song or user")
        res.status(404).send("Not Found: " + err.message).end();

    else if (err?.message?.includes("Failed to get user"))
        res.status(404).send("Not Found: Invalid user").end();

    else if (err?.message?.includes("Failed to delete like"))
        res.status(404).send("Not Found: Invalid like").end();

    else if (err?.code === 11000 || err?.message === "Duplicate like")
        res.status(409).send("Conflict: Duplicate");

    else if (err?.name === "ValidationError" || err?.name === "SyntaxError" || err?.message === "Invalid ticket")
        res.status(400).send("Bad Request: " + err.message).end();

    else if (err?.response?.status === 401)
        res.status(401).send("Unauthorized").end();

    else if (err?.response?.status)
        res.status(err.response.status).send(err.message).end();

    else
        res.sendStatus(500).end();
};