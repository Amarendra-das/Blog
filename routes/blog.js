const { Router } = require('express');
const multer = require("multer");
const router = Router();
const path = require("path");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/image/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    return res.render("home", {
        blogs: allBlogs,
    });
});

router.get("/add-new", (req, res) => {
    return res.render("addBlog");
});

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    
    return res.render("blog", {
        blog,
        comments,
    });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/image/uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

// ✅ ADD THESE TWO ROUTES FOR EDITING
// This route shows the edit form
router.get("/edit/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    return res.render("editBlog", {
        blog,
    });
});

// This route handles the update
router.post("/edit/:id", async (req, res) => {
    await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
    });
    return res.redirect(`/blog/${req.params.id}`);
});


router.post("/delete/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect("/blog");
});

module.exports = router;