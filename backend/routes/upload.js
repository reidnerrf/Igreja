const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    // Em produção, enviar a um storage (S3/Cloudinary) e retornar URL
    // Aqui retornamos um mock URL data URI
    res.json({ url: `data:image/jpeg;base64,${req.file.buffer.toString('base64').slice(0,64)}` });
  } catch (error) {
    console.error('Erro upload:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

