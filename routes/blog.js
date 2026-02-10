const { Router } = require('express');
const router = Router();
<<<<<<< HEAD
const { renderCreateBlog, createBlog, showBlog, deleteBlog, editBlog, updateBlog, postComment, addCategory, searchBlog, sortBlog } = require('../controllers/blogController');


const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/add', isAuthenticated, renderCreateBlog);
router.post('/add', isAuthenticated, createBlog);
router.get('/search', searchBlog);
=======
const { renderCreateBlog, createBlog, showBlog, deleteBlog, editBlog, updateBlog, postComment, addCategory, sortBlog } = require('../controllers/blogController');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/user/signin');
};

router.get('/add', isAuthenticated, renderCreateBlog);
router.post('/add', isAuthenticated, createBlog);
>>>>>>> 1bb3d35b65a2e6fce9a0c0b685bf969fee8f7914
router.get('/sort', sortBlog);
router.get('/view/:id', showBlog);
router.post('/delete/:id', isAuthenticated, deleteBlog);
router.get('/edit/:id', isAuthenticated, editBlog);
router.post('/update/:id', isAuthenticated, updateBlog);
router.post('/comment/:id', isAuthenticated, postComment);
router.post('/addCategory', isAuthenticated, addCategory);

module.exports = router;
