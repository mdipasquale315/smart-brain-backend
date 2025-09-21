const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }

  // Find email and hash in login table
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then(data => {
      if (data.length === 0) {
        return res.status(400).json('Wrong credentials');
      }

      const isValid = bcrypt.compareSync(password, data[0].hash);
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
        return res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => {
      console.error('Error during sign-in:', err);
      res.status(500).json('Internal server error');
    });
};

module.exports = { handleSignin };
      res.status(500).json('internal server error');
    });
};

module.exports = { handleSignin };
