const { Router } = require('express');
const router = Router();
const { renderHomePage } = require('../controllers/blogController');

router.get('/', renderHomePage);

module.exports = router;

