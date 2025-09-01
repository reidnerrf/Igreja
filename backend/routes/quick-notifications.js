/**
 * Rotas de Notificações com Ações Rápidas
 * ConnectFé - Sistema de Notificações Avançado
 */

const express = require('express');
const router = express.Router();
const QuickActionNotification = require('../models/QuickActionNotification');
const User = require('../models/User');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const Prayer = require('../models/Prayer');
const { authenticateToken } = require('../middleware/auth');
const notificationService = require('../services/notificationService');

/**
 * @route   GET /api/quick-notifications
 * @desc    Obtém notificações do usuário
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { status, category, priority, limit = 20, page = 1 } = req.query;
        
        const filter = { userId };
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const notifications = await QuickActionNotification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        const total = await QuickActionNotification.countDocuments(filter);
        
        res.json({
            success: true,
            data: notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
        
    } catch (error) {
        console.error('Erro ao obter notificações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/quick-notifications/unread
 * @desc    Obtém notificações não lidas
 * @access  Private
 */
router.get('/unread', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const unreadNotifications = await QuickActionNotification.find({
            userId,
            status: 'unread'
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: unreadNotifications
        });
        
    } catch (error) {
        console.error('Erro ao obter notificações não lidas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/quick-notifications/:notificationId
 * @desc    Obtém uma notificação específica
 * @access  Private
 */
router.get('/:notificationId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { notificationId } = req.params;
        
        const notification = await QuickActionNotification.findOne({
            _id: notificationId,
            userId
        });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notificação não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: notification
        });
        
    } catch (error) {
        console.error('Erro ao obter notificação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   PUT /api/quick-notifications/:notificationId/read
 * @desc    Marca notificação como lida
 * @access  Private
 */
router.put('/:notificationId/read', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { notificationId } = req.params;
        
        const notification = await QuickActionNotification.findOneAndUpdate(
            { _id: notificationId, userId },
            { status: 'read' },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notificação não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: notification,
            message: 'Notificação marcada como lida'
        });
        
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   PUT /api/quick-notifications/:notificationId/dismiss
 * @desc    Dispensa uma notificação
 * @access  Private
 */
router.put('/:notificationId/dismiss', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { notificationId } = req.params;
        
        const notification = await QuickActionNotification.findOneAndUpdate(
            { _id: notificationId, userId },
            { status: 'dismissed' },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notificação não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: notification,
            message: 'Notificação dispensada'
        });
        
    } catch (error) {
        console.error('Erro ao dispensar notificação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/quick-notifications/:notificationId/action
 * @desc    Executa uma ação rápida da notificação
 * @access  Private
 */
router.post('/:notificationId/action', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { notificationId } = req.params;
        const { actionType, actionData } = req.body;
        
        const notification = await QuickActionNotification.findOne({
            _id: notificationId,
            userId
        });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notificação não encontrada'
            });
        }
        
        // Executa a ação baseada no tipo
        let result;
        switch (actionType) {
            case 'confirm_presence':
                result = await notificationService.executeConfirmPresence(notification, actionData);
                break;
            case 'donate':
                result = await notificationService.executeDonate(notification, actionData);
                break;
            case 'pray':
                result = await notificationService.executePray(notification, actionData);
                break;
            case 'join_event':
                result = await notificationService.executeJoinEvent(notification, actionData);
                break;
            case 'mark_complete':
                result = await notification.executeMarkComplete(userId);
                break;
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Tipo de ação não suportado'
                });
        }
        
        // Marca a notificação como processada
        await QuickActionNotification.findByIdAndUpdate(notificationId, {
            status: 'actioned',
            actionedAt: new Date()
        });
        
        res.json({
            success: true,
            data: result,
            message: 'Ação executada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao executar ação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/quick-notifications/confirm-presence
 * @desc    Confirma presença em evento via notificação
 * @access  Private
 */
router.post('/confirm-presence', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { eventId, notificationId } = req.body;
        
        const result = await notificationService.confirmPresenceFromNotification(
            userId, 
            eventId, 
            notificationId
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Presença confirmada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao confirmar presença:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/quick-notifications/donate
 * @desc    Faz doação via notificação
 * @access  Private
 */
router.post('/donate', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { 
            campaignId, 
            amount, 
            paymentMethod, 
            notificationId,
            anonymous = false 
        } = req.body;
        
        const result = await notificationService.donateFromNotification(
            userId,
            campaignId,
            amount,
            paymentMethod,
            notificationId,
            anonymous
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Doação realizada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao fazer doação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/quick-notifications/pray
 * @desc    Registra oração via notificação
 * @access  Private
 */
router.post('/pray', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { 
            intention, 
            duration, 
            notificationId,
            isPrivate = false 
        } = req.body;
        
        const result = await notificationService.prayFromNotification(
            userId,
            intention,
            duration,
            notificationId,
            isPrivate
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Oração registrada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao registrar oração:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/quick-notifications/join-event
 * @desc    Participa de evento via notificação
 * @access  Private
 */
router.post('/join-event', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { eventId, notificationId } = req.body;
        
        const result = await notificationService.joinEventFromNotification(
            userId,
            eventId,
            notificationId
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Participação confirmada com sucesso!'
        });
        
    } catch (error) {
        console.error('Erro ao participar do evento:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/quick-notifications/:notificationId
 * @desc    Remove uma notificação
 * @access  Private
 */
router.delete('/:notificationId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { notificationId } = req.params;
        
        const notification = await QuickActionNotification.findOneAndDelete({
            _id: notificationId,
            userId
        });
        
        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notificação não encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Notificação removida com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao remover notificação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/quick-notifications/bulk-action
 * @desc    Executa ação em múltiplas notificações
 * @access  Private
 */
router.post('/bulk-action', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { notificationIds, action } = req.body;
        
        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'IDs de notificação são obrigatórios'
            });
        }
        
        let updateData = {};
        let message = '';
        
        switch (action) {
            case 'mark_read':
                updateData = { status: 'read' };
                message = 'Notificações marcadas como lidas';
                break;
            case 'mark_unread':
                updateData = { status: 'unread' };
                message = 'Notificações marcadas como não lidas';
                break;
            case 'dismiss':
                updateData = { status: 'dismissed' };
                message = 'Notificações dispensadas';
                break;
            case 'delete':
                await QuickActionNotification.deleteMany({
                    _id: { $in: notificationIds },
                    userId
                });
                return res.json({
                    success: true,
                    message: 'Notificações removidas com sucesso'
                });
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Ação não suportada'
                });
        }
        
        const result = await QuickActionNotification.updateMany(
            { _id: { $in: notificationIds }, userId },
            updateData
        );
        
        res.json({
            success: true,
            data: result,
            message
        });
        
    } catch (error) {
        console.error('Erro ao executar ação em massa:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/quick-notifications/settings
 * @desc    Obtém configurações de notificação do usuário
 * @access  Private
 */
router.get('/settings', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: user.notificationSettings
        });
        
    } catch (error) {
        console.error('Erro ao obter configurações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   PUT /api/quick-notifications/settings
 * @desc    Atualiza configurações de notificação
 * @access  Private
 */
router.put('/settings', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { notificationSettings } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { notificationSettings },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: user.notificationSettings,
            message: 'Configurações atualizadas com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar configurações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router;