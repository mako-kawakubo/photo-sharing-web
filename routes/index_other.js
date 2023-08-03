// routes/index_other.js

const express = require('express');
const fs = require('fs');

const router = express.Router();

const otherPage = fs.readFileSync('./other/other.html', 'UTF-8');

// /other.html へのルート
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(otherPage);
  res.end();
});

module.exports = router;
