import { urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from "express";
import "express-async-errors";
import rateLimit from "express-rate-limit";
import { config } from './config/config';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorMiddleware';
import { bookRouter } from './routes/bookRouter';
import { cartRouter } from './routes/cartRouter';
import { newsletterRouter } from './routes/newsleterRouter';
import { passwordRouter } from './routes/passwordRouter';
import { userRouter } from './routes/userRouter';
import { wishlistRouter } from './routes/wishlistRouter';
require('dotenv').config();

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

app.use(cookieParser());

// app.use(limiter);

app.use(express.json());


app.use(urlencoded({
  extended: true
}))

//routing

app.use('/api/users', userRouter);
app.use('/api/book', bookRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/password', passwordRouter);

//error middleware

// app.use(handleError);
app.use(errorHandler);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin,);
  next();
});

app.listen(3001, '0.0.0.0', () => {
  console.log('server started at http://localhost:' + PORT);
});