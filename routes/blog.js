const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const cloudinary = require('cloudinary').v2;

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

router.get('/edit/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    return res.render('editBlog', {
        user: req.user,
        blog,
    });
});


router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    
    return res.render('blog', {
        user: req.user,
        blog,
        comments,
    });
});



router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
        if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).send('Error uploading image');
        }
        const blog = await Blog.create({
            body,
            title,
            createdBy: req.user._id,
            coverImageURL: result.secure_url,
        });
        return res.redirect(`/blog/${blog._id}`);
    }).end(req.file.buffer);
});

router.post('/edit/:id', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const updateData = { title, body };

    if (req.file) {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) reject(error);
                resolve(result);
            }).end(req.file.buffer);
        });
        updateData.coverImageURL = result.secure_url;
    }

    await Blog.findByIdAndUpdate(req.params.id, updateData);
    return res.redirect(`/blog/${req.params.id}`);
});

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});

router.delete('/delete/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    return res.redirect('/');
});

module.exports = router;