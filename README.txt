# BLOG_APP - Complete Development Guide

## Introduction
This is a Node.js-based blog application using Express.js, PostgreSQL (via Neon), EJS templating, and Bootstrap for UI. Currently, it has user authentication (signup, signin, logout) with session-based auth and password hashing. The goal is to build a full-featured blog platform with CRUD operations for posts, user roles, profile management, and more.

This README provides detailed steps to complete the project, including implementation details, code snippets, and tests to verify each feature. Follow the steps sequentially for a smooth development process.

## Prerequisites
- Node.js (v16+)
- npm or yarn
- PostgreSQL database (using Neon serverless)
- Git (for version control)
- A code editor (e.g., VS Code)
- Basic knowledge of JavaScript, Express, and SQL

## Setup Instructions
1. Clone or navigate to the project directory.
2. Install dependencies: `npm install`
3. Create a `.env` file in the root with:
   ```
   DATABASE_URL=your_neon_database_url
   SESSION_SECRET=your_secure_random_string
   PORT=3000
   ```
4. Run the app: `npm run dev` (for development with nodemon).
5. Access at `http://localhost:3000`.

## Step-by-Step Completion Guide

### Step 1: Implement Blog CRUD Operations
**Objective**: Add models, routes, and views for creating, reading, updating, and deleting blog posts.

**Implementation**:
1. Create `models/blog.js`:
   ```javascript
   const { sql } = require('../config/db');

   class Blog {
       static async createTable() {
           const query = `
               CREATE TABLE IF NOT EXISTS blogs (
                   id SERIAL PRIMARY KEY,
                   title VARCHAR(255) NOT NULL,
                   content TEXT NOT NULL,
                   author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
               );
           `;
           await sql.query(query);
       }

       static async create({ title, content, author_id }) {
           const query = `INSERT INTO blogs (title, content, author_id) VALUES ($1, $2, $3) RETURNING *;`;
           const result = await sql.query(query, [title, content, author_id]);
           return result[0];
       }

       static async findAll() {
           const query = `SELECT blogs.*, users.username FROM blogs JOIN users ON blogs.author_id = users.id ORDER BY created_at DESC;`;
           const result = await sql.query(query);
           return result;
       }

       static async findById(id) {
           const query = `SELECT blogs.*, users.username FROM blogs JOIN users ON blogs.author_id = users.id WHERE blogs.id = $1;`;
           const result = await sql.query(query, [id]);
           return result[0];
       }

       static async update(id, { title, content }) {
           const query = `UPDATE blogs SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *;`;
           const result = await sql.query(query, [title, content, id]);
           return result[0];
       }

       static async delete(id) {
           const query = `DELETE FROM blogs WHERE id = $1;`;
           await sql.query(query, [id]);
       }
   }

   Blog.createTable();
   module.exports = Blog;
   ```

2. Create `routes/blog.js`:
   ```javascript
   const { Router } = require('express');
   const router = Router();
   const Blog = require('../models/blog');

   // Middleware to check if user is logged in
   const requireAuth = (req, res, next) => {
       if (!req.session.user) return res.redirect('/user/signin');
       next();
   };

   router.get('/', async (req, res) => {
       const blogs = await Blog.findAll();
       res.render('blogs/index', { blogs });
   });

   router.get('/new', requireAuth, (req, res) => {
       res.render('blogs/new');
   });

   router.post('/', requireAuth, async (req, res) => {
       const { title, content } = req.body;
       await Blog.create({ title, content, author_id: req.session.user.id });
       res.redirect('/blogs');
   });

   router.get('/:id', async (req, res) => {
       const blog = await Blog.findById(req.params.id);
       if (!blog) return res.status(404).send('Blog not found');
       res.render('blogs/show', { blog });
   });

   router.get('/:id/edit', requireAuth, async (req, res) => {
       const blog = await Blog.findById(req.params.id);
       if (!blog || blog.author_id !== req.session.user.id) return res.status(403).send('Unauthorized');
       res.render('blogs/edit', { blog });
   });

   router.post('/:id', requireAuth, async (req, res) => {
       const blog = await Blog.findById(req.params.id);
       if (!blog || blog.author_id !== req.session.user.id) return res.status(403).send('Unauthorized');
       const { title, content } = req.body;
       await Blog.update(req.params.id, { title, content });
       res.redirect(`/blogs/${req.params.id}`);
   });

   router.post('/:id/delete', requireAuth, async (req, res) => {
       const blog = await Blog.findById(req.params.id);
       if (!blog || blog.author_id !== req.session.user.id) return res.status(403).send('Unauthorized');
       await Blog.delete(req.params.id);
       res.redirect('/blogs');
   });

   module.exports = router;
   ```

3. Add to `index.js`: `app.use('/blogs', require('./routes/blog'));`

4. Create views in `views/blogs/`:
   - `index.ejs`: List all blogs.
   - `new.ejs`: Form to create blog.
   - `show.ejs`: Display single blog.
   - `edit.ejs`: Form to edit blog.

**Test**:
- Run the app and visit `/blogs`. Should show an empty list.
- Sign in, go to `/blogs/new`, create a blog. Check database and page.
- View, edit, delete blogs. Verify only author can edit/delete.

### Step 2: Implement User Roles and Permissions
**Objective**: Enforce admin permissions for certain actions.

**Implementation**:
1. Add middleware `middlewares/auth.js`:
   ```javascript
   const requireAdmin = (req, res, next) => {
       if (!req.session.user || req.session.user.role !== 'ADMIN') return res.status(403).send('Admin access required');
       next();
   };

   module.exports = { requireAdmin };
   ```

2. In `routes/blog.js`, add admin-only routes (e.g., delete any blog).
3. Update nav to show admin links if role is ADMIN.

**Test**: Create a user with role 'ADMIN' in DB, test access.

### Step 3: Add Profile Image Upload
**Objective**: Allow users to upload and display profile images.

**Implementation**:
1. Install `multer`: `npm install multer`
2. Add to `middlewares/index.js`:
   ```javascript
   const multer = require('multer');
   const upload = multer({ dest: 'public/uploads/' });
   // Export upload for use in routes
   ```
3. In `routes/user.js`, add profile route with upload.
4. Update views to display images.

**Test**: Upload an image, check `public/uploads/` and profile page.

### Step 4: Improve Error Handling and UI
**Objective**: Use EJS error pages instead of plain text.

**Implementation**:
1. Create `views/error.ejs`.
2. In routes, render error page on failures.

**Test**: Trigger errors and verify pages render.

### Step 5: Add Server-Side Validation
**Objective**: Validate inputs with `express-validator`.

**Implementation**:
1. Install `express-validator`.
2. Add validation to routes.

**Test**: Submit invalid forms, check errors.

### Step 6: Enhance Security
**Objective**: Add Helmet, rate limiting.

**Implementation**:
1. Install `helmet`, `express-rate-limit`.
2. Add to middlewares.

**Test**: Check headers, test rate limits.

### Step 7: Add Testing
**Objective**: Use Jest for unit tests.

**Implementation**:
1. Install `jest`, `supertest`.
2. Write tests for models and routes.

**Test**: Run `npm test`, verify coverage.

### Step 8: Documentation and Deployment
**Objective**: Complete README, add CI/CD.

**Implementation**:
1. Update README with full docs.
2. Add GitHub Actions for CI.

**Test**: Push to repo, check CI.

## Standout Features to Add
- **Comments and Likes**: Allow users to comment on blogs and like posts.
- **Categories/Tags**: Organize blogs by categories.
- **Search and Filtering**: Add search bar with filters.
- **Rich Text Editor**: Use Quill.js for blog content.
- **Notifications**: Email notifications for new comments (use Nodemailer).
- **Social Sharing**: Buttons to share blogs on social media.
- **Analytics**: Track views with a simple counter.
- **Dark Mode**: Toggle theme with Bootstrap.
- **API Endpoints**: Add REST API for mobile app integration.
- **Pagination**: For blog lists to handle large data.
- **User Dashboard**: Personalized page with user's blogs and stats.

This guide will turn your app into a robust blog platform. Start with Step 1 and test each one!