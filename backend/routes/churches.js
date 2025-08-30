const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const churches = await User.find({ userType: 'church' }).limit(100);
    res.json(churches);
  } catch (error) {
    console.error('Erro ao listar igrejas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

