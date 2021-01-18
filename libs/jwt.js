const jwt = require('jsonwebtoken')
const request = require('request')


const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 3000

const auth0_key= (req,res)=>{

  var options = { method: 'POST',
  url: 'https://dev-ceh5tizc.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"HHhp1s1Ak8Rk7qo6clXXjWJkjU1tP3VM","client_secret":"t4imVJmVGs9m4-jatWqqOtq8lxX6YICLEN5RJRwI-gnD9NGWUJN7DWQbPxNJddYA","audience":"http://books","grant_type":"client_credentials"}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
  res.send(body)
});
}

const sign = (req, res) => {
  
  // Create a new token with the username in the payload
  // and which expires 300 seconds after issue
  const token = jwt.sign({ username: "user1" }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  })
  console.log('token:', token)
  // set the cookie as the token string, with a similar max age as the token
  // here, the max age is in milliseconds, so we multiply by 1000
  
  res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
  res.send(token);
}

const verify = (req, res, next) => {
  // We can obtain the session token from the requests cookies, which come with every request
  const token = req.cookies.token

  //const token=req.headers.authorization.split(" ")[1];
  //authorization: Bearer ergkergh34953859.dsgf345t3fd.dg4tgfdg
  //console.log("AUTH==="+auth);

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.status(401).end("not authorised")
  }

  var payload
  try {
    // Parse the JWT string and store the result in `payload`.
    // Note that we are passing the key in this method as well. This method will throw an error
    // if the token is invalid (if it has expired according to the expiry time we set on sign in),
    // or if the signature does not match
    payload = jwt.verify(token, jwtKey)
    console.log("Payload ");
    console.log(payload );
    console.log("PL");

    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      return res.status(401).end()
    }
    // otherwise, return a bad request error
    return res.status(400).end()
  }
  //res.status(200); // return true
  //res.send(`Welcome ${payload.username}!`)
}

const refresh = (req, res) => {
  // (BEGIN) The code uptil this point is the same as the first part of the `welcome` route
  const token = req.cookies.token

  if (!token) {
    return res.status(401).end()
  }

  var payload
  try {
    payload = jwt.verify(token, jwtKey)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).end()
    }
    return res.status(400).end()
  }
  // (END) The code uptil this point is the same as the first part of the `welcome` route

  // We ensure that a new token is not issued until enough time has elapsed
  // In this case, a new token will only be issued if the old token is within
  // 30 seconds of expiry. Otherwise, return a bad request status
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
  /*if (payload.exp - nowUnixSeconds > 30) {
    return res.status(400).end()
  }*/

  // Now, create a new token for the current user, with a renewed expiration time
  const newToken = jwt.sign({ username: payload.username }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  })

  // Set the new token as the users `token` cookie
  res.cookie('token', newToken, { maxAge: jwtExpirySeconds * 1000 })
  console.log(newToken);
  //res.send(newToken);
  
}

module.exports = {
  auth0_key,
  sign,
  verify,
  refresh
}