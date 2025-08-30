const express = require('express');
const { authenticateToken, requireChurch } = require('../middleware/auth');

const router = express.Router();

// Lista mockada com filtros básicos por período e plataforma
router.get('/', async (req, res) => {
  try {
    const { period = 'all', platform } = req.query;
    // Em produção, consultar coleção Transmissions
    const all = [];
    let filtered = all;
    if (platform) filtered = filtered.filter(t => t.platform === platform);
    if (period !== 'all') {
      const now = new Date();
      let from = new Date(0);
      if (period === 'today') from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      else if (period === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        from = new Date(now.getFullYear(), now.getMonth(), diff);
      } else if (period === 'month') from = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(t => new Date(t.createdAt) >= from);
    }
    res.json({ success: true, transmissions: filtered });
  } catch (error) {
    console.error('Erro ao listar transmissões:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authenticateToken, requireChurch, async (req, res) => {
  try {
    // Em produção, salvar no banco.
    res.status(201).json({ success: true, transmission: { id: 'mock', ...req.body } });
  } catch (error) {
    console.error('Erro ao criar transmissão:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

