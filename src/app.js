//connect to mongoDb
require('./helpers/connectToDb');

const express = require('express');
const app = express();

const chalk = require('chalk');
const morgan = require('morgan');
const cors = require('cors');

//all user routes
const userRouter = require('./users/routes/routes');
const cardRouter = require('./cards/routes/routes');
const infoRouter = require('./info/routes');

app.use(morgan(chalk.cyan(':method :url :status :response-time ms')));
app.use(cors());
app.use(express.json());
app.use('/restapi/users', userRouter);
app.use('/restapi/cards', cardRouter);
app.use('/restapi/info', infoRouter);

const PORT = 8181;
app.listen(PORT, () => {
  console.log(
    chalk.blueBright.bold(`server run on: http://:localhost:${PORT}`)
  );
});
