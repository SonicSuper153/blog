const { sql } = require('../config/db');

class Category {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        try {
            await sql.query(query);
            console.log("Categories table ensured.");
        } catch (err) {
            console.error("Error creating categories table:", err);
        }
    }

    static async create({ name, slug, status = 'Active' }) {
        const query = `
            INSERT INTO categories (name, slug, status)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        return await sql.query(query, [name, slug, status]);
    }

    static async findAll() {
        return await sql.query(`SELECT * FROM categories ORDER BY name ASC;`);
    }
}


module.exports = Category;
