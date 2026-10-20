const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/students', async (req, res) => {
  try {
    const [students] = await pool.query(
      'SELECT * FROM Students LIMIT 100'
    );
    res.json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error.message);
    res.status(500).json({
      error: 'Unable to retrieve students'
    });
  }
});

module.exports = router;