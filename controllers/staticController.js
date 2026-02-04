
exports.front = (req, res) => {
    res.render("index", {
        siteName: "My Blog"
    });
}

exports.home = (req, res) => {
    res.render("home");
}