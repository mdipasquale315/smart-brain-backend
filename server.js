const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({ 
  // connect to your own database here:
  client: 'pg',
  connection: {
    connectionString : 'postgresql://smart_brain_v2ks_user:rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R@dpg-d36vs80gjchc73brcnog-a/smart_brain_v2ks',
    host : 'dpg-d36vs80gjchc73brcnog-a.oregon-postgres.render.com',
    user : 'smart_brain_v2ks_user',
    password : 'rrXdrLyOD8bYVKbKCtIEV56kRuS0vs8R',
    database : 'smart_brain_v2ks'
  }
});


;


const app = express();
app.use(cors({
  origin: 'https://smart-brain-frontend-7xlb.onrender.com'
}));
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!
const { handleApiCall, handleImage } = require('./controllers/image');

app.put('/image', handleImage);
app.post('/imageurl', handleApiCall);


app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
