## Plan: Admin Panel for Blog Application (with Folder and Function Details)

This plan outlines the steps to implement the requested admin panel features, specifying which folders to use and what functions to create.

### Steps
1. **Category Master**
   - **Folders**:
     - Use: `models/`, `controllers/`, `routes/`, `views/`
   - **Functions**:
     - `models/category.js`: Define the `Category` model with CRUD methods.
     - `controllers/categoryController.js`: Create functions for `createCategory`, `getCategories`, `updateCategory`, `deleteCategory`.
     - `routes/categoryRouter.js`: Define routes for category management.
     - `views/admin/categories.ejs`: Create views for listing, adding, and editing categories.

2. **User Master**
   - **Folders**:
     - Use: `models/`, `controllers/`, `routes/`, `views/`
   - **Functions**:
     - `models/user.js`: Add methods for searching and filtering users.
     - `controllers/userController.js`: Create functions for `getUsers`, `updateUserRole`.
     - `routes/userRouter.js`: Define admin routes for user management.
     - `views/admin/users.ejs`: Create views for listing users in a grid layout with search and filter options.

3. **Role-Based Access Control (RBAC)**
   - **Folders**:
     - Use: `middlewares/`
   - **Functions**:
     - `middlewares/roleMiddleware.js`: Create middleware for `requireRole` to enforce role-based access.

4. **Post Master**
   - **Folders**:
     - Use: `models/`, `controllers/`, `routes/`, `views/`
   - **Functions**:
     - `models/blog.js`: Add methods for managing blog posts.
     - `controllers/blogController.js`: Create functions for `createPost`, `getPosts`, `updatePost`, `deletePost`.
     - `routes/blogRouter.js`: Define routes for managing blog posts.
     - `views/admin/posts.ejs`: Create views for listing, adding, and editing posts.

5. **Comments**
   - **Folders**:
     - Use: `models/`, `controllers/`, `routes/`, `views/`
   - **Functions**:
     - `models/comment.js`: Define the `Comment` model with CRUD methods.
     - `controllers/commentController.js`: Create functions for `addComment`, `deleteComment`, `getComments`.
     - `routes/commentRouter.js`: Define routes for managing comments.
     - `views/blog/post.ejs`: Update the blog post view to display comments.

6. **Session-Based Application**
   - **Folders**:
     - Use: `middlewares/`, `public/js/`
   - **Functions**:
     - `middlewares/sessionMiddleware.js`: Add session timeout and auto-logout functionality.
     - `public/js/validation.js`: Implement client-side form validation using `jQuery Validation`.

7. **Image Upload**
   - **Folders**:
     - Use: `middlewares/`, `public/uploads/`
   - **Functions**:
     - `middlewares/uploadMiddleware.js`: Configure `multer` for handling image uploads.
     - Update `controllers/blogController.js` and `controllers/userController.js` to handle image uploads.

### Further Considerations
1. **Dashboard**:
   - Use: `views/admin/dashboard.ejs`, `controllers/dashboardController.js`
   - Functions: `getDashboardStats` to fetch and display admin statistics.
2. **Pagination**:
   - Add pagination logic to `controllers/userController.js` and `controllers/blogController.js`.
3. **Rich Text Editor**:
   - Integrate Quill.js or TinyMCE in `views/admin/posts.ejs` for blog content editing.
4. **Clarification Needed**:
   - Define the scope of "Post Master" and confirm if additional features are required.
