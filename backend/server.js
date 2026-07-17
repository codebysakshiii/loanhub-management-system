const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/db");
const path = require("path");

const Loan = require("./models/Loan"); // ✅ ADD THIS

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));


app.use("/api/auth", require("./routes/auth"));
app.use("/api/loan", require("./routes/loan"));
app.use("/admin", require("./routes/admin"));

// ✅ MY LOANS API
app.post("/api/loan/myloans", async (req, res) => {
  try {
    const { email } = req.body;

    const loans = await Loan.find({ email });

    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/loan/recommend",(req,res)=>{

res.json({
allBanks:[

{
name:"HDFC Bank",
interest:10.5,
approval:92,
link:"https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan"
},

{
name:"SBI",
interest:9.2,
approval:90,
link:"https://sbi.co.in/web/personal-banking/loans/personal-loans"
},

{
name:"ICICI Bank",
interest:11,
approval:88,
link:"https://www.icicibank.com/personal-banking/loans/personal-loan"
}

]
});

});




app.listen(5000, () => {
  console.log("Server running 🚀");
  console.log("👉 http://localhost:5000");
});
