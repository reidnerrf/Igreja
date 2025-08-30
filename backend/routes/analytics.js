const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params; // church | user
    const { period = 'month' } = req.query;
    // Em produção, agregações reais no Mongo
    const base = {
      week: { eventsThisMonth: 5, liveViewers: 120, donationsTotal: 8200, newFollowers: 18, engagement: 540, raffleRevenue: 2100 },
      month: { eventsThisMonth: 12, liveViewers: 245, donationsTotal: 45320, newFollowers: 72, engagement: 2380, raffleRevenue: 8200 },
      '90d': { eventsThisMonth: 34, liveViewers: 730, donationsTotal: 121300, newFollowers: 210, engagement: 7210, raffleRevenue: 25100 },
    };
    const metrics = base[period] || base.month;
    return res.json({
      success: true,
      period,
      type,
      ...metrics,
    });
  } catch (error) {
    console.error('Erro analytics:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

