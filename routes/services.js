const express = require('express');
const router = express.Router();
const store = require('../data/store');

router.get('/', (req, res) => {
  const services = store.services.filter((s) => s.active).sort((a, b) => a.sort_order - b.sort_order);
  res.render('services', { services });
});

router.get('/:slug', (req, res) => {
  const service = store.services.find((s) => s.slug === req.params.slug && s.active);
  if (!service) return res.status(404).render('404');
  res.render('service-detail', { service });
});

module.exports = router;
