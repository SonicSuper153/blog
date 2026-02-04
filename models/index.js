const Role = require('./role');
const User = require('./user');
const Category = require('./category');
const Post = require('./post');
const Comment = require('./comment');

async function syncDatabase() {
    try {
        console.log("Starting Database Sync...");

        // 1. Roles (No dependencies)
        await Role.createTable();

        // 2. Categories (No dependencies)
        await Category.createTable();

        // 3. Users (Depends on Roles for migration)
        await User.createTable();

        // 4. Posts (Depends on Users and Categories)
        await Post.createTable();

        // 5. Comments (Depends on Posts and Users)
        await Comment.createTable();

        console.log("Database Sync Completed Successfully.");
    } catch (err) {
        console.error("Database Sync Failed:", err);
    }
}

module.exports = {
    Role,
    User,
    Category,
    Post,
    Comment,
    syncDatabase
};
