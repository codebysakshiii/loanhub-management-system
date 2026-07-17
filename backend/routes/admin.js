const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// 🔐 Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

// =========================
// ✅ ADMIN LOGIN
// =========================
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: 'admin-token' });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});


// =========================
// ✅ GET ALL LOANS
// =========================
router.get('/loans', async (req, res) => {
  try {
    const loans = await Loan.find().sort({ _id: -1 }); // latest first
    res.json(loans);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// =========================
// ✅ UPDATE STATUS (Approve / Reject)
// =========================
router.put('/loans/:id', async (req, res) => {
  try {
    const { status } = req.body;

    // validation
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status required' });
    }

    if (!['Approved', 'Rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    res.json({ success: true, msg: 'Status updated', loan });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;