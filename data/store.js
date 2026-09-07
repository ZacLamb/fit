// In-memory data store — no database required. Good for a quick demo;
// data resets whenever the server restarts. Swap this module out for
// db/pool.js + real Postgres queries whenever you're ready to run this
// for real — the route files are the only other place that would need
// to change.

const services = [
  {
    id: 1,
    slug: 'sports-performance',
    name: 'Sports Performance Training',
    short_desc: 'Speed, power, and explosiveness for competitive athletes.',
    long_desc: 'Built for athletes who want to move faster, jump higher, and hold up over a full season. Sessions blend speed mechanics, power development, and sport-specific conditioning, programmed around your competition calendar.',
    duration_min: 60,
    price_label: 'From $65 / session',
    sort_order: 1,
    active: true,
    image_path: '/images/stock/sprint-start.jpg',
    focus_points: ['Acceleration and top-end speed mechanics', 'Explosive power development', 'Sport-specific conditioning blocks', 'Programmed around your season and competition calendar']
  },
  {
    id: 2,
    slug: 'strength-conditioning',
    name: 'Strength & Conditioning',
    short_desc: 'Build a stronger, more resilient base year-round.',
    long_desc: 'Foundational strength work for athletes and everyday clients alike. We program progressive lifting, conditioning, and mobility work so you get stronger without breaking down.',
    duration_min: 60,
    price_label: 'From $60 / session',
    sort_order: 2,
    active: true,
    image_path: '/images/stock/chalk-hands.jpg',
    focus_points: ['Progressive strength programming', 'Conditioning built around your baseline', 'Mobility work to support long-term training', 'Technique first, load added once it is earned']
  },
  {
    id: 3,
    slug: 'injury-prevention',
    name: 'Injury Prevention & Recovery',
    short_desc: 'Move well, stay on the field, and train through old limitations.',
    long_desc: 'A movement-first approach for clients returning from injury or looking to stay ahead of one. We assess how you move, correct the gaps, and build a plan that keeps you training consistently.',
    duration_min: 45,
    price_label: 'From $55 / session',
    sort_order: 3,
    active: true,
    image_path: '/images/stock/coach-spot.jpg',
    focus_points: ['Movement assessment to find the real limitation', 'Corrective work built into every session', 'Gradual return-to-training progressions', 'Close coordination with your PT or physician, if applicable']
  },
  {
    id: 4,
    slug: 'one-on-one',
    name: '1-on-1 Personal Training',
    short_desc: 'Fully individualized coaching, every session.',
    long_desc: "One coach, one athlete, one plan. Every session is built around your goals, your schedule, and where you are today — no generic programming.",
    duration_min: 60,
    price_label: 'From $70 / session',
    sort_order: 4,
    active: true,
    image_path: '/images/stock/coach-spot.jpg',
    focus_points: ['A plan built entirely around your goals', 'Hands-on coaching and form correction every rep', 'Progress tracked and adjusted session to session', 'Flexible scheduling around your week']
  },
  {
    id: 5,
    slug: 'free-consult',
    name: 'Free Movement Consult',
    short_desc: 'Not sure where to start? Come in and find out.',
    long_desc: 'A no-cost, no-pressure walkthrough of the space, a quick movement assessment, and a conversation about your goals. This is how most new clients start.',
    duration_min: 30,
    price_label: 'Free',
    sort_order: 5,
    active: true,
    image_path: '/images/facility.jpg',
    focus_points: ['A tour of the space and equipment', 'A quick, no-pressure movement assessment', 'A conversation about your goals and schedule', 'A recommendation on which program fits — no obligation']
  }
];

const products = [
  { id: 1, slug: 'zezze-tee', name: 'Zezze Athletics Tee', description: 'Heavyweight cotton training tee with the Zezze Athletics wordmark.', price_cents: 2800, image_path: '/images/merch/tee.jpg', sizes: 'S,M,L,XL,XXL', active: true, sort_order: 1 },
  { id: 2, slug: 'zezze-hoodie', name: 'Zezze Athletics Hoodie', description: 'Midweight fleece hoodie for the walk to and from the gym.', price_cents: 5200, image_path: '/images/merch/hoodie.jpg', sizes: 'S,M,L,XL,XXL', active: true, sort_order: 2 },
  { id: 3, slug: 'zezze-hat', name: 'Zezze Athletics Hat', description: 'Structured six-panel cap, adjustable strap.', price_cents: 2400, image_path: '/images/merch/hat.jpg', sizes: null, active: true, sort_order: 3 },
  { id: 4, slug: 'zezze-bottle', name: 'Zezze Athletics Bottle', description: '32oz stainless steel training bottle.', price_cents: 2200, image_path: '/images/merch/bottle.jpg', sizes: null, active: true, sort_order: 4 }
];

// day_of_week: 0 = Sunday ... 6 = Saturday
const availabilityRules = [
  { day_of_week: 1, start_time: '06:00', end_time: '20:00' },
  { day_of_week: 2, start_time: '06:00', end_time: '20:00' },
  { day_of_week: 3, start_time: '06:00', end_time: '20:00' },
  { day_of_week: 4, start_time: '06:00', end_time: '20:00' },
  { day_of_week: 5, start_time: '06:00', end_time: '20:00' },
  { day_of_week: 6, start_time: '08:00', end_time: '13:00' }
];

const blackoutDates = []; // add 'YYYY-MM-DD' strings to block a date

const bookings = []; // { id, service_id, client_name, client_email, client_phone, notes, booking_date, start_time, end_time, status }
let nextBookingId = 1;

const orders = []; // { stripe_session_id, amount_total_cents, status, line_items, customer_email }

module.exports = {
  services,
  products,
  availabilityRules,
  blackoutDates,
  bookings,
  orders,
  nextBookingId: () => nextBookingId++
};
