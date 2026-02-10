const { Router } = require('express');
const router = Router();
const User = require('../models/user');
<<<<<<< HEAD
const { signin_render, signup_render, signup, signin, logout, home } = require('../controllers/authController');
=======
const { signin_render, signup_render, signup , signin , logout , home} = require('../controllers/authController');
>>>>>>> 1bb3d35b65a2e6fce9a0c0b685bf969fee8f7914

router.get('/signin', signin_render);
router.get('/signup', signup_render);
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/logout', logout);

<<<<<<< HEAD
router.get('/test-session', (req, res) => {
    console.log(req.session);
    res.send(req.session);
});
=======
// router.get('/test-session', (req, res) => {
//     console.log(req.session); 
//     res.send(req.session); 
// });
>>>>>>> 1bb3d35b65a2e6fce9a0c0b685bf969fee8f7914

module.exports = router;