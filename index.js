const express = require('express');
const path = require('path');
require('dotenv').config();

const { syncDatabase } = require('./models/index');
const staticRouter = require('./routes/staticRouter');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

const app = express();
const port = process.env.PORT || 3000;

// Initialize database
syncDatabase();

// Middleware
require('./middlewares/sessions')(app);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global View Locals
<<<<<<< HEAD
// app.use(require('./middlewares/viewLocals'));
=======
app.use(require('./middlewares/viewLocals'));
>>>>>>> 1bb3d35b65a2e6fce9a0c0b685bf969fee8f7914

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.locals.siteName = "My Blog";

// Routes
app.use('/', staticRouter);
app.use('/user', userRouter);
app.use('/blogs', blogRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});