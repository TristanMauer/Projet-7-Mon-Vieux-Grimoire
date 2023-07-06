// importation des différents modules
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// routes authentification et inscription
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// exportation du routeur
module.exports = router;