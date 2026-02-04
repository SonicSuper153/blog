const { Router } = require('express');
const router = Router();
const { renderCreateBlog, createBlog, showBlog } = require('../controllers/blogController');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/user/signin');
};

router.get('/add', isAuthenticated, renderCreateBlog);
router.get('/view/:id', showBlog)
router.post('/add', isAuthenticated, createBlog);

module.exports = router;
