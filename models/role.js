const { sql } = require('../config/db');

class Role {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        try {
            await sql.query(query);
            console.log("Roles table ensured.");
            await this.seed();
        } catch (err) {
            console.error("Error creating roles table:", err);
        }
    }

    static async seed() {
        const roles = ['Admin', 'User', 'Editor'];
        for (const name of roles) {
            try {
                const checkQuery = `SELECT * FROM roles WHERE name = $1;`;
                const existing = await sql.query(checkQuery, [name]);
                if (existing.length === 0) {
                    const insertQuery = `INSERT INTO roles (name) VALUES ($1);`;
                    await sql.query(insertQuery, [name]);
                    console.log(`Role '${name}' seeded.`);
                }
            } catch (err) {
                console.error(`Error seeding role ${name}:`, err);
            }
        }
    }

    static async findAll() {
        const query = `SELECT * FROM roles;`;
        return await sql.query(query);
    }
}


module.exports = Role;
