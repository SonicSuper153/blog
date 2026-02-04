const { sql } = require('../config/db');

const bcrypt = require('bcryptjs');

class User {
    static async createTable() {
        const userTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                salt TEXT NOT NULL,
                profile_image TEXT,
                role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'EDITOR')),
                role_id INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        const roleIdMigrationQuery = `
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role_id') THEN
                    ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL;
                END IF;
            END $$;
        `;
        const sessionTableQuery = `
            CREATE TABLE IF NOT EXISTS "session" (
              "sid" varchar NOT NULL COLLATE "default",
              "sess" json NOT NULL,
              "expire" timestamp(6) NOT NULL
            ) WITH (OIDS=FALSE);
        `;
        const sessionPkeyQuery = `
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
                    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
                END IF;
            END $$;
        `;
        const sessionIndexQuery = `
            CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
        `;
        try {
            await sql.query(userTableQuery);
            await sql.query(roleIdMigrationQuery);
            await sql.query(sessionTableQuery);
            await sql.query(sessionPkeyQuery);
            await sql.query(sessionIndexQuery);
            console.log("Database tables ensured.");
        } catch (err) {
            console.error("Error creating tables:", err);
        }
    }

    static async create({ username, email, password, profile_image = null, role = 'USER' }) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = `
            INSERT INTO users (username, email, password, salt, profile_image, role)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, username, email, profile_image, role, created_at;
        `;
        try {
            const result = await sql.query(query, [username, email, hashedPassword, salt, profile_image, role.toUpperCase()]);
            return result;
        } catch (err) {
            if (err.code === '23505') { // Unique violation
                throw new Error("Email already exists");
            }
            throw err;
        }
    }

    static async findByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1;`;
        try {
            const result = await sql.query(query, [email]);
            return result[0];
        } catch (err) {
            throw err;
        }
    }

    static async findById(id) {
        const query = `SELECT id, username, email, profile_image, role, salt, created_at FROM users WHERE id = $1;`;
        try {
            const result = await sql.query(query, [id]);
            return result[0];
        } catch (err) {
            throw err;
        }
    }

    static async comparePassword(candidatePassword, hashedPassword) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }
}


module.exports = User;
