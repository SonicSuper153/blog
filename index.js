const express = require('express')
const path = require('path')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000;
const { syncDatabase } = require('./models/index');
const userRouter = require('./routes/user');

syncDatabase();
const staticRouter = require('./routes/staticRouter');
const blogRouter = require('./routes/blog');


require('./middlewares/sessions')(app);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "./views"))
app.locals.siteName = "My Blog";

app.use('/', staticRouter);
app.use('/user', userRouter);
app.use('/blogs', blogRouter);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})