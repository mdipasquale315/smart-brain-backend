// server.js
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const handleSignin = require('./controllers/signin');

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
  connection: 'postgresql://smart_brain_v2ks_user:rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R@dpg-d36vs80gjchc73brcnog-a.oregon-postgres.render.com:5432/smart_brain_v2ks' {
    host: 'dpg-d36vs80gjchc73brcnog-a.oregon-postgres.render.com',
    user: 'smart_brain_v2ks_user',
    password: 'rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R',
    database: 'smart_brain_v2ks',
    port: 5432
  }
});

// Routes
app.get('/', (req, res) => res.send('Server is running'));

// Sign in route
app.post('/signin', (req, res) => {
  handleSignin(db, bcrypt)(req, res);
});

// Other routes...
// e.g., register, profile, image, etc.

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
