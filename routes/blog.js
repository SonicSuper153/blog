const { Router } = require('express');
const router = Router();
const { renderCreateBlog, createBlog, showBlog, deleteBlog, editBlog, updateBlog, postComment, addCategory, searchBlog, sortBlog } = require('../controllers/blogController');


const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/add', isAuthenticated, renderCreateBlog);
router.post('/add', isAuthenticated, createBlog);
router.get('/search', searchBlog);
router.get('/sort', sortBlog);
router.get('/view/:id', showBlog);
router.post('/delete/:id', isAuthenticated, deleteBlog);
router.get('/edit/:id', isAuthenticated, editBlog);
router.post('/update/:id', isAuthenticated, updateBlog);
router.post('/comment/:id', isAuthenticated, postComment);
router.post('/addCategory', isAuthenticated, addCategory);

module.exports = router;
