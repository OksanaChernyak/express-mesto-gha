const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/users');
const cardRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const NotFoundError = require('./utils/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
// req.user = {
//  _id: '62e01e6bed4fdb5f90a67e9c',
//  };
// next();
// });
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', userRoute);
app.use('/', cardRoute);
app.use((req, res) => {
  throw new NotFoundError('Страница  по этому адресу не найдена');
});

app.listen(PORT);