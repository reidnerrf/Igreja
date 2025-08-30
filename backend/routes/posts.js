const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { scope, category } = req.query;
    const query = {};
    if (category) query.category = category;
    // scope church/user poderia filtrar por author userType quando disponível
    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(100);
    res.json(posts);
  } catch (error) {
    console.error('Erro ao listar posts:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user.userId });
    // Push para seguidores em anúncios da igreja
    if (req.body.type === 'announcement') {
      try {
        const churchUser = await User.findById(req.user.userId).select('followers userType');
        if (churchUser && churchUser.userType === 'church') {
          const followers = await User.find({ _id: { $in: churchUser.followers }, expoPushToken: { $ne: null } }).select('expoPushToken');
          const tokens = followers.map(f => f.expoPushToken);
          if (tokens.length > 0) {
            const { Expo } = require('expo-server-sdk');
            const expo = new Expo();
            const messages = tokens.filter(t => Expo.isExpoPushToken(t)).map(t => ({
              to: t,
              sound: 'default',
              title: 'Novo aviso da paróquia',
              body: req.body.title || 'Veja as novidades',
              data: { type: 'announcement' }
            }));
            const chunks = expo.chunkPushNotifications(messages);
            for (const chunk of chunks) { await expo.sendPushNotificationsAsync(chunk); }
          }
        }
      } catch (e) { console.warn('Push seguidores (announcement) falhou:', e.message); }
    }
    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

