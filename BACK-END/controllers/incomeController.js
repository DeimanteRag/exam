// const mongoose = require("mongoose");
// const Income = require("./../models/incomeModel");

// exports.getIncomes = (req, res) => {
//   const year = req.query.year;
//   let query = {userID: req.userID};
//   if (year) {
//     const yearRegex = new RegExp(`^${year}`);
//     query.date = { $regex: yearRegex };
//   }
//   if (req.user.role == "admin") {
//     query = {}; // Empty query to fetch all incomes for admin
//   } else {
//     query.userID = req.userID; // Fetch incomes only for the current user
//   }
//   Income.find(query)
//     .then((doc) => {
//       res.status(200).json(doc);
//     })
//     .catch((error) => res.status(404).json(error));
// };

// exports.getIncomeById = (req, res) => {
//   let { id } = req.params;
//   Income.findById(id)
//     .then((doc) => {
//       res.status(200).json(doc);
//     })
//     .catch((error) => res.status(404).json(error));
// };

// exports.postIncome = (req, res) => {
//   let { name, date, amount, category } = req.body;
//   let income = new Income({
//     name: name,
//     date: date,
//     amount: amount,
//     category: category,
//     userID : req.userID
//   });
//   income.save().then((doc) => {
//     req.logger.info(`Vartotojas pridėjo pajamą`);
//     res.status(200).json(doc);
//   });
// };

// exports.editIncome = (req, res) => {
//   let { id } = req.params;
//   Income.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   })
//     .then((doc) => {
//       req.logger.info(`Vartotojas pridėjo pajamą`);
//       res.status(200).json(doc);
//     })
//     .catch((error) => res.status(404).json(error));
// };

// exports.deleteIncome = (req, res) => {
//   let { id } = req.params;
//   Income.findByIdAndDelete(id)
//     .then((doc) => {
//       req.logger.info(`Vartotojas pridėjo pajamą`);
//       res.status(200).json(doc);
//     })
//     .catch((error) => res.status(404).json(error));
// };

const mongoose = require("mongoose");
const Income = require("./../models/incomeModel");

exports.getIncomes = (req, res) => {
  const year = req.query.year;
  // let query = { userID: req.userID };
  let query = { userID: req.user.id };

  if (year) {
    const yearRegex = new RegExp(`^${year}`);
    query.date = { $regex: yearRegex };
  }

  if (req.user.role === "admin") {
    query = {}; // Empty query to fetch all incomes for admin
  }

  if (req.user.role === "user") {
    // query.userID = req.userID; Fetch incomes only for the current user
    query.userID = req.user.id;
  }
  Income.find(query)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.getIncomeById = (req, res) => {
  let { id } = req.params;
  Income.findById(id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.postIncome = (req, res) => {
  let { name, date, amount, category } = req.body;
  let income = new Income({
    name: name,
    date: date,
    amount: amount,
    category: category,
    // userID: req.userID,
    userID: req.user.id,
  });
  income.save().then((doc) => {
    req.logger.info(`Vartotojas pridėjo pajamą`);
    res.status(200).json(doc);
  });
};

exports.editIncome = (req, res) => {
  let { id } = req.params;
  Income.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .then((doc) => {
      req.logger.info(`Vartotojas redagavo pajamą`);
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};

exports.deleteIncome = (req, res) => {
  let { id } = req.params;
  Income.findByIdAndDelete(id)
    .then((doc) => {
      req.logger.info(`Vartotojas ištrynė pajamą`);
      res.status(200).json(doc);
    })
    .catch((error) => res.status(404).json(error));
};
