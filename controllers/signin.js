import fetch from 'node-fetch';
// controllers/signin.js
const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }

  // Find the email and hash from login table
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length === 0) {
        return res.status(400).json('Wrong credentials');
      }

      const hash = data[0].hash;

      // Check password validity
      const isValid = bcrypt.compareSync(password, hash);
      if (isValid) {
        // Fetch user info from users table
        return db.select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            if (user.length) {
              res.json(user[0]);
            } else {
              res.status(400).json('Unable to get user');
            }
          })
          .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json('Unable to get user');
          });
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => {
      console.error('Error during login:', err);
      res.status(500).json('Internal server error');
    });
};

module.exports = handleSignin; // Export as a function
