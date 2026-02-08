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
app.use(require('./middlewares/viewLocals'));

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