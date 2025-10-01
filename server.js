const signup = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
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
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/signup', (req, res) => { signup.handleSignup(req, res, db, bcrypt, saltRounds) });
app.get('/profile/:userId', (req, res) => { profile.handleGetProfile(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });  // FIXED THIS LINE
// Start server
app.listen(3000, () => {
  console.log('app is running on port 3000');
});
