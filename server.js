const port = 4200;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const api = require('./server/routes/api');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', api);

mongoose.connect('mongodb://localhost/Expenses', { useNewUrlParser: true });

//****    To Put some dummy data    ****//
/*
const Expenses = require('./server/model/Expenses')
const dummyExpenses = require('./expenses.json')
for (const dummy of dummyExpenses) {
    let a = new Expenses(dummy)
    a.save()
}
*/
app.listen(port, function () {
  console.log(`Running on port ${port}`);
});
