const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('DB is connected'));
const app = express();

app.use(express.json());

app.use(router);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // console.log(`eeerrrorr${err.message}`);
  const { statusCode = 500, message } = err;
  if (statusCode === 500) {
    res.status(statusCode).send({ message: 'Internal Server Error' });
  } else {
    res.status(statusCode).send({ message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
