const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);
app.use(auth);
app.use('/', userRoute);
app.use('/', cardRoute);
app.use(() => {
  throw new NotFoundError('Страница  по этому адресу не найдена');
});
app.use(errors());
app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT);