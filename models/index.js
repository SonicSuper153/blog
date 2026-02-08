const { sequelize } = require('../config/db');
const Role = require('./role');
const User = require('./user');
const Category = require('./category');
const Post = require('./post');
const Comment = require('./comment');

User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
User.hasMany(Post, { foreignKey: 'user_id' });

Post.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Post, { foreignKey: 'category_id' });

Comment.belongsTo(Post, { foreignKey: 'post_id' });
Post.hasMany(Comment, { foreignKey: 'post_id' });

Comment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });

async function syncDatabase() {
    try {
        // console.log("Starting Database");

        // console.log("Synchronizing tables...");
        await sequelize.sync();
        console.log("Tables Wokring Fine.");

        const rolesCount = await Role.count();
        if (rolesCount === 0) {
            await Role.bulkCreate([
                { name: 'Admin' },
                { name: 'User' },
                { name: 'Editor' }
            ]);
            // console.log("Roles seeded.");
        }

        const categoriesCount = await Category.count();
        if (categoriesCount === 0) {
            await Category.bulkCreate([
                { name: 'Technology' },
                { name: 'Lifestyle' },
                { name: 'Education' },
                { name: 'Travel' },
                { name: 'Food' },
                { name: 'General' },
                { name: 'Other' }
            ]);
        }

        console.log("Database Successfully Connected.");
    } catch (err) {
        console.error("Database Sync Failed:", err);
    }
}

module.exports = {
    sequelize,
    Role,
    User,
    Category,
    Post,
    Comment,
    syncDatabase
};
