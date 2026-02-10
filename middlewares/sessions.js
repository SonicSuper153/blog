const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('../config/db');

module.exports = (app) => {
    app.use(require('express').json());
    app.use(require('express').urlencoded({ extended: true }));

    app.use(session({
        store: new pgSession({
<<<<<<< HEAD
            pool: pool,
            tableName: 'session'
=======
            pool: pool,               
            tableName: 'session'       
>>>>>>> 1bb3d35b65a2e6fce9a0c0b685bf969fee8f7914
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
<<<<<<< HEAD
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
=======
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } 
>>>>>>> 1bb3d35b65a2e6fce9a0c0b685bf969fee8f7914
    }));

    app.use((req, res, next) => {
        res.locals.user = req.session.user || null;
        next();
    });
};