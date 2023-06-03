import airtimeInitiator from './airtime/queue';
const mongoose = require('mongoose');

import config from './config/mongo';
const { DB_URL, DB_USER, DB_PASS } = config

mongoose
  .connect(DB_URL, {
    user: DB_USER,
    pass: DB_PASS,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    // useFindAndModify: false
  })
  .then(async () => {
    console.log('[QUEUE][AIRTIME]: Successfully connected to the database');
  })
  .catch((err:any) => {
    console.log(err);
    console.log(
      '[QUEUE][AIRTIME]: Could not connect to the database. Exiting now...'
    );
  });

airtimeInitiator.startWorkers();
