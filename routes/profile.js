// routes/profile.js

const { Router } = require('express');
const User = require('../models/user');
const Blog = require('../models/blog');

const router = Router();

router.get('/:userId', async (req, res) => {

    const profileUser = await User.findById(req.params.userId);

    
    const blogs = await Blog.find({ createdBy: req.params.userId }).sort({ createdAt: -1 });

    return res.render('profile', {
    
        user: req.user, 
        
        profileUser,
    
        blogs,
    });
});

module.exports = router;