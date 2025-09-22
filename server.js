// server.js
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const handleSignin = require('./controllers/signin');
const handleRegister = require('./controllers/register');

const app = express();

// CORS setup
const corsOptions = {
  origin: 'https://smart-brain-frontend-7xlb.onrender.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json()); // body parser

// Database setup
const db = knex({ 
  client: 'pg',
  connection: {
    connectionString: 'postgresql://smart_brain_v2ks_user:rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R@dpg-d36vs80gjchc73brcnog-a.oregon-postgres.render.com:5432/smart_brain_v2ks',
    ssl: { rejectUnauthorized: false }
  }
});

// Routes
app.get('/', (req, res) => res.send('Server is running'));

// Sign in route
app.post('/signin', (req, res) => handleSignin(db, bcrypt)(req, res));

// Register route
app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));

// Start server
app.listen(3000, () => {
  console.log('app is running on port 3000');
});
