const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
const PUBLIC_FOLDER = path.join(__dirname, 'public');
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
// для приема веб-страниц внутри POST-запроса
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62e01e6bed4fdb5f90a67e9c',
  };
  next();
});
app.use(express.static(PUBLIC_FOLDER));

app.use('/', userRoute);
app.use('/', cardRoute);

app.listen(PORT);