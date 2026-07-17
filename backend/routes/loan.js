const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan");
const auth = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken"); // ✅ ADD THIS

router.post("/apply", async (req, res) => {

  try {

    const {
      fname,
      lname,
      phone,
      email,
      address,
      pan,
      profession,
      type,
      amount,
      duration,
      durationType,
      salary,
      emi,
      cibil
    } = req.body;

    // Eligibility Logic
    let eligibility = "Not Eligible";

    if (
      salary >= 25000 &&
      cibil >= 650 &&
      emi < salary * 0.5
    ) {
      eligibility = "Eligible";
    }

    const newLoan = new Loan({

      fname,
      lname,
      phone,
      email,
      address,
      pan,
      profession,
      type,
      amount,
      duration,
      durationType,
      salary,
      emi,
      cibil,

      eligibility,

      status: "pending"
    });

    await newLoan.save();

    res.json({
      msg: "Submitted Successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Error"
    });
  }
});


// ✅ Get user loans
router.get("/my-loans", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const loans = await Loan.find({ user: decoded.id });

    res.json(loans);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching loans" });
  }
});


router.post("/myloans", async (req,res)=>{
  const { email } = req.body;

  const loans = await Loan.find({ email });

  res.json(loans);
});

// ✅ Recommendation API
router.post("/recommend", (req, res) => {

  const { salary, cibil, amount } = req.body;

  let banks = [

{
  name: "HDFC Bank",
  interest: 10.5,
  approval: Math.min(95, (cibil / 10) + (salary / 1000)),
  link: "https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan"
},

{
  name: "SBI",
  interest: 9.2,
  approval: Math.min(90, (cibil / 10) + 15),
  link: "https://sbi.co.in/web/personal-banking/loans/personal-loans"
},

{
  name: "ICICI Bank",
  interest: 11,
  approval: Math.min(88, (cibil / 10) + 10),
  link: "https://www.icicibank.com/personal-banking/loans/personal-loan"
}

];

  let bestOverall = banks.reduce((a, b) =>
    (a.interest + (100 - a.approval)) <
    (b.interest + (100 - b.approval)) ? a : b
  );

  res.json({
    bestOverall,
    allBanks: banks
  });
});

module.exports = router;

