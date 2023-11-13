const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connection = require('./config/database');
const PORT = process.env.PORT || 8000;

const userRouter = require('./routes/userRoute');
const venueRouter = require('./routes/venueRoute');

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/venues', venueRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});