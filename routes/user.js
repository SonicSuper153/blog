const { Router } = require('express');
const router = Router();
const User = require('../models/user');
const { signin_render, signup_render, signup , signin , logout , home} = require('../controllers/authController');

router.get('/signin', signin_render);

router.get('/signup', signup_render);

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/logout', logout);

// router.get('/test-session', (req, res) => {
//     console.log(req.session); 
//     res.send(req.session); 
// });

module.exports = router;