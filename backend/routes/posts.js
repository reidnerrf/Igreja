const express = require('express');
const Post = require('../models/Post');
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
    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

