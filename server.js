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

// Enable CORS for all origins during development/testing
// For production, specify your frontend URL
// Example: app.use(cors({ origin: 'https://smart-brain-frontend-7xlb.onrender.com' }));
app.use(cors()); // Temporarily allow all origins for testing

app.use(express.json()); // Built-in body parser

// Database connection
const db = knex({ 
  client: 'pg',
  connection: {
    connectionString: 'postgresql://smart_brain_v2ks_user:rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R@dpg-d36vs80gjchc73brcnog-a/smart_brain_v2ks',
    host: 'dpg-d36vs80gjchc73brcnog-a.oregon-postgres.render.com',
    user: 'smart_brain_v2ks_user',
    password: 'rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R',
    database: 'smart_brain_v2ks'
  }
});

// Routes
app.get('/', (req, res) => { res.send('Server is running') });

// Sign in
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

// Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

// Profile
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

// Update user entries
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

// Face detection API call
app.post('/imageurl', handleApiCall);

// Start server
app.listen(3000, () => {
  console.log('app is running on port 3000');
});
