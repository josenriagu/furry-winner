const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Stack Overflow Clone - Where Developers Learn, Share, & Build Careers', heading: 'Stack Overflow Clone', seat: 'seat', coffee: 'coffee' });
});

module.exports = router;
