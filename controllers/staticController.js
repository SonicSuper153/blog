const { Post, User, Category } = require('../models/index');

exports.front = (req, res) => {
    res.render("index", {
        siteName: "My Blog"
    });
}

exports.home = async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [
                { model: User, as: 'author', attributes: ['username'] },
                { model: Category, as: 'category', attributes: ['name'] }
            ],
            order: [['created_at', 'DESC']]
        });

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