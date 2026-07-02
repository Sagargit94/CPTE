require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabaseAdmin } = require('./lib/supabase');

const templatesRouter = require('./routes/templates');
const attemptsRouter = require('./routes/attempts');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  const { data: userRow, error: userErr } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
  if (userErr || !userRow) {
    return res.status(401).json({ error: 'User profile not found' });
  }
  req.user = userRow;
  next();
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/api/templates', requireAuth, templatesRouter);
app.use('/api/attempts', requireAuth, attemptsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CPTE API server running on port ${PORT}`);
});
