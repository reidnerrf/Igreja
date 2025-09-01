/**
 * Rotas de Onboarding Católico
 * ConnectFé - Sistema de Onboarding Exclusivamente Católico
 */

const express = require('express');
const router = express.Router();
const CatholicOnboarding = require('../models/CatholicOnboarding');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const catholicOnboardingService = require('../services/catholicOnboardingService');

/**
 * @route   POST /api/catholic-onboarding/start
 * @desc    Inicia o processo de onboarding católico
 * @access  Private
 */
router.post('/start', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        // Verifica se o usuário já tem onboarding
        let onboarding = await CatholicOnboarding.findOne({ userId });
        
        if (!onboarding) {
            // Cria novo onboarding
            onboarding = await catholicOnboardingService.createOnboarding(userId);
        }
        
        res.json({
            success: true,
            data: onboarding,
            message: 'Onboarding católico iniciado com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao iniciar onboarding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/catholic-onboarding/status
 * @desc    Obtém o status atual do onboarding
 * @access  Private
 */
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const onboarding = await CatholicOnboarding.findOne({ userId });
        
        if (!onboarding) {
            return res.status(404).json({
                success: false,
                error: 'Onboarding não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: onboarding
        });
        
    } catch (error) {
        console.error('Erro ao obter status do onboarding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   PUT /api/catholic-onboarding/step/:stepId
 * @desc    Completa uma etapa específica do onboarding
 * @access  Private
 */
router.put('/step/:stepId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { stepId } = req.params;
        const { data } = req.body;
        
        const result = await catholicOnboardingService.completeStep(userId, stepId, data);
        
        res.json({
            success: true,
            data: result,
            message: 'Etapa completada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao completar etapa:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/catholic-onboarding/faith-declaration
 * @desc    Confirma declaração de fé católica
 * @access  Private
 */
router.post('/faith-declaration', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { 
            isCatholic, 
            baptismDate, 
            confirmationDate, 
            parish,
            sacraments,
            religiousEducation 
        } = req.body;
        
        // Valida se o usuário é católico
        if (!isCatholic) {
            return res.status(400).json({
                success: false,
                error: 'Apenas usuários católicos podem usar esta plataforma'
            });
        }
        
        const result = await catholicOnboardingService.confirmFaithDeclaration(
            userId, 
            { 
                isCatholic, 
                baptismDate, 
                confirmationDate, 
                parish,
                sacraments,
                religiousEducation 
            }
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Declaração de fé confirmada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao confirmar declaração de fé:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/catholic-onboarding/church-info
 * @desc    Salva informações da paróquia
 * @access  Private
 */
router.post('/church-info', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { 
            parishName, 
            diocese, 
            city, 
            state,
            address,
            phone,
            website 
        } = req.body;
        
        const result = await catholicOnboardingService.saveChurchInfo(
            userId, 
            { 
                parishName, 
                diocese, 
                city, 
                state,
                address,
                phone,
                website 
            }
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Informações da paróquia salvas com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao salvar informações da paróquia:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/catholic-onboarding/sacraments
 * @desc    Salva informações dos sacramentos
 * @access  Private
 */
router.post('/sacraments', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { sacraments } = req.body;
        
        const result = await catholicOnboardingService.saveSacraments(userId, sacraments);
        
        res.json({
            success: true,
            data: result,
            message: 'Sacramentos salvos com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao salvar sacramentos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/catholic-onboarding/preferences
 * @desc    Salva preferências espirituais
 * @access  Private
 */
router.post('/preferences', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { 
            prayerStyle, 
            massPreference, 
            confessionFrequency,
            adoration,
            bibleStudy,
            spiritualDirection 
        } = req.body;
        
        const result = await catholicOnboardingService.saveSpiritualPreferences(
            userId, 
            { 
                prayerStyle, 
                massPreference, 
                confessionFrequency,
                adoration,
                bibleStudy,
                spiritualDirection 
            }
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Preferências espirituais salvas com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao salvar preferências espirituais:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/catholic-onboarding/community
 * @desc    Salva preferências de comunidade
 * @access  Private
 */
router.post('/community', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        const { 
            involvementLevel, 
            ministries, 
            ageGroup,
            language 
        } = req.body;
        
        const result = await catholicOnboardingService.saveCommunityPreferences(
            userId, 
            { 
                involvementLevel, 
                ministries, 
                ageGroup,
                language 
            }
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Preferências de comunidade salvas com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao salvar preferências de comunidade:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/catholic-onboarding/complete
 * @desc    Finaliza o processo de onboarding
 * @access  Private
 */
router.post('/complete', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const result = await catholicOnboardingService.completeOnboarding(userId);
        
        res.json({
            success: true,
            data: result,
            message: 'Onboarding católico completado com sucesso! Bem-vindo ao ConnectFé!'
        });
        
    } catch (error) {
        console.error('Erro ao completar onboarding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/catholic-onboarding/steps
 * @desc    Obtém todas as etapas do onboarding
 * @access  Public
 */
router.get('/steps', async (req, res) => {
    try {
        const steps = catholicOnboardingService.getDefaultSteps();
        
        res.json({
            success: true,
            data: steps
        });
        
    } catch (error) {
        console.error('Erro ao obter etapas do onboarding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/catholic-onboarding/validate
 * @desc    Valida se o usuário pode completar o onboarding
 * @access  Private
 */
router.post('/validate', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;
        
        const validation = await catholicOnboardingService.validateOnboarding(userId);
        
        res.json({
            success: true,
            data: validation
        });
        
    } catch (error) {
        console.error('Erro ao validar onboarding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

module.exports = router;