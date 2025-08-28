const express=require('express');
const path =require('path');

const Blog = require("./models/blog")
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

mongoose.connect("mongodb://localhost:27017/blogify").then((e) => console.log("mongoDB connected"))


app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))

app.get("/",async(req,res) =>{
    const allBlog = await Blog.find({});
 res.render("home",{
    user: req.user,
    blogs:allBlog,
 });
})

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(PORT,()=>console.log(`Server Started at PORT${PORT}`))