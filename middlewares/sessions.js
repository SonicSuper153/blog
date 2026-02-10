const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('../config/db');

module.exports = (app) => {
    app.use(require('express').json());
    app.use(require('express').urlencoded({ extended: true }));

    app.use(session({
        store: new pgSession({
            pool: pool,
            tableName: 'session'
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    }));

    app.use((req, res, next) => {
        res.locals.user = req.session.user || null;
        next();
    });
};