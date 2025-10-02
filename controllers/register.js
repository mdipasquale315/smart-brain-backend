const fetch = require('node-fetch');

const registerHandler = async (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  try {
    const hash = await bcrypt.hash(password, null, null);
    await db.transaction(async trx => {
      await trx('login')
        .insert({
          email: email,
          hash: hash
        });
      const user = await trx('users')
        .returning('*')
        .insert({
          email: email,
          name: name,
          joined: new Date()
        });
      res.json(user[0]);
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json('Unable to register');
  }
};

module.exports = {
  registerHandler
};
