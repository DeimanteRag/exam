const Budget = require("../models/budgetModel");
const mongoose = require('mongoose');

exports.getBudgets = (req, res) => {
  const userEmail = req.email;

    try {
        Budget.find({ email: userEmail })
        .then((doc) => {
            res.status(200).json(doc);
        })
        .catch((err) => res.status(404).json({ error: "Bad request query" }));
    } catch {
        res.status(500).json({ error: "Get request failed, please try again" });
    }
};

exports.getBudgetById = (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid budget ID' });
  }
  Budget.findById(id)
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({ message: 'Budget not found' });
      }
      res.status(200).json(doc);
    })
    .catch((error) => res.status(500).json(error));
};


exports.deleteBudget = (req, res) => {
    let { id } = req.params;
    Budget.findByIdAndDelete(id)
    .then((doc) => {
        req.logger.info('Vartotojas panaikino biudžetą')
        res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.editBudget = (req, res) => {
    let { id } = req.params;
    Budget.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    })
    .then((doc) => {
        req.logger.info("Vartotojas redagavo biudžetą")
        res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.createBudget = (req, res) => {
    let { category, limit, id } = req.body;
    let email = req.email;
    let now = Date.now();
    let expirationDate = new Date(now + 30 * 24 * 60 * 60 * 1000);
    let budget = new Budget({
      id: id,
      limit: limit,
      category: category,
      email: email,
      expirationDate: expirationDate
    });
    budget.save().then((doc) => {
      req.logger.info("Vartotojas sukūrė biudžetą")
      res.status(200).json(doc);
    });
  };
  

  