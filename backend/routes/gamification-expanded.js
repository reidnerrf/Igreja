/**
 * Rotas de Gamificação Expandida
 * ConnectFé - Sistema de Gamificação com Animações
 */

const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const Streak = require('../models/Streak');
const Badge = require('../models/Badge');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const gamificationService = require('../services/gamificationService');

/**
 * @route   GET /api/gamification/quests
 * @desc    Obtém todas as quests do usuário
 * @access  Private
 */
router.get('/quests', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { type, status, category } = req.query;
        
        const filter = { userId };
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (category) filter.category = category;
        
        const quests = await Quest.find(filter).sort({ startDate: -1 });
        
        res.json({
            success: true,
            data: quests
        });
        
    } catch (error) {
        console.error('Erro ao obter quests:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/gamification/quests/active
 * @desc    Obtém quests ativas do usuário
 * @access  Private
 */
router.get('/quests/active', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const activeQuests = await Quest.find({
            userId,
            status: 'active',
            endDate: { $gt: new Date() }
        }).sort({ endDate: 1 });
        
        res.json({
            success: true,
            data: activeQuests
        });
        
    } catch (error) {
        console.error('Erro ao obter quests ativas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/gamification/quests/seasonal
 * @desc    Obtém quests sazonais
 * @access  Private
 */
router.get('/quests/seasonal', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { theme } = req.query;
        
        const seasonalQuests = await Quest.findSeasonal(theme || 'current');
        
        res.json({
            success: true,
            data: seasonalQuests
        });
        
    } catch (error) {
        console.error('Erro ao obter quests sazonais:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/gamification/quests/:questId/progress
 * @desc    Atualiza progresso de uma quest
 * @access  Private
 */
router.post('/quests/:questId/progress', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { questId } = req.params;
        const { objectiveIndex, progress } = req.body;
        
        const result = await gamificationService.updateQuestProgress(
            questId, 
            userId, 
            objectiveIndex, 
            progress
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Progresso atualizado com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar progresso:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/gamification/quests/:questId/complete
 * @desc    Completa uma quest
 * @access  Private
 */
router.post('/quests/:questId/complete', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { questId } = req.params;
        
        const result = await gamificationService.completeQuest(questId, userId);
        
        res.json({
            success: true,
            data: result,
            message: 'Quest completada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao completar quest:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/gamification/streak
 * @desc    Obtém streak atual do usuário
 * @access  Private
 */
router.get('/streak', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        let streak = await Streak.findOne({ userId });
        
        if (!streak) {
            // Cria streak inicial
            streak = await gamificationService.createStreak(userId);
        }
        
        res.json({
            success: true,
            data: streak
        });
        
    } catch (error) {
        console.error('Erro ao obter streak:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/gamification/streak/checkin
 * @desc    Faz check-in no streak
 * @access  Private
 */
router.post('/streak/checkin', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { activity, notes } = req.body;
        
        const result = await gamificationService.checkInStreak(userId, activity, notes);
        
        res.json({
            success: true,
            data: result,
            message: 'Check-in realizado com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao fazer check-in:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/gamification/streak/history
 * @desc    Obtém histórico de check-ins
 * @access  Private
 */
router.get('/streak/history', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { days = 30 } = req.query;
        
        const history = await gamificationService.getStreakHistory(userId, parseInt(days));
        
        res.json({
            success: true,
            data: history
        });
        
    } catch (error) {
        console.error('Erro ao obter histórico:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/gamification/badges
 * @desc    Obtém badges do usuário
 * @access  Private
 */
router.get('/badges', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const badges = await gamificationService.getUserBadges(userId);
        
        res.json({
            success: true,
            data: badges
        });
        
    } catch (error) {
        console.error('Erro ao obter badges:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/gamification/badges/available
 * @desc    Obtém badges disponíveis para conquista
 * @access  Private
 */
router.get('/badges/available', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const availableBadges = await gamificationService.getAvailableBadges(userId);
        
        res.json({
            success: true,
            data: availableBadges
        });
        
    } catch (error) {
        console.error('Erro ao obter badges disponíveis:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/gamification/badges/:badgeId
 * @desc    Obtém detalhes de um badge específico
 * @access  Private
 */
router.get('/badges/:badgeId', authenticateToken, async (req, res) => {
    try {
        const { badgeId } = req.params;
        
        const badge = await Badge.findById(badgeId);
        
        if (!badge) {
            return res.status(404).json({
                success: false,
                error: 'Badge não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: badge
        });
        
    } catch (error) {
        console.error('Erro ao obter badge:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/gamification/leaderboard
 * @desc    Obtém ranking de usuários
 * @access  Public
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const { type = 'points', limit = 50 } = req.query;
        
        const leaderboard = await gamificationService.getLeaderboard(type, parseInt(limit));
        
        res.json({
            success: true,
            data: leaderboard
        });
        
    } catch (error) {
        console.error('Erro ao obter leaderboard:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/gamification/stats/:userId
 * @desc    Obtém estatísticas de gamificação do usuário
 * @access  Private
 */
router.get('/stats/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Verifica se o usuário pode ver as estatísticas
        if (req.user.userId !== userId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        const stats = await gamificationService.getUserStats(userId);
        
        res.json({
            success: true,
            data: stats
        });
        
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/gamification/achievement
 * @desc    Registra uma conquista
 * @access  Private
 */
router.post('/achievement', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { type, value, context } = req.body;
        
        const result = await gamificationService.recordAchievement(userId, type, value, context);
        
        res.json({
            success: true,
            data: result,
            message: 'Conquista registrada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao registrar conquista:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/gamification/challenges/weekly
 * @desc    Obtém desafios semanais
 * @access  Private
 */
router.get('/challenges/weekly', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const weeklyChallenges = await gamificationService.getWeeklyChallenges(userId);
        
        res.json({
            success: true,
            data: weeklyChallenges
        });
        
    } catch (error) {
        console.error('Erro ao obter desafios semanais:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/gamification/challenges/:challengeId/accept
 * @desc    Aceita um desafio
 * @access  Private
 */
router.post('/challenges/:challengeId/accept', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { challengeId } = req.params;
        
        const result = await gamificationService.acceptChallenge(challengeId, userId);
        
        res.json({
            success: true,
            data: result,
            message: 'Desafio aceito com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao aceitar desafio:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/gamification/animations
 * @desc    Obtém configurações de animações
 * @access  Public
 */
router.get('/animations', async (req, res) => {
    try {
        const animations = gamificationService.getAnimationConfig();
        
        res.json({
            success: true,
            data: animations
        });
        
    } catch (error) {
        console.error('Erro ao obter configurações de animações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/gamification/animations/trigger
 * @desc    Dispara uma animação
 * @access  Private
 */
router.post('/animations/trigger', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { animationType, context } = req.body;
        
        const result = await gamificationService.triggerAnimation(userId, animationType, context);
        
        res.json({
            success: true,
            data: result,
            message: 'Animação disparada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao disparar animação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

module.exports = router;