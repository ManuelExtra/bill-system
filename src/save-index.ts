"use strict";

import express, { Express, Request, Response, NextFunction } from "express";

import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const mongoose = require("mongoose");

import dotenv from "dotenv";

const app: Express = express();
dotenv.config();

import routes from "./routes";

app.set("trust proxy", 1); // trust first proxy
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

// bodyParser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.options("*", cors());

app.use(helmet());
app.use(morgan("combined"));

function customHeaders(req: Request, res: Response, next: NextFunction) {
  app.disable("x-powered-by");
  res.setHeader("X-Powered-By", "Stash");
  next();
}
app.use(customHeaders);

mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useFindAndModify: false
  })
  .then(async () => {
    console.log('Successfully connected to the database');
  })
  .catch((err: Error) => {
    console.log(err);
    console.log('Could not connect to the database. Exiting now...');
  });

// routes linking
app.use("/", routes);

const PORT = process.env.PORT || 4005;

// crypto module
import helpers from './utils/helpers';
const { encryptText, decryptText } = helpers

const plainText = JSON.stringify({
  phone_number: "08063203337",
  amount: "120.33",
  account_type: "personal",
});

// const encryptedText = encryptText(plainText);
// console.log("encrypted text: ", encryptText(plainText));
// console.log("decrypted text: ", decryptText(encryptedText));

app.listen(PORT, () => {
  console.log(
    `[SAVE]: ${process.env.SERVICE_NAME} service listening on port ${PORT}`
  );
});
