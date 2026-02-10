const { Post, User, Category, Comment } = require('../models/index');
const multer = require('multer');
const path = require('path');


const blogInclude = [
    { model: User, as: 'author', attributes: ['username'] },
    { model: Category, as: 'category', attributes: ['name'] }
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });
exports.renderHomePage = async (req, res) => {
    try {
        console.log('ahhhhh', req.session.user.id, req.session.user.username, res.locals);
        const posts = await Post.findAll({
            include: blogInclude,
            order: [['created_at', 'DESC']]
        });

        res.render("home", {
            blogs: posts || [],
            user: req.session.user,
            sortBy: 'desc'  // Set default sort state for dropdown
        });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.render("home", {
            blogs: [],
            error: "Failed to load blog posts."
        });
    }
};

exports.renderCreateBlog = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.render('addBlog', {
            user: req.session.user,
            categories: categories || []
        });
    } catch (err) {
        console.error("Error rendering add blog page:", err);
        res.redirect('/');
    }
};

exports.createBlog = [
    upload.single('featured_image'),
    async (req, res) => {
        const { title, content, category_id } = req.body;
        const user_id = req.session.user.id;
        try {
            const blogData = {
                title,
                content,
                user_id,
                category_id: category_id || null
            };

            if (req.file) {
                blogData.featured_image = req.file.filename;
            }

            await Post.create(blogData);
            res.redirect('/');
        } catch (err) {
            console.error("Error creating blog:", err);
            res.render('addBlog', {
                error: "Failed to create blog. Please try again.",
                user: req.session.user
            });
        }
    }
];

exports.showBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findByPk(id, {
            include: [
                ...blogInclude,
                {
                    model: Comment,
                    include: [{ model: User, attributes: ['username'] }]
                }
            ]
        });

        if (!post) {
            return res.status(404).render('home', {
                error: "Blog post not found",
                blogs: []
            });
        }

        res.render('showBlog', {
            blog: post,
            user: req.session.user
        });
    } catch (err) {
        console.error("Error fetching single post:", err);
        res.redirect('/');
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).redirect('/');
        }

        if (post.user_id !== req.session.user.id) {
            return res.status(403).send("Unauthorized: You can only delete your own posts.");
        }

        await post.destroy();
        res.redirect('/');
    } catch (err) {
        console.error("Error deleting post:", err);
        res.redirect('/');
    }
};

exports.editBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).render('home', {
                error: "Blog post not found",
                blogs: []
            });
        }

        if (post.user_id !== req.session.user.id) {
            return res.status(403).send("Unauthorized: You can only edit your own posts.");
        }

        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });

        res.render('editBlog', {
            blog: post,
            user: req.session.user,
            categories: categories || []
        });
    } catch (err) {
        console.error("Error rendering edit page:", err);
        res.redirect('/');
    }
};

/**
 * Handles updating of a blog post
 */
exports.updateBlog = [
    upload.single('featured_image'),
    async (req, res) => {
        try {
            const id = req.params.id;
            const { title, content, category_id } = req.body;

            const post = await Post.findByPk(id);
            if (!post) {
                return res.status(404).redirect('/');
            }

            if (post.user_id !== req.session.user.id) {
                return res.status(403).send("Unauthorized: You can only update your own posts.");
            }

            const updateData = {
                title,
                content,
                category_id: category_id || post.category_id
            };

            if (req.file) {
                updateData.featured_image = req.file.filename;
            }

            await post.update(updateData);
            res.redirect(`/blogs/view/${id}`);
        } catch (err) {
            console.error("Error updating blog:", err);
            res.redirect('/');
        }
    }
];

exports.postComment = async (req, res) => {
    try {
        const post_id = req.params.id;
        const { comment_text } = req.body;

        if (!req.session.user) {
            return res.redirect('/user/signin');
        }

        const user_id = req.session.user.id;
        const post = await Post.findByPk(post_id);

        if (!post) {
            return res.status(404).redirect('/');
        }

        await Comment.create({
            comment_text,
            post_id,
            user_id
        });

        res.redirect(`/blogs/view/${post_id}`);
    } catch (err) {
        console.error("Error posting comment:", err);
        res.redirect('/');
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send("Category name is required");
        }
        await Category.create({ name });
        res.redirect('/blogs/add');
    } catch (err) {
        console.error("Error adding category:", err);
        res.redirect('/blogs/add');
    }
};

const { Op } = require("sequelize");


exports.searchBlog = async (req, res) => {
    try {
        const { q } = req.query;
        let whereClause = {};

        if (q) {
            whereClause.title = { [Op.iLike]: `%${q}%` };
        }

        const posts = await Post.findAll({
            where: whereClause,
            include: blogInclude,
            order: [['created_at', 'DESC']]
        });

        res.render("home", {
            blogs: posts || [],
            user: req.session.user,
            query: q
        });
    } catch (err) {
        console.error("Search error:", err);
        res.redirect("/");
    }
};

exports.sortBlog = async (req, res) => {
    try {
        const { sortBy } = req.query; 
        
        const order = sortBy === 'asc' ? 'ASC' : 'DESC';
        
        const posts = await Post.findAll({
            include: blogInclude,
            order: [['created_at', order]]
        });

        res.render("home", {
            blogs: posts || [],
            user: req.session.user,
            sortBy: sortBy || 'desc'
        });
    } catch(err) {
        console.error("Sort error:", err);
        res.redirect("/");
    }
};
