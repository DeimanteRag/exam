const Expense = require("./../models/expenseModel");
const mongoose = require("mongoose");

exports.getExpenses = (req, res) => {
  const year = req.query.year;
  let query = {};
  if (year) {
    const yearRegex = new RegExp(`^${year}`);
    query.date = { $regex: yearRegex };
  }
  Expense.find(query)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.getExpenseById = (req, res) => {
  let { id } = req.params;
  Expense.findById(id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense details' });
  }}

exports.postExpense = (req, res) => {
  let { name, date, amount, category } = req.body;
  let expense = new Expense({
    name: name,
    date: date,
    amount: amount,
    category: category,
  });

  expense.save().then((doc) => {
    req.logger.info(`Vartotojas pridėjo išlaidą`);
    res.status(200).json(doc);
  });
};

exports.editExpense = (req, res) => {
  let { id } = req.params;
  Expense.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((doc) => {
      req.logger.info("Vartotojas redagavo išlaidą");
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.deleteExpense = (req, res) => {
  let { id } = req.params;
  Expense.findByIdAndDelete(id)
    .then((doc) => {
      req.logger.info("Vartotojas panaikino išlaidą");
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};
