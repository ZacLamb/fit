const express = require('express');
const router = express.Router();
const store = require('../data/store');

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function minutesToTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
}

// Booking page: pick a service, then a date/time.
router.get('/', (req, res) => {
  const services = store.services.filter((s) => s.active).sort((a, b) => a.sort_order - b.sort_order);
  res.render('booking', { services });
});

// Returns available start times (JSON) for a given service + date.
// GET /booking/slots?service_id=1&date=2026-09-15
router.get('/slots', (req, res) => {
  const { service_id, date } = req.query;
  if (!service_id || !date) return res.status(400).json({ error: 'service_id and date required' });

  const service = store.services.find((s) => s.id === Number(service_id));
  if (!service) return res.status(404).json({ error: 'service not found' });
  const duration = service.duration_min;

  const dateObj = new Date(`${date}T00:00:00`);
  if (dateObj < new Date(new Date().toDateString())) {
    return res.json({ slots: [] }); // no past dates
  }
  const dow = dateObj.getDay();

  if (store.blackoutDates.includes(date)) return res.json({ slots: [] });

  const rules = store.availabilityRules.filter((r) => r.day_of_week === dow);
  if (!rules.length) return res.json({ slots: [] });

  const busy = store.bookings
    .filter((b) => b.booking_date === date && b.status === 'confirmed')
    .map((b) => ({ start: timeToMinutes(b.start_time), end: timeToMinutes(b.end_time) }));

  const slots = [];
  const now = new Date();
  const isToday = dateObj.toDateString() === now.toDateString();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const rule of rules) {
    const startMin = timeToMinutes(rule.start_time);
    const endMin = timeToMinutes(rule.end_time);
    for (let t = startMin; t + duration <= endMin; t += 30) {
      if (isToday && t <= nowMinutes + 60) continue; // require 1hr lead time
      const overlaps = busy.some((b) => t < b.end && t + duration > b.start);
      if (!overlaps) slots.push(minutesToTime(t));
    }
  }

  res.json({ slots });
});

// Create a booking.
router.post('/', (req, res) => {
  const { service_id, date, start_time, client_name, client_email, client_phone, notes } = req.body;
  if (!service_id || !date || !start_time || !client_name || !client_email) {
    return res.status(400).send('Missing required fields.');
  }

  const service = store.services.find((s) => s.id === Number(service_id));
  if (!service) return res.status(404).send('Service not found.');
  const duration = service.duration_min;
  const startMin = timeToMinutes(start_time);
  const endTime = minutesToTime(startMin + duration);

  // Re-check the slot is still free (race condition guard).
  const conflict = store.bookings.some(
    (b) => b.booking_date === date && b.status === 'confirmed' && b.start_time < endTime && b.end_time > start_time
  );
  if (conflict) {
    return res.status(409).send('That time was just booked by someone else — please pick another.');
  }

  const booking = {
    id: store.nextBookingId(),
    service_id: service.id,
    client_name,
    client_email,
    client_phone: client_phone || null,
    notes: notes || null,
    booking_date: date,
    start_time,
    end_time: endTime,
    status: 'confirmed'
  };
  store.bookings.push(booking);

  res.render('booking-success', {
    booking: {
      id: booking.id,
      service: service.name,
      date,
      start_time,
      end_time: endTime,
      client_name
    }
  });
});

module.exports = router;
