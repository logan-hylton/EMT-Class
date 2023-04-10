const express = require('express');
const sessions = require('express-session');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
require('dotenv').config();
var db= require('./connection.js');
const cors = require('cors');
const util = require('util');
const app = express(),
      port = 3070;


const { auth } = require('express-openid-connect');

const config = {
  authRequired: process.env.AUTH_REQUIRED,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

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
app.use(fileUpload());
app.use('/assets', express.static(process.cwd() + '/dist/assets'))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

var VerifyUser = async (req) => {
  if (req.session.verifiedUser == undefined) {
    var rows = await db.query("Select email, admin from User where email='" + req.oidc.user.email + "'");
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
  var rows = await db.query("Select admin from User where email='" + req.oidc.user.email + "'");
  req.session.isAdmin = rows[0]['admin'] == 1;
  res.send({userIsAdmin: rows[0]['admin'] == 1});
});

app.post('/api/users', async(req, res) => {
  try {
    var rows = await db.query("Select * from User");
    res.send(rows.map((row) => {
      return {email: row.email, admin: row.admin == 1};
    }));
  }
  catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
})

app.post('/api/activities', async (req, res) => {
  try {
    var rows = await db.query("Select * from Activity");
    res.send(rows);
  }
  catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put('/api/users', async (req, res) => {
  try {
    var values = req.body.users.map(user => {
      return "('" + user.email + "', " + (user.admin == true ? 'True' : 'False') + ")"
    }).join(', ');
    console.log(values);
    var result = await db.query("Insert into User (email, admin) values " + values + " ON DUPLICATE KEY UPDATE admin=VALUES(admin)");
    console.log(result);
  } catch (err) {
    res.sendStatus(500);
  }
  res.sendStatus(200);
});

app.put('/api/activity', async (req, res) => {
  if (req.body.ActivityId != -1) {
    let sql = `Update Activity SET Name='${req.body.Name}', Type='${req.body.Type}', Description='${req.body.Description}', Instructions='${req.body.Instructions}' WHERE ActivityId='${req.body.ActivityId}';`; 
    var result = await db.query(sql);
    res.send({activityId: req.body.ActivityId});
  }
  else {
    let sql = "" +
    `INSERT INTO Activity (Name, Type, Description, Instructions) VALUES ('${req.body.Name}', '${req.body.Type}', '${req.body.Description}', '${req.body.Instructions}');`;
    var result = await db.query(sql);
    res.send({activityId: result.insertId});
  }
})


app.post('/api/activity', async (req, res) => {
  try {
    let conn = await db.getConnection();
    let sqlQuery = util.promisify(conn.query).bind(conn);
    let data = (await sqlQuery(`SELECT * FROM Activity a WHERE a.ActivityId=${req.body.activityId}`))[0];
    if (data.Type === 'Label') {
      data.files = await sqlQuery(`SELECT * FROM LabelFiles lf where lf.ActivityId=${req.body.activityId}`);
    }
    conn.release();
    res.send(data);
  }
  catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/api/activity/label-files', async (req, res) => {

  let ActivityId = req.body.activityId;
  let sql = `SELECT * FROM LabelFiles lf where lf.ActivityId=${req.body.activityId};`
  try {
    let data = await db.query(sql);
  }
  catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/api/activity/label-file', async (req, res) => {
  try {
    let fileName = '/uploads/' + crypto.randomBytes(20).toString('hex') + '.jpeg';
    let activityId = req.body.activityId;
    const { file } = req.files;
    if (!file) {
      res.sendStatus(500);
      return;
    }
    file.mv(__dirname + fileName);
    await query(`INSERT INTO LabelFiles (ActivityId, FilePath) VALUES (${activityId}, '${fileName}')`)
    res.sendStatus(200);
  }
  catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put('/api/activity/label-file/image-width', async (req, res) => {
  try {
    await db.query(`UPDATE LabelFiles SET ImageWidth=${req.body.ImageWidth} WHERE LabelFileId=${req.body.LabelFileId};`);
    res.sendStatus(200);
  }
  catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.put('/api/activity/labels', async (req, res) => {
  try {
    let r = req.body;
    let query = 'INSERT INTO Label (ActivityId, Name, Shape, Width, Height, Color, TextColor, Text, X, Y) VALUES ';
    query = query + r.Labels.map(l => {
      return `(${r.ActivityId}, '${l.Name}', '${l.Shape}', ${l.Width}, ${l.Height}, '${l.Color}', '${l.TextColor}', '${l.Text}', ${l.X}, ${l.Y})`;
    }).join(', ') + ';';
    
    var queryReponse = await db.query(query);
    res.sendStatus(200);
  }
  catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/api/activity/labels', async (req, res) => {
  try {
    let ActivityId = req.body.ActivityId;
    var data = await db.query(`SELECT * FROM Label WHERE ActivityId=${ActivityId}`);
    res.send(data);
  }
  catch (err) {
    console.log(err);
    res.send(500);
  }
})


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});