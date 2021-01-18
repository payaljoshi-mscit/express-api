var express = require('express');  
var bodyParser = require('body-parser');
var request = require("request");
const cookieparser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const cors=require("cors");
var app = express(); 

var BookRoute=require("./routes/BookRoute");
const {auth0_key,sign,verify,refresh}=require("./libs/jwt");

app.use(cors());
app.use(cookieparser())

app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var checkJwt = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://dev-ceh5tizc.auth0.com/.well-known/jwks.json'
}),
audience: 'http://books',
issuer: 'https://dev-ceh5tizc.auth0.com/',
algorithms: ['RS256']
});

//app.get("/getjwtkey",sign);
//app.use("/books",verify,BookRoute)
app.use("/books",BookRoute);
//app.get("/getauth0key",auth0_key);
//app.use("/books",checkJwt,BookRoute);

app.listen(8000);