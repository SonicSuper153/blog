const { sql } = require('../config/db');

class Comment {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                comment_text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        try {
            await sql.query(query);
            console.log("Comments table ensured.");
        } catch (err) {
            console.error("Error creating comments table:", err);
        }
    }

    static async create({ post_id, user_id, comment_text }) {
        const query = `
            INSERT INTO comments (post_id, user_id, comment_text)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        return await sql.query(query, [post_id, user_id, comment_text]);
    }

    static async findByPostId(post_id) {
        const query = `
            SELECT c.*, u.username 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC;
        `;
        return await sql.query(query, [post_id]);
    }
}


module.exports = Comment;
