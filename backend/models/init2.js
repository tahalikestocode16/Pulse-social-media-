// // backend/init.js


// const mongoose = require("mongoose");
// const User = require("./user");
// const Post = require("./post");
// const Comment = require("./comment");
// const Notification = require("./notification");
// const SavedPost = require("./savedPost");
// const Report = require("./reportschema");

// const MONGO_URL = "mongodb://127.0.0.1:27017/pulse";

// main()
// .then(() => {
//     console.log("Database connected");
// })
// .catch(err => console.log(err));


// async function main(){
//     await mongoose.connect(MONGO_URL);
// }


// const users = [
//     {
//         username:"taha",
//         email:"taha@gmail.com",
//         bio:"Building Pulse 🚀",
//         profilePic:"https://i.pravatar.cc/300?img=12"
//     },
//     {
//         username:"ali",
//         email:"ali@gmail.com",
//         bio:"Photography lover",
//         profilePic:"https://i.pravatar.cc/300?img=5"
//     },
//     {
//         username:"sara",
//         email:"sara@gmail.com",
//         bio:"Creating moments",
//         profilePic:"https://i.pravatar.cc/300?img=9"
//     },
//     {
//         username:"ahmed",
//         email:"ahmed@gmail.com",
//         bio:"Code and coffee",
//         profilePic:"https://i.pravatar.cc/300?img=15"
//     },
//     {
//         username:"hamza",
//         email:"hamza@gmail.com",
//         bio:"Fitness journey",
//         profilePic:"https://i.pravatar.cc/300?img=20"
//     }
// ];


// async function seedDB(){

//     // DELETE EVERYTHING

//     await User.deleteMany({});
//     await Post.deleteMany({});
//     await Comment.deleteMany({});
//     await Notification.deleteMany({});
//     await SavedPost.deleteMany({});
//     await Report.deleteMany({});


//     // CREATE USERS

//     let createdUsers=[];

//     for(let data of users){

//         let user = new User(data);

//         let registeredUser = await User.register(
//             user,
//             "password123"
//         );

//         createdUsers.push(registeredUser);
//     }


//     // FOLLOW SYSTEM

//     createdUsers[0].following.push(createdUsers[1]._id);
//     createdUsers[0].following.push(createdUsers[2]._id);

//     createdUsers[1].followers.push(createdUsers[0]._id);
//     createdUsers[2].followers.push(createdUsers[0]._id);

//     createdUsers[3].following.push(createdUsers[0]._id);
//     createdUsers[0].followers.push(createdUsers[3]._id);


//     await Promise.all(
//         createdUsers.map(user=>user.save())
//     );


//     // POSTS

//     let posts=[];

//     const postData=[
//         {
//             content:"Welcome to Pulse 🔥",
//             mediaType:"image",
//             mediaUrl:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e"
//         },
//         {
//             content:"Beautiful day outside",
//             mediaType:"image",
//             mediaUrl:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
//         },
//         {
//             content:"Coding late night",
//             mediaType:"image",
//             mediaUrl:"https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
//         },
//         {
//             content:"My first video",
//             mediaType:"video",
//             mediaUrl:"https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
//         }
//     ];


//     for(let i=0;i<10;i++){

//         let data =
//         postData[i % postData.length];


//         let post=new Post({

//             content:data.content,

//             mediaType:data.mediaType,

//             mediaUrl:data.mediaUrl,

//             author:
//             createdUsers[
//                 i % createdUsers.length
//             ]._id,

//             likes:[
//                 createdUsers[
//                     (i+1)%createdUsers.length
//                 ]._id
//             ]

//         });


//         await post.save();

//         posts.push(post);
//     }



//     // COMMENTS

//     let comments=[];

//     for(let post of posts){

//         for(let i=0;i<3;i++){

//             let comment=new Comment({

//                 message:[
//                     "Amazing 🔥",
//                     "Nice post!",
//                     "Love this"
//                 ][i],

//                 author:
//                 createdUsers[
//                     i % createdUsers.length
//                 ]._id,

//                 post:post._id
//             });


//             await comment.save();

//             comments.push(comment);
//         }
//     }



//     // NOTIFICATIONS

//     for(let post of posts){

//         let notification=new Notification({

//             sender:post.likes[0],

//             receiver:post.author,

//             notifType:"like",

//             post:post._id

//         });


//         await notification.save();

//     }



//     console.log("🔥 Pulse Seed Complete");
//     console.log("Users:",createdUsers.length);
//     console.log("Posts:",posts.length);
//     console.log("Comments:",comments.length);


// }



// seedDB();