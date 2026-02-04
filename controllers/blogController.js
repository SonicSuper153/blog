const Post = require('../models/post');

exports.renderCreateBlog = (req, res) => {
    res.render('addBlog', {
        user: req.session.user
    });
};

exports.createBlog = async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.session.user.id;

    try {
        await Post.create({
            title,
            content,
            user_id
        });
        res.redirect('/home');
    } catch (err) {
        console.error("Error creating blog:", err);
        res.render('addBlog', {
            error: "Failed to create blog. Please try again.",
            user: req.session.user
        });
    }
};

exports.showBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).render('home', {
                error: "Post not found",
                blogs: []
            });
        }

        res.render('showBlog', {
            blog: post,
            user: req.session.user
        });
    } catch (err) {
        console.error("Error fetching post:", err);
        res.redirect('/home');
    }
};
