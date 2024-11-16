const express = require('express');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;

require('./src/routing'); //Routing

app.listen(port, () => {
    console.log('Server started listening at port : ' + port);
});