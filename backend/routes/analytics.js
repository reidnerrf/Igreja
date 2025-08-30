const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params; // church | user
    const { period = 'month' } = req.query;
    // Em produção, agregações reais no Mongo
    return res.json({
      success: true,
      period,
      type,
      eventsThisMonth: 12,
      liveViewers: 245,
      donationsTotal: 45320,
    });
  } catch (error) {
    console.error('Erro analytics:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

