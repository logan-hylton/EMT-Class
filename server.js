const express = require('express');
const sessions = require('express-session')
const cookieParser = require('cookie-parser');
var mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
const util = require('util');
const app = express(),
      port = 3070;


const { auth } = require('express-openid-connect');

const config = {
  authRequired: true,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

var con = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
});

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(auth(config));

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use('/assets', express.static(process.cwd() + '/dist/assets'))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const query = util.promisify(con.query).bind(con);

var VerifyUser = async (req) => {
  if (req.session.verifiedUser == undefined) {
    var rows = await query("Select email, admin from User where email='" + req.oidc.user.email + "'");
    if (rows.length != 1) {
      req.session.verifiedUser = false;
    } 
    else {
      req.session.verifiedUser = true;
    }
  }
  return req.session.verifiedUser;
}

app.get('/', async (req,res) => {
  var userVerified = await VerifyUser(req);
  if (!userVerified) {
    res.sendFile(process.cwd() + '/403.html');
  } 
  else {
    res.sendFile(process.cwd() + '/dist/index.html');
  }
});

app.get('/emt-logout', (req, res) => {
  req.session.destroy();
  res.redirect('/logout');
});

app.get('/admin', async (req, res) => {
  res.sendFile(process.cwd() + (req.session.isAdmin == true ? '/dist/index.html' : '/403.html'));
});

app.get('/admin/users', async (req, res) => {
  res.sendFile(process.cwd() + (req.session.isAdmin == true ? '/dist/index.html' : '/403.html'));
});

app.get('/admin/activities', async (req, res) => {
  res.sendFile(process.cwd() + (req.session.isAdmin == true ? '/dist/index.html' : '/403.html'));
});

app.post('/api/user-is-admin', async (req, res) => {
  var rows = await query("Select admin from User where email='" + req.oidc.user.email + "'");
  req.session.isAdmin = rows[0]['admin'] == 1;
  res.send({userIsAdmin: rows[0]['admin'] == 1});
});

app.post('/api/users', async(req, res) => {
  var rows = await query("Select * from User");
  res.send(rows.map((row) => {
    return {email: row.email, admin: row.admin == 1};
  }));
})

app.put('/api/users', async (req, res) => {
  try {
    var values = req.body.users.map(user => {
      return "('" + user.email + "', " + (user.admin == true ? 'True' : 'False') + ")"
    }).join(', ');
    console.log(values);
    var result = await query("Insert into User (email, admin) values " + values + " ON DUPLICATE KEY UPDATE admin=VALUES(admin)");
    console.log(result);
  } catch (err) {
    res.status(501).send("internal server error");
  }
  res.status(200).send();
});







app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});