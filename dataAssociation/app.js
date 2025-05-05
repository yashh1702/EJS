const express = require('express')
const app = express();
const userModel = require("./models/user.model.js")
const psotModel = require("./models/post.model.js");
const postModel = require('./models/post.model.js');

app.get("/",(req,res)=>{
    res.send("hello")
})

app.get("/create",async (req,res)=>{
    let createUser = await userModel.create({
        username: "Yash",
        age:22,
        email:"yash@yash.com"
    });

    res.send(createUser);
});

app.get("/post/create",async (req,res)=>{
  let createPost = await postModel.create({
    postData:"hello how are u",
    user:"681875ffa1175b86167feca9",
   });

   let user = await userModel.findOne({_id: "681875ffa1175b86167feca9"})
   user.posts.push(createPost._id);
   await user.save();
   res.send({createPost,user});
})

app.listen(3000);  