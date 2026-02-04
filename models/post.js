const { sql } = require('../config/db');

class Post {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                featured_image TEXT,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        try {
            await sql.query(query);
            console.log("Posts table ensured.");
        } catch (err) {
            console.error("Error creating posts table:", err);
        }
    }

    static async create({ title, content, featured_image = null, user_id, category_id = null }) {
        const query = `
            INSERT INTO posts (title, content, featured_image, user_id, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        try {
            const result = await sql.query(query, [title, content, featured_image, user_id, category_id]);
            return result[0];
        } catch (err) {
            throw err;
        }
    }

    static async findAll() {
        const query = `
            SELECT p.*, u.username as author_name, c.name as category_name 
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC;
        `;
        return await sql.query(query);
    }

    static async findById(id) {
        const query = `SELECT * FROM posts WHERE id = $1;`;
        const result = await sql.query(query, [id]);
        return result[0];
    }
}


module.exports = Post;
