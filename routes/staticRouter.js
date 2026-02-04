const { Router } = require('express');
const router = Router();
const { front, home } = require('../controllers/staticController');


router.get('/', front);

router.get('/home', home);

module.exports = router;
