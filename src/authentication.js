const jwt = require('jsonwebtoken');

const secret = '7f25474b46424e4118ac24efe79778ea762b2c3fbc2a5f07c7958fe4915b990c15cb6dfc493d8aec526cfa2a2ef8e5a79ad3936ffd97268e22775c908f38a6b6';

function generateAccessToken(username) {
  return jwt.sign({username: username}, secret, { expiresIn: '24h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      console.log(err)
      return res.sendStatus(403)
    }
    req.user = user
    next()
  })
}

module.exports = {
  generateAccessToken, 
  authenticateToken
};