// Local development / Railway entry point.
// Netlify deployments use netlify/functions/app.js instead (see README).
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zezze Athletics running on port ${PORT}`);
});
