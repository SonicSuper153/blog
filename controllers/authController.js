
const User = require('../models/user');
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const result = await User.create({
            username,
            email,
            password,
        });

        const user = result[0];
        req.session.user = {
             id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        return res.redirect("/");
    } catch (err) {
        console.error(err.message);
        return res.status(400).send(err.message);
    }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        console.log("User signed in:", user.username);
        return res.redirect("/");
    } catch (err) {
        // console.error(err.message);
        // return res.status(500).send("Internal Server Error");
        return res.render("signin",{
            error: "Incorrect Email or Password"
        })
    }
}

exports.logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}

exports.signin_render = (req, res) => {
    return res.render('signin');
}

exports.signup_render = (req, res) => {
    return res.render('signup');
}