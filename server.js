const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const signup = require('./controllers/register.js');
const signin = require('./controllers/signin.js');
const profile = require('./controllers/profile.js');
const image = require('./controllers/image.js');

const saltRounds = 10;
const app = express();
app.use(express.json());
app.use(cors());

const db = knex({ 
  client: 'pg',
  connection: {
    connectionString: 'postgresql://smart_brain_v2ks_user:rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R@dpg-d36vs80gjchc73brcnog-a.oregon-postgres.render.com:5432/smart_brain_v2ks',
    ssl: { rejectUnauthorized: false }
  }
});

app.get('/', (req, res) => { res.json("Welcome to Face Detection API...") });
// Dependency Injection
app.post('/signin', signin.handleSignin(db, bcrypt));  // FIXED: Pass db and bcrypt directly
app.post('/signup', (req, res) => { signup.registerHandler(req, res, db, bcrypt, saltRounds) });
app.get('/profile/:userId', (req, res) => { profile.handleGetProfile(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });
// Start server
app.listen(3000, () => {
  console.log('app is running on port 3000');
});
