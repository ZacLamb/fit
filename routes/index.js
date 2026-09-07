const express = require('express');
const router = express.Router();
const store = require('../data/store');

router.get('/', (req, res) => {
  const services = store.services.filter((s) => s.active).sort((a, b) => a.sort_order - b.sort_order).slice(0, 4);
  res.render('index', { services });
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact', { sent: false });
});

router.post('/contact', (req, res) => {
  // Demo mode: just logs the inquiry. Wire this up to email/SMS/GHL once
  // you're running this for real — see README.
  const { name, email, phone, message } = req.body;
  console.log('New contact inquiry:', { name, email, phone, message });
  res.render('contact', { sent: true });
});

module.exports = router;
