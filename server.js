const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const { handleApiCall, handleImage } = require('./controllers/image');

const app = express();

// Configure CORS to allow requests from your deployed frontend
const corsOptions = {
  origin: 'https://smart-brain-frontend-7xlb.onrender.com', // replace if different
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Enable CORS with specific origin
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json()); // Built-in body parser

// Database connection (consider using environment variables for sensitive info)
const db = knex({ 
  client: 'pg',
  connection: {
    connectionString: 'postgresql://smart_brain_v2ks_user:rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R',
    host: 'dpg-d36vs80gjchc73brcnog-a.oregon-postgres.render.com',
    user: 'smart_brain_v2ks_user',
    password: 'rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R',
    database: 'smart_brain_v2ks'
  }
});

// Routes
app.get('/', (req, res) => res.send('Server is running'));

// Sign in
app.post('/signin', async (req, res) => {
  try {
    await signin.handleSignin(req, res, db, bcrypt);
  } catch (err) {
    console.error('Error in /signin:', err);
    res.status(500).json('Server error');
  }
});

// Register
app.post('/register', async (req, res) => {
  try {
    await register.handleRegister(req, res, db, bcrypt);
  } catch (err) {
    console.error('Error in /register:', err);
    res.status(500).json('Server error');
  }
});

// Profile get
app.get('/profile/:id', async (req, res) => {
  try {
    await profile.handleProfileGet(req, res, db);
  } catch (err) {
    console.error('Error in /profile/:id:', err);
    res.status(500).json('Server error');
  }
});

// Update user entries
app.put('/image', async (req, res) => {
  try {
    await image.handleImage(req, res, db);
  } catch (err) {
    console.error('Error in /image:', err);
    res.status(500).json('Server error');
  }
});

// Face detection API call
app.post('/imageurl', handleApiCall);

// Start server
app.listen(3000, () => {
  console.log('app is running on port 3000');
});
