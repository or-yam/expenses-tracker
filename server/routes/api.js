const express = require('express');
const moment = require('moment');
const Expense = require('../model/Expenses');

const router = express.Router();

const dateValidator = (req, res, next) => {
  let { date } = req.body;
  let { d1, d2 } = req.params;
  date
    ? (req.body.date = moment(date).format('LLLL'))
    : (req.body.date = moment().format('LLLL'));
  if (d1) {
    req.params.d1 = moment(d1).format('LLLL');
    req.params.d2 = moment(d2).format('LLLL');
  }
  next();
};

//get expenses by date or all sorted
router.get('/expenses/:d1?/:d2?', dateValidator, function (req, res) {
  const { d1, d2 } = req.params;
  if (d1) {
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
  const { item, amount, group, date } = req.body;
  const exp = new Expense({
    item,
    amount,
    group,
    date,
  });
  exp.save().then((e) => res.send(e));
});

//change group of expense
router.put('/update/:g1/:g2', function (req, res) {
  const { g1, g2 } = req.params;
  Expense.findOneAndUpdate({ group: g1 }, { group: g2 }).exec(function (
    err,
    data
  ) {
    res.send(`Item ${data.item} changed Group, from ${g1} to ${g2}`);
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
