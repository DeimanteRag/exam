const mongoose = require("mongoose");

const budgetSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;