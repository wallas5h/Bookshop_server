import { urlencoded } from 'body-parser';
import cors from 'cors';
import express from "express";
require('dotenv').config();
// import './utils/db';
import "express-async-errors";
import rateLimit from "express-rate-limit";
import { config } from './config/config';
import { connectDB } from './config/db';
import { goalRouter } from './routes/goalsRouter';
import { handleError } from './utils/errors';

const { PORT = 3001 } = process.env;


const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
  optionSuccessStatus: 200,
}

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
})

connectDB();

const app = express();

app.use(cors(corsOptions));

app.use(limiter);

app.use(express.json());

app.use(urlencoded({
  extended: true
}))

//routing

app.use('/api/goals', goalRouter);

//error middleware

app.use(handleError);
// app.use(errorHandler);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin,);
  next();
});

app.listen(3001, '0.0.0.0', () => {
  console.log('server started at http://localhost:' + PORT);
});