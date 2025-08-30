const express = require('express');
const Donation = require('../models/Donation');
const { authenticateToken, requireChurch } = require('../middleware/auth');

const router = express.Router();

// Listar doações com filtro por período
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { period = 'all', campaign, page = 1, limit = 20 } = req.query;
    const query = {};

    if (campaign) query.campaign = campaign;

    if (period !== 'all') {
      const now = new Date();
      let from = new Date(0);
      if (period === 'today') {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (period === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        from = new Date(now.getFullYear(), now.getMonth(), diff);
      } else if (period === 'month') {
        from = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      query.createdAt = { $gte: from };
    }

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Donation.countDocuments(query);
    res.json({ success: true, donations, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    console.error('Erro ao listar doações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar campanha (simplificado)
router.post('/campaigns', authenticateToken, requireChurch, async (req, res) => {
  try {
    // Aqui você salvaria um documento Campaign (modelo não incluído neste snippet)
    // Simular resposta de criação
    res.status(201).json({ success: true, campaign: { id: 'mock', ...req.body } });
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

