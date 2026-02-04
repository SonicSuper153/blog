const Post = require('../models/post');

exports.front = (req, res) => {
    res.render("index", {
        siteName: "My Blog"
    });
}

exports.home = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.render("home", {
            blogs: posts || []
        });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.render("home", {
            blogs: []
        });
    }
}