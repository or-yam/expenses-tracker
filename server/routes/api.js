const express = require('express');
const moment = require('moment');
const Expense = require('../model/Expenses');
// const mongoose = require('mongoose');

const router = express.Router();

// mongoose.connect('mongodb://localhost/Expenses', { useNewUrlParser: true });

const dateValidator = (req, res, next) => {
  let date = req.body.date;
  date
    ? (req.body.date = moment(date).format('LLLL'))
    : (req.body.date = moment().format('LLLL'));
  next();
};

//get expenses by date or all sorted
router.get('/expenses/:d1?/:d2?', function (req, res) {
  //d1 is the early
  let d1 = req.params.d1;
  let d2 = req.params.d2;
  if (d1) {
    d1 = moment(d1).format('LLLL');
    d2 = moment(d2).format('LLLL');
    Expense.find({ date: { $gte: d1, $lte: d2 } }).exec(function (err, data) {
      res.send(data);
    });
  } else {
    Expense.find({})
      .sort({ date: -1 })
      .exec(function (err, data) {
        res.send(data);
      });
  }
});

//post new expense
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

//change group of expense
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

//get expenses by group and sum
router.get('/expenses/groups/:group/', function (req, res) {
  if (req.query.total) {
    Expense.aggregate(
      [
        { $match: { group: req.params.group } },
        {
          $group: {
            _id: '$group',
            total: { $sum: '$amount' },
          },
        },
      ],
      function (err, data) {
        res.send(data);
      }
    );
  } else {
    Expense.find({ group: req.params.group }).exec(function (err, data) {
      console.log(data);
      res.send(data);
    });
  }
});

//delete all from collection
router.delete('/all', function (req, res) {
  Expense.remove({}, function (err, data) {
    res.end();
  });
});

module.exports = router;
