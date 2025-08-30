const express = require('express');
const path = require('path');

const Blog = require("./models/blog");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const profileRoute = require("./routes/profile");

const app = express();
const PORT = 8000;
const mongoose = require("mongoose");
require('dotenv').config();
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

mongoose.connect(process.env.MONGO_URL).then((e) => console.log("mongoDB connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(express.static(path.resolve('./public')));


app.use(checkForAuthenticationCookie("token"));


app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});




app.get("/", async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 9; 
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
   
    const totalPages = Math.ceil(totalBlogs / limit);

    const allBlogs = await Blog.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    
   
    res.render("home", {
        blogs: allBlogs,
        currentPage: page,
        totalPages,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use("/profile", profileRoute);

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`));