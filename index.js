const express = require('express')
const path = require('path')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000;
const User = require('./models/user');
const userRouter = require('./routes/user');
const staticRouter = require('./routes/staticRouter');


require('./middlewares/sessions')(app);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "./views"))
app.locals.siteName = "My Blog";

app.use('/', staticRouter);
app.use('/user', userRouter);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})