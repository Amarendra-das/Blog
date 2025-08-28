const {Router} =require('express');
const multer = require("multer")
const router = Router();
const path =require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    return res.render("addBlog",{
        user:req.user,
    })
})
router.post("/",(req,res)=>{

    return res.redirect("/");
})

module.exports = router;