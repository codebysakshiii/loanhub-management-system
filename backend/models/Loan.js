const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,
  type: String,
  address: String,
  duration: String,
durationType: String,
  pan: String,
  status: {
    type: String,
    default: "pending"
  },
  eligibility: {
  type: String,
  default: "Checking"
}
}, { timestamps: true });

module.exports = mongoose.model("Loan", loanSchema);