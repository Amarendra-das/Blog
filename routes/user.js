const { Router } = require('express');
const User = require("../models/user");
const multer = require('multer'); 
const path = require('path');     

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/profile-images/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });


router.get("/signin", (req, res) => {
    return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});


router.get('/settings', (req, res) => {
    return res.render('settings');
});


router.post('/settings', upload.single('profileImage'), async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        ProfileImageURL: `/profile-images/${req.file.filename}`,
    });
    return res.redirect('/');
});


module.exports = router;