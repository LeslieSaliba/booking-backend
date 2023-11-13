const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connection = require('./config/database');
const PORT = process.env.PORT || 8000;

const userRouter = require('./routes/userRoute');

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});