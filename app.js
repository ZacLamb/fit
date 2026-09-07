require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets are served directly by Netlify's CDN from the publish
// directory in production (see netlify.toml). This line keeps `npm start`
// working the same way for local development and on Railway.
app.use(express.static(path.join(__dirname, 'public')));

// Demo mode: sessions live in memory (per warm server instance). This is
// fine for a demo or low-traffic single-server deploy. If you move to a
// serverless platform with real traffic, or want cart/session data to
// survive a restart, swap this for a real session store (e.g.
// connect-pg-simple against Postgres) — see README.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'zezze-athletics-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, secure: process.env.NODE_ENV === 'production' }
  })
);

// Site-wide locals available in every view
app.use((req, res, next) => {
  res.locals.business = {
    name: 'Zezze Athletics',
    partner: 'Cape Cod Holistic Fitness',
    address: '2 Tupper Rd, Sandwich, MA 02563',
    tagline: 'A new chapter begins.',
    instagramHandle: '@zezzeathletics'
  };
  res.locals.cartCount = req.session.cart ? req.session.cart.reduce((s, i) => s + i.qty, 0) : 0;
  res.locals.currentPath = req.path;
  next();
});

app.use('/', require('./routes/index'));
app.use('/services', require('./routes/services'));
app.use('/booking', require('./routes/booking'));
app.use('/shop', require('./routes/shop'));

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again.');
});

module.exports = app;
