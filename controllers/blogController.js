const { Post, User, Category } = require('../models/index');

exports.renderCreateBlog = async (req, res) => {
    try {
        const categories = await Category.findAll({ where: { status: 'Active' } });
        res.render('addBlog', {
            user: req.session.user,
            categories
        });
    } catch (err) {
        console.error("Error rendering add blog:", err);
        res.redirect('/home');
    }
};

exports.createBlog = async (req, res) => {
    const { title, content, category_id } = req.body;
    const user_id = req.session.user.id;

    try {
        await Post.create({
            title,
            content,
            user_id,
            category_id: category_id || null
        });
        res.redirect('/home');
    } catch (err) {
        console.error("Error creating blog:", err);
        const categories = await Category.findAll({ where: { status: 'Active' } });
        res.render('addBlog', {
            error: "Failed to create blog. Please try again.",
            user: req.session.user,
            categories
        });
    }
};

exports.showBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findByPk(id, {
            include: [
                { model: User, as: 'author', attributes: ['username'] },
                { model: Category, as: 'category', attributes: ['name'] }
            ]
        });

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
