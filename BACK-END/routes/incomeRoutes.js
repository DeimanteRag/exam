// const express = require("express");
// const incomeController = require("./../controllers/incomeController");
// const incomeRouter = express.Router();
// const auth = require("./../middleware/auth")
// const {userLoggerMiddleware} = require("./../middleware/logger");
// const expenseController = require('../controllers/expenseController');


// incomeRouter
//   .route("/")
//   // .get(auth, incomeController.getIncomes)
//     .get(auth, (req, res, next) => {
//     req.userRole = req.user.role; // Pass the user role to the handler
//     next();
//   }, incomeController.getIncomes)
//   .post(auth, userLoggerMiddleware, incomeController.postIncome);
  

// incomeRouter
//   .route("/:id")
//   .patch(auth, userLoggerMiddleware, incomeController.editIncome)
//   .delete(auth, userLoggerMiddleware, incomeController.deleteIncome)
//   .get(auth, incomeController.getIncomeById)

//   module.exports = incomeRouter;

const express = require("express");
const incomeController = require("./../controllers/incomeController");
const incomeRouter = express.Router();
const auth = require("./../middleware/auth");
const { userLoggerMiddleware } = require("./../middleware/logger");

incomeRouter
  .route("/")
  .get(auth, incomeController.getIncomes)
  .post(auth, userLoggerMiddleware, incomeController.postIncome);

incomeRouter
  .route("/:id")
  .patch(auth, userLoggerMiddleware, incomeController.editIncome)
  .delete(auth, userLoggerMiddleware, incomeController.deleteIncome)
  .get(auth, incomeController.getIncomeById);

module.exports = incomeRouter;

