// controllers/signin.js

// Example: exporting a function that handles sign-in requests
const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  // Fetch email and hash from the 'login' table
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length === 0) {
        // No user found with that email
        return res.status(400).json('wrong credentials');
      }

      // Compare password with hashed password in database
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        // Fetch user data from 'users' table
        return db.select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            if (user.length) {
              res.json(user[0]); // Send user info back
            } else {
              res.status(400).json('unable to get user');
            }
          });
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => {
      console.error('Error during sign-in:', err);
      res.status(500).json('internal server error');
    });
};

module.exports = { handleSignin };
