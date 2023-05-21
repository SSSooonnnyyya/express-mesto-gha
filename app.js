const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => console.log('DB is connected'));
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6469012cb4cae5586803ad74',
  };
  next();
});

app.use(router);

app.use((req, res) => {
  res.json({ message: 'Not found' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
