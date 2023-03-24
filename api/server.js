const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3070;

app.use(bodyParser.json());
app.use(express.static(process.cwd() + '../my-app/dist'));

app.get('/', (req,res) => {
    res.sendFile(process.cwd() + '../my-app/dist/index.html');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});