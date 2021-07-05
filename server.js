const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const api = require('./server/routes/api');
const path = require('path');

const port = 4200;

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', api);

mongoose.connect('mongodb://localhost/Expenses', { useNewUrlParser: true });

//****    To Put some dummy data    ****//
// const Expenses = require('./server/model/Expenses')
// const dummyExpenses = require('./expenses.json')
// for (const dummy of dummyExpenses) {
//     let a = new Expenses(dummy)
//     a.save()
// }
//*/////////////////////////////////////*//

app.listen(port, function () {
  console.log(`Running on port ${port}`);
});
