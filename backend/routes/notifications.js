const express = require('express');
const { Expo } = require('expo-server-sdk');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const expo = new Expo();

router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { tokens = [], title, body, data } = req.body;
    const messages = [];
    for (const pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) continue;
      messages.push({ to: pushToken, sound: 'default', title, body, data });
    }
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }
    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Erro envio push:', error);
    res.status(500).json({ error: 'Falha ao enviar push' });
  }
});

module.exports = router;

