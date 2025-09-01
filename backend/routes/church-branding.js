/**
 * Rotas de Branding da Igreja
 * ConnectFé - Sistema de Personalização
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ChurchBranding = require('../models/ChurchBranding');
const { authenticateToken } = require('../middleware/auth');
const churchBrandingService = require('../services/churchBrandingService');

// Configuração do Multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas'));
        }
    }
});

/**
 * @route   GET /api/church-branding/:churchId
 * @desc    Obtém o branding de uma igreja
 * @access  Public
 */
router.get('/:churchId', async (req, res) => {
    try {
        const { churchId } = req.params;
        
        const branding = await ChurchBranding.findOne({ churchId });
        
        if (!branding) {
            return res.status(404).json({
                success: false,
                error: 'Branding não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: branding
        });
        
    } catch (error) {
        console.error('Erro ao obter branding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/church-branding/:churchId
 * @desc    Cria ou atualiza o branding de uma igreja
 * @access  Private (Apenas igrejas)
 */
router.post('/:churchId', authenticateToken, async (req, res) => {
    try {
        const { churchId } = req.params;
        const { userId } = req.user;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        const brandingData = req.body;
        
        const branding = await churchBrandingService.createOrUpdateBranding(
            churchId, 
            brandingData
        );
        
        res.json({
            success: true,
            data: branding,
            message: 'Branding atualizado com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar branding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/church-branding/:churchId/colors
 * @desc    Atualiza as cores do branding
 * @access  Private (Apenas igrejas)
 */
router.put('/:churchId/colors', authenticateToken, async (req, res) => {
    try {
        const { churchId } = req.params;
        const { userId } = req.user;
        const { colors } = req.body;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        const branding = await churchBrandingService.updateColors(churchId, colors);
        
        res.json({
            success: true,
            data: branding,
            message: 'Cores atualizadas com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar cores:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/church-branding/:churchId/logo
 * @desc    Faz upload de logo
 * @access  Private (Apenas igrejas)
 */
router.post('/:churchId/logo', authenticateToken, upload.single('logo'), async (req, res) => {
    try {
        const { churchId } = req.params;
        const { userId } = req.user;
        const { logoType = 'primary' } = req.body;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo enviado'
            });
        }
        
        const result = await churchBrandingService.uploadLogo(
            churchId,
            req.file.buffer,
            req.file.originalname,
            logoType
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Logo enviado com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao enviar logo:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   POST /api/church-branding/:churchId/cover
 * @desc    Faz upload de imagem de capa
 * @access  Private (Apenas igrejas)
 */
router.post('/:churchId/cover', authenticateToken, upload.single('cover'), async (req, res) => {
    try {
        const { churchId } = req.params;
        const { userId } = req.user;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo enviado'
            });
        }
        
        const result = await churchBrandingService.uploadCover(
            churchId,
            req.file.buffer,
            req.file.originalname
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Imagem de capa enviada com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao enviar imagem de capa:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   PUT /api/church-branding/:churchId/theme
 * @desc    Atualiza o tema da igreja
 * @access  Private (Apenas igrejas)
 */
router.put('/:churchId/theme', authenticateToken, async (req, res) => {
    try {
        const { churchId } = req.params;
        const { userId } = req.user;
        const { theme } = req.body;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        const branding = await churchBrandingService.updateTheme(churchId, theme);
        
        res.json({
            success: true,
            data: branding,
            message: 'Tema atualizado com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao atualizar tema:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/church-branding/:churchId/logo/:logoType
 * @desc    Remove um logo específico
 * @access  Private (Apenas igrejas)
 */
router.delete('/:churchId/logo/:logoType', authenticateToken, async (req, res) => {
    try {
        const { churchId, logoType } = req.params;
        const { userId } = req.user;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        await churchBrandingService.removeLogo(churchId, logoType);
        
        res.json({
            success: true,
            message: 'Logo removido com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao remover logo:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   DELETE /api/church-branding/:churchId/cover
 * @desc    Remove a imagem de capa
 * @access  Private (Apenas igrejas)
 */
router.delete('/:churchId/cover', authenticateToken, async (req, res) => {
    try {
        const { churchId } = req.params;
        const { userId } = req.user;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        await churchBrandingService.removeCover(churchId);
        
        res.json({
            success: true,
            message: 'Imagem de capa removida com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao remover imagem de capa:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/church-branding/:churchId/preview
 * @desc    Obtém preview do branding
 * @access  Public
 */
router.get('/:churchId/preview', async (req, res) => {
    try {
        const { churchId } = req.params;
        
        const preview = await churchBrandingService.generatePreview(churchId);
        
        res.json({
            success: true,
            data: preview
        });
        
    } catch (error) {
        console.error('Erro ao gerar preview:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   POST /api/church-branding/:churchId/reset
 * @desc    Reseta o branding para padrão
 * @access  Private (Apenas igrejas)
 */
router.post('/:churchId/reset', authenticateToken, async (req, res) => {
    try {
        const { churchId } = req.params;
        const { userId } = req.user;
        
        // Verifica se o usuário é a igreja ou tem permissão
        if (userId !== churchId && req.user.userType !== 'church') {
            return res.status(403).json({
                success: false,
                error: 'Acesso negado'
            });
        }
        
        const branding = await churchBrandingService.resetToDefault(churchId);
        
        res.json({
            success: true,
            data: branding,
            message: 'Branding resetado para padrão'
        });
        
    } catch (error) {
        console.error('Erro ao resetar branding:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

module.exports = router;