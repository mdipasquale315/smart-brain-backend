// Assuming you're using knex for db and bcryptjs for hashing
const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }

  // Find the user login info by email
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length === 0) {
        // Email not found
        return res.status(400).json('Wrong credentials');
      }

      const hash = data[0].hash;

      // Compare provided password with hash
      const isValid = bcrypt.compareSync(password, hash);

      if (isValid) {
        // Fetch user info
        return db.select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            if (user.length) {
              res.json(user[0]);
            } else {
              res.status(400).json('Unable to get user');
            }
          });
      } else {
        // Password mismatch
        return res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => {
      console.error('Error during sign-in:', err);
      res.status(500).json('Internal server error');
    });
};

module.exports = { handleSignin };
