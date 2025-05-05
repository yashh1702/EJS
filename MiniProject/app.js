const express = require('express')
const app = express()
const userModel = require('./models/user.model.js');
const postModel = require("./models/post.model.js")
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/profile",isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.send("profile")
})

app.post("/register",async(req,res)=>{
    let {email, password, username, name, age} = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("User already registered");

    bcrypt.genSalt(10,(err,salt) => {
        bcrypt.hash(password, salt, async (err,hash) => {
           let createdUser = await userModel.create({
                username,
                email,
                age,
                name,
                password: hash,
            });

            let token = jwt.sign({email: email, userId: createdUser._id},"shhhh");
            res.cookie("token",token);
            res.send("registered")
        })
    })

    
})

app.post("/login",async(req,res)=>{
    let {email, password } = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("Something Went wrong 1");

    bcrypt.compare(password,user.password,(err,result)=> {
        if(result) {
            let token = jwt.sign({email: email, userId: user._id},"shhhh");
            res.cookie("token",token);
            res.status(200).send("You can Login");
        }
        else res.redirect("/login");
    })
       
})

app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("/login")
})

function isLoggedIn(req,res,next){
   if(req.cookies.token === "") res.send("You Must be LoggedIn");
   else{
        let data = jwt.verify(req.cookies.token,"shhhh");
        req.user = data;
   }
   next();
}

app.listen(3000)