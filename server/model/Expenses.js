const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Expenses', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const expensesSchema = 
    new Schema({
  item: String,
  amount: Number,
  date: String,
  group: String,
});

const expenses = mongoose.model('expense', expensesSchema);

module.exports = expenses;
