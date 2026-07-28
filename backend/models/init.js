 const mongoose = require("mongoose");


const User = require("./user");
const Post = require("./post");
const Comment = require("./comment");
const SavedPost = require("./savedpost");
const Notification = require("./notification");
const Report = require("./reportSchema");
const Conversation = require("./conversation");
const Message = require("./message");

const MONGO_URL = "mongodb://127.0.0.1:27017/pulse"; // change if needed

async function connectDB() {
    await mongoose.connect(MONGO_URL);
    console.log("Mongo Connected");
}

async function clearDatabase() {

    await Notification.deleteMany({});
    await SavedPost.deleteMany({});
    await Report.deleteMany({});
    await Comment.deleteMany({});
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});

    console.log("Database cleared");
}

const bios = [
    "MERN Developer",
    "Coffee addict",
    "Open source lover",
    "Just building cool things.",
    "Gym + Coding",
    "AI enthusiast",
    "Cat person",
    "Night owl",
    "Bug hunter",
    "Backend engineer"
];

const postContents = [
    "Working on Pulse today 🚀",
    "Socket.IO is finally working!",
    "MongoDB makes life easier.",
    "React is fun.",
    "Today's gym session was amazing.",
    "Learning cybersecurity every day.",
    "Coffee and code.",
    "Finally fixed that annoying bug.",
    "Deploy day!",
    "Another productive morning.",
    "Node.js is awesome.",
    "Late night coding session.",
    "Finished another feature.",
    "Authentication complete.",
    "Backend almost done.",
    "Frontend polish remaining.",
    "Life is good.",
    "Never stop learning.",
    "Consistency wins.",
    "Building something exciting."
];

const commentTexts = [
    "Nice!",
    "Awesome work.",
    "Looks great.",
    "Keep it up!",
    "Agreed.",
    "🔥",
    "This is cool.",
    "Interesting.",
    "Well done.",
    "Love this."
];

const reportReasons = [
    "spam",
    "harassment",
    "hate",
    "violence",
    "nudity",
    "misinformation",
    "other"
];

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const users = [];
const posts = [];
const comments = [];
const conversations = [];
const messages = [];

async function seedUsers() {

    const userData = [
        {
            username: "taha",
            email: "taha@pulse.com",
            bio: random(bios)
        },
        {
            username: "ali",
            email: "ali@pulse.com",
            bio: random(bios)
        },
        {
            username: "ahmed",
            email: "ahmed@pulse.com",
            bio: random(bios)
        },
        {
            username: "zain",
            email: "zain@pulse.com",
            bio: random(bios)
        },
        {
            username: "hamza",
            email: "hamza@pulse.com",
            bio: random(bios)
        },
        {
            username: "hassan",
            email: "hassan@pulse.com",
            bio: random(bios)
        },
        {
            username: "bilal",
            email: "bilal@pulse.com",
            bio: random(bios)
        },
        {
            username: "fatima",
            email: "fatima@pulse.com",
            bio: random(bios)
        },
        {
            username: "ayesha",
            email: "ayesha@pulse.com",
            bio: random(bios)
        },
        {
            username: "maryam",
            email: "maryam@pulse.com",
            bio: random(bios)
        }
    ];


    for (let data of userData) {

        const user = new User({
            username: data.username,
            email: data.email,
            bio: data.bio
        });

        await User.register(
            user,
            "password123"
        );

        users.push(user);
    }

    console.log(`${users.length} users created`);
}

async function seedFollowers() {

    for (let user of users) {

        const others = users.filter(
            u => u._id.toString() !== user._id.toString()
        );

        shuffle(others);

        const total = randomInt(2, 5);

        for (let i = 0; i < total; i++) {

            const target = others[i];

            if (
                !user.following.includes(target._id)
            ) {

                user.following.push(target._id);
            }

            if (
                !target.followers.includes(user._id)
            ) {

                target.followers.push(user._id);
            }

        }

    }

    for (let user of users) {
        await user.save();
    }

    console.log("Followers generated");
}

async function seedPosts() {

    const totalPosts = randomInt(40, 50);

    for (let i = 0; i < totalPosts; i++) {

        const author = random(users);

        const post = await Post.create({

            title: `Post ${i + 1}`,

            content: random(postContents),

            author: author._id,

            mediaUrl: "",

            mediaType: undefined

        });

        posts.push(post);

    }

    console.log(`${posts.length} posts created`);

}
async function seedLikes() {

    for (let post of posts) {

        const shuffledUsers = shuffle([...users]);

        const likeCount = randomInt(0, 7);

        for (let i = 0; i < likeCount; i++) {

            if (!post.likes.includes(shuffledUsers[i]._id)) {

                post.likes.push(shuffledUsers[i]._id);

            }

        }

        await post.save();

    }

    console.log("Likes generated");

}
async function seedComments() {

    const totalComments = randomInt(80, 120);

    for (let i = 0; i < totalComments; i++) {

        const author = random(users);

        const post = random(posts);

        const comment = await Comment.create({

            author: author._id,

            post: post._id,

            message: random(commentTexts)

        });

        comments.push(comment);

    }

    console.log(`${comments.length} comments created`);

}
async function seedSavedPosts() {

    for (let user of users) {

        const shuffledPosts = shuffle([...posts]);

        const totalSaved = randomInt(3, 8);

        for (let i = 0; i < totalSaved; i++) {

            await SavedPost.create({

                user: user._id,

                post: shuffledPosts[i]._id

            });

        }

    }

    console.log("Saved posts generated");

}
async function seedNotifications() {

    // Like notifications
    for (let post of posts) {

        for (let likerId of post.likes) {

            if (
                likerId.toString() !==
                post.author.toString()
            ) {

                await Notification.create({

                    sender: likerId,

                    receiver: post.author,

                    notifType: "like",

                    post: post._id

                });

            }

        }

    }

    // Comment notifications
    for (let comment of comments) {

        const post = posts.find(
            p => p._id.toString() ===
            comment.post.toString()
        );

        if (
            post &&
            comment.author.toString() !==
            post.author.toString()
        ) {

            await Notification.create({

                sender: comment.author,

                receiver: post.author,

                notifType: "comment",

                post: post._id,

                comment: comment._id

            });

        }

    }

    // Follow notifications
    for (let user of users) {

        for (let followingId of user.following) {

            await Notification.create({

                sender: user._id,

                receiver: followingId,

                notifType: "follow"

            });

        }

    }

    console.log("Notifications generated");

}
async function seedReports() {

    const totalReports = 15;

    for (let i = 0; i < totalReports; i++) {

        const reporter = random(users);

        const type = random([
            "post",
            "comment",
            "user"
        ]);

        let targetId;

        if (type === "post") {

            targetId = random(posts)._id;

        }
        else if (type === "comment") {

            targetId = random(comments)._id;

        }
        else {

            targetId = random(users)._id;

        }

        await Report.create({

            reporter: reporter._id,

            targetType: type,

            targetId,

            reason: random(reportReasons),

            description: "Automatically generated report."

        });

    }

    console.log("Reports generated");

}
async function seedConversations() {

    const createdPairs = new Set();

    while (conversations.length < 8) {

        const userA = random(users);
        const userB = random(users);

        if (
            userA._id.toString() ===
            userB._id.toString()
        ) continue;

        const pair = [
            userA._id.toString(),
            userB._id.toString()
        ].sort().join("-");

        if (createdPairs.has(pair)) continue;

        createdPairs.add(pair);

        const convo = await Conversation.create({

            participants: [
                userA._id,
                userB._id
            ]

        });

        conversations.push(convo);

    }

    console.log(`${conversations.length} conversations created`);

}
async function seedMessages() {

    for (let convo of conversations) {

        const totalMessages = randomInt(8, 15);

        let lastMessage = null;

        for (let i = 0; i < totalMessages; i++) {

            const sender =
                convo.participants[
                    Math.floor(
                        Math.random() * 2
                    )
                ];

            const message = await Message.create({

                sender,

                conversation: convo._id,

                text: `Test message ${i + 1}`,

                isRead: Math.random() > 0.5,

                readBy: []

            });

            messages.push(message);

            lastMessage = message;

        }

        convo.lastMessage = lastMessage._id;

        await convo.save();

    }

    console.log(`${messages.length} messages created`);

}
async function seed() {

    try {

        await connectDB();

        await clearDatabase();

        await seedUsers();

        await seedFollowers();

        await seedPosts();

        await seedLikes();

        await seedComments();

        await seedSavedPosts();

        await seedNotifications();

        await seedReports();

        await seedConversations();

        await seedMessages();

        console.log("================================");
        console.log("Pulse database seeded!");
        console.log("================================");

        process.exit(0);

    }
    catch (err) {

        console.log(err);

        process.exit(1);

    }

}

seed();