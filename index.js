const express=require('express');
const path =require('path');
const userRoute = require("./routes/user")
const app = express();
const PORT = 8000;
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/blogify").then((e) => console.log("mongoDB connected"))


app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}));

app.get("/",(req,res) =>{
 res.render("home")
})

app.use("/user", userRoute);
app.listen(PORT,()=>console.log(`Server Started at PORT${PORT}`))