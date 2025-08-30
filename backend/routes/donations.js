const express = require('express');
const { Donation, DonationCampaign } = require('../models/Donation');
const User = require('../models/User');
const { authenticateToken, requireChurch } = require('../middleware/auth');

const router = express.Router();

// Listar doações com filtro por período
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { period = 'all', campaign, church, donor, page = 1, limit = 20 } = req.query;
    const query = {};
    if (church) query.church = church;
    if (donor) query.donor = donor;

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

// Criar campanha
router.post('/campaigns', authenticateToken, requireChurch, async (req, res) => {
  try {
    const campaign = await DonationCampaign.create({ ...req.body, church: req.user.userId });
    res.status(201).json({ success: true, campaign });
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Listar campanhas
router.get('/campaigns', authenticateToken, async (req, res) => {
  try {
    const { church, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (church) query.church = church;
    if (status) query.status = status;
    const campaigns = await DonationCampaign.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    const total = await DonationCampaign.countDocuments(query);
    res.json({ success: true, campaigns, pagination: { page: parseInt(page), limit: parseInt(limit), total } });
  } catch (error) {
    console.error('Erro ao listar campanhas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter campanha por ID
router.get('/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const campaign = await DonationCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Erro ao obter campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar campanha
router.put('/campaigns/:id', authenticateToken, requireChurch, async (req, res) => {
  try {
    const campaign = await DonationCampaign.findOne({ _id: req.params.id, church: req.user.userId });
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
    Object.assign(campaign, req.body);
    await campaign.save();
    res.json({ success: true, campaign });
  } catch (error) {
    console.error('Erro ao atualizar campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir campanha
router.delete('/campaigns/:id', authenticateToken, requireChurch, async (req, res) => {
  try {
    const campaign = await DonationCampaign.findOne({ _id: req.params.id, church: req.user.userId });
    if (!campaign) return res.status(404).json({ error: 'Campanha não encontrada' });
    await DonationCampaign.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Campanha removida' });
  } catch (error) {
    console.error('Erro ao excluir campanha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar doação (processamento simplificado)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const donation = await Donation.create({ ...req.body, donor: req.user.userId });
    // Atualizar estatísticas da igreja
    await User.findByIdAndUpdate(donation.church, { $inc: { 'stats.totalDonations': 1 } });
    res.status(201).json({ success: true, donation });
  } catch (error) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Processar doação (simulado)
router.post('/:id/process', authenticateToken, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ error: 'Doação não encontrada' });
    donation.status = 'completed';
    donation.processedAt = new Date();
    donation.paymentData = { ...(donation.paymentData || {}), ...req.body };
    await donation.save();
    res.json({ success: true, donation });
  } catch (error) {
    console.error('Erro ao processar doação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

