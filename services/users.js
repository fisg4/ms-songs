const { MongooseError } = require("mongoose");
const User = require("../models/user");

usersDb = [
    {
        _id: "user1",
        username: "user1",
        email: "user1@email.com"
    },
    {
        _id: "user2",
        username: "user2",
        email: "user2@email.com"
    },
    {
        _id: "user3",
        username: "user3",
        email: "user3@email.com"
    },
    {
        _id: "user4",
        username: "user4",
        email: "user4@email.com"
    },
    {
        _id: "user5",
        username: "user5",
        email: "user5@email.com"
    },
    {
        _id: "user6",
        username: "user6",
        email: "user6@email.com"
    }
];

async function getUserById(id) {
    let user = await User.findById(id);
    if (user) {
        return user;
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const result = usersDb.find(user => {
                    return user._id === id;
                });
                if (result) {
                    const newUser = new User({ _id: result._id, username: result.username});
                    const savedUser = await newUser.save();
                    resolve(savedUser);
                } else {
                    reject();
                }
            }, 1500);
        });
    }
}

module.exports = {
    getUserById,
};