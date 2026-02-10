const { User } = require('../models/index');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({
            username,
            email,
            password
        });

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role || "user"
        };
        return res.redirect("/");
    } catch (err) {
        console.error(err.message);
        return res.status(400).send(err.message);
    }
}

User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render("signin", { error: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.render("signin", { error: "Invalid email or password" });
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        console.log("Who the user is man?", user.username);
        return res.redirect("/");
    } catch (err) {
        return res.render("signin", {
            error: "An error occurred during sign in"
        });
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