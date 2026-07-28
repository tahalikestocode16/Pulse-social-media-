const mongoose = require("mongoose");
const User = require("./user.js");
const Post = require("./post.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/pulse";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to Pulse");

    // wipe every collection but keep database
    const collections = await mongoose.connection.db.listCollections().toArray();

    for (let collection of collections) {
        await mongoose.connection.db
            .collection(collection.name)
            .deleteMany({});
    }

    console.log("All collections cleared");

    // users
    const users = await User.insertMany([
        {
            username: "taha",
            email: "taha@pulse.com"
        },
        {
            username: "alex",
            email: "alex@pulse.com"
        },
        {
            username: "sara",
            email: "sara@pulse.com"
        },
        {
            username: "zain",
            email: "zain@pulse.com"
        }
    ]);

    console.log("Users created");


    // posts
    const posts = [
        {
            title: "Golden hour 🌅",
            author: users[0]._id,
            mediaUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            mediaType: "image",
            likes: [users[1]._id, users[2]._id]
        },
        {
            title: "City lights ✨",
            author: users[1]._id,
            mediaUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
            mediaType: "image",
            likes: [users[0]._id]
        },
        {
            title: "Nature feels 🌲",
            author: users[2]._id,
            mediaUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
            mediaType: "image",
            likes: [users[0]._id, users[3]._id]
        },
        {
            title: "Mountain escape 🏔️",
            author: users[3]._id,
            mediaUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
            mediaType: "image",
            likes: [users[1]._id]
        },
        {
            title: "Coffee and code ☕",
            author: users[0]._id,
            mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
            mediaType: "image",
            likes: [users[2]._id, users[3]._id]
        },
        {
            title: "Ocean vibes 🌊",
            author: users[1]._id,
            mediaUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            mediaType: "image",
            likes: [users[0]._id]
        },
        {
            title: "Night sky 🌌",
            author: users[2]._id,
            mediaUrl: "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
            mediaType: "image",
            likes: [users[1]._id, users[3]._id]
        },
        {
            title: "Adventure time 🚀",
            author: users[3]._id,
            mediaUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            mediaType: "image",
            likes: [users[0]._id, users[2]._id]
        }
    ];

    await Post.insertMany(posts);

    console.log("Posts created");

    await mongoose.connection.close();

    console.log("Seed complete");
}

main().catch((err) => {
    console.log(err);
});