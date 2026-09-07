const express = require('express');
const router = express.Router();
const store = require('../data/store');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
}

function getCart(req) {
  if (!req.session.cart) req.session.cart = []; // [{product_id, name, price_cents, size, qty, image_path}]
  return req.session.cart;
}

router.get('/', (req, res) => {
  const products = store.products.filter((p) => p.active).sort((a, b) => a.sort_order - b.sort_order);
  res.render('shop', { products });
});

router.get('/product/:slug', (req, res) => {
  const product = store.products.find((p) => p.slug === req.params.slug && p.active);
  if (!product) return res.status(404).render('404');
  res.render('product', { product });
});

router.post('/cart/add', (req, res) => {
  const { product_id, size, qty } = req.body;
  const product = store.products.find((p) => p.id === Number(product_id) && p.active);
  if (!product) return res.status(404).send('Product not found.');

  const cart = getCart(req);
  const quantity = Math.max(1, parseInt(qty, 10) || 1);
  const existing = cart.find((i) => i.product_id === product.id && i.size === (size || null));
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({
      product_id: product.id,
      name: product.name,
      price_cents: product.price_cents,
      size: size || null,
      qty: quantity,
      image_path: product.image_path
    });
  }
  res.redirect('/shop/cart');
});

router.post('/cart/remove', (req, res) => {
  const { index } = req.body;
  const cart = getCart(req);
  cart.splice(parseInt(index, 10), 1);
  res.redirect('/shop/cart');
});

router.get('/cart', (req, res) => {
  const cart = getCart(req);
  const total = cart.reduce((sum, i) => sum + i.price_cents * i.qty, 0);
  res.render('cart', { cart, total, stripeEnabled: !!stripe });
});

router.post('/checkout', async (req, res, next) => {
  try {
    const cart = getCart(req);
    if (!cart.length) return res.redirect('/shop/cart');

    if (!stripe) {
      return res.status(500).send(
        'Stripe is not configured in this demo. Add a STRIPE_SECRET_KEY environment variable to accept real payments. See README.'
      );
    }

    const line_items = cart.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.size ? `${item.name} (${item.size})` : item.name },
        unit_amount: item.price_cents
      },
      quantity: item.qty
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${req.protocol}://${req.get('host')}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/shop/cart`
    });

    store.orders.push({
      stripe_session_id: session.id,
      amount_total_cents: cart.reduce((s, i) => s + i.price_cents * i.qty, 0),
      status: 'pending',
      line_items: cart
    });

    res.redirect(303, session.url);
  } catch (err) {
    next(err);
  }
});

router.get('/checkout/success', async (req, res, next) => {
  try {
    const { session_id } = req.query;
    if (stripe && session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      const order = store.orders.find((o) => o.stripe_session_id === session_id);
      if (order) {
        order.status = 'paid';
        order.customer_email = session.customer_details ? session.customer_details.email : null;
      }
    }
    req.session.cart = [];
    res.render('checkout-success');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
