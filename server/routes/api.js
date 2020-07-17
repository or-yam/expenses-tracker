const express = require('express');
const router = express.Router();
const moment = require('moment');

const Expense = require('../model/Expenses');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Expenses', { useNewUrlParser: true });

const dateValidator = (req, res, next) => {
  req.body.date
    ? (req.body.date = moment(req.body.date).format('LLLL'))
    : (req.body.date = moment(new Date()).format('LLLL'));
  next();
};

router.get('/expenses', function (req, res) {
  Expense.find({})
    .sort({ date: -1 })
    .exec(function (err, data) {
      res.send(data);
    });
});

router.post('/new', dateValidator, function (req, res) {
  const exp = new Expense({
    item: req.body.item, /// check for destructuring
    amount: req.body.amount,
    group: req.body.group,
    date: req.body.date,
  });
  exp.save();
  const id = exp._id;
  Expense.findById(id, function (err, data) {
    res.send(data); /// not working async problem
  });
});

router.put('/update/:g1/:g2', function (req, res) {
  const group1 = req.params.g1;
  const group2 = req.params.g2;
  Expense.findOneAndUpdate({ group: group1 }, { group: group2 }).exec(function (
    err,
    data
  ) {
    res.send(`Item ${data.item} changed Group, from ${group1} to ${group2}`);
  });
});

router.get('/expenses/:group/', function (req, res) {
  if (req.query.total) {
    Expense.aggregate(
      { $match: { group: req.body.group } },
      { $sum: '$amount' }.exec(function (err, data) {
        res.send(data);///Not Working
      })
    );
  } else {
    Expense.find({ group: req.params.group }).exec(function (err, data) {
      res.send(data);
    });
  }
});

module.exports = router;
