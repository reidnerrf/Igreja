/**
 * Rotas de Temas Sazonais Católicos
 * ConnectFé - Sistema de Temas Automáticos
 */

const express = require('express');
const router = express.Router();
const seasonalThemeService = require('../services/seasonalThemeService');
const catholicThemeConfig = require('../config/catholic-theme');

/**
 * @route   GET /api/seasonal-themes/current
 * @desc    Obtém o tema atual
 * @access  Public
 */
router.get('/current', async (req, res) => {
    try {
        const currentTheme = catholicThemeConfig.getCurrentTheme();
        
        res.json({
            success: true,
            data: currentTheme
        });
        
    } catch (error) {
        console.error('Erro ao obter tema atual:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/date/:date
 * @desc    Obtém o tema para uma data específica
 * @access  Public
 */
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const parsedDate = new Date(date);
        
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'Data inválida'
            });
        }
        
        const theme = catholicThemeConfig.getThemeForDate(parsedDate);
        
        res.json({
            success: true,
            data: theme
        });
        
    } catch (error) {
        console.error('Erro ao obter tema para data:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/upcoming
 * @desc    Obtém temas próximos
 * @access  Public
 */
router.get('/upcoming', async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const upcomingThemes = catholicThemeConfig.getUpcomingThemes(parseInt(days));
        
        res.json({
            success: true,
            data: upcomingThemes
        });
        
    } catch (error) {
        console.error('Erro ao obter temas próximos:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/special-dates
 * @desc    Obtém datas especiais do ano
 * @access  Public
 */
router.get('/special-dates', async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        
        const specialDates = catholicThemeConfig.getSpecialDatesForYear(targetYear);
        
        res.json({
            success: true,
            data: specialDates
        });
        
    } catch (error) {
        console.error('Erro ao obter datas especiais:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/seasons
 * @desc    Obtém todas as estações litúrgicas
 * @access  Public
 */
router.get('/seasons', async (req, res) => {
    try {
        const seasons = catholicThemeConfig.getAllSeasons();
        
        res.json({
            success: true,
            data: seasons
        });
        
    } catch (error) {
        console.error('Erro ao obter estações:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/season/:seasonName
 * @desc    Obtém informações de uma estação específica
 * @access  Public
 */
router.get('/season/:seasonName', async (req, res) => {
    try {
        const { seasonName } = req.params;
        const season = catholicThemeConfig.getSeason(seasonName);
        
        if (!season) {
            return res.status(404).json({
                success: false,
                error: 'Estação não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: season
        });
        
    } catch (error) {
        console.error('Erro ao obter estação:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/calculate-easter/:year
 * @desc    Calcula a data da Páscoa para um ano específico
 * @access  Public
 */
router.get('/calculate-easter/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const targetYear = parseInt(year);
        
        if (isNaN(targetYear) || targetYear < 1583 || targetYear > 9999) {
            return res.status(400).json({
                success: false,
                error: 'Ano deve estar entre 1583 e 9999'
            });
        }
        
        const easterDate = catholicThemeConfig.calculateEaster(targetYear);
        const ascensionDate = catholicThemeConfig.calculateAscension(targetYear);
        const pentecostDate = catholicThemeConfig.calculatePentecost(targetYear);
        
        res.json({
            success: true,
            data: {
                year: targetYear,
                easter: easterDate,
                ascension: ascensionDate,
                pentecost: pentecostDate
            }
        });
        
    } catch (error) {
        console.error('Erro ao calcular datas da Páscoa:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/calendar/:year
 * @desc    Obtém calendário litúrgico completo do ano
 * @access  Public
 */
router.get('/calendar/:year', async (req, res) => {
    try {
        const { year } = req.params;
        const targetYear = parseInt(year);
        
        if (isNaN(targetYear)) {
            return res.status(400).json({
                success: false,
                error: 'Ano inválido'
            });
        }
        
        const calendar = catholicThemeConfig.getLiturgicalCalendar(targetYear);
        
        res.json({
            success: true,
            data: calendar
        });
        
    } catch (error) {
        console.error('Erro ao obter calendário litúrgico:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/feast/:feastName
 * @desc    Obtém informações de uma festa específica
 * @access  Public
 */
router.get('/feast/:feastName', async (req, res) => {
    try {
        const { feastName } = req.params;
        const feast = catholicThemeConfig.getFeast(feastName);
        
        if (!feast) {
            return res.status(404).json({
                success: false,
                error: 'Festa não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: feast
        });
        
    } catch (error) {
        console.error('Erro ao obter festa:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/feasts
 * @desc    Obtém todas as festas católicas
 * @access  Public
 */
router.get('/feasts', async (req, res) => {
    try {
        const feasts = catholicThemeConfig.getAllFeasts();
        
        res.json({
            success: true,
            data: feasts
        });
        
    } catch (error) {
        console.error('Erro ao obter festas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/color/:colorName
 * @desc    Obtém informações sobre uma cor litúrgica
 * @access  Public
 */
router.get('/color/:colorName', async (req, res) => {
    try {
        const { colorName } = req.params;
        const colorInfo = catholicThemeConfig.getLiturgicalColor(colorName);
        
        if (!colorInfo) {
            return res.status(404).json({
                success: false,
                error: 'Cor litúrgica não encontrada'
            });
        }
        
        res.json({
            success: true,
            data: colorInfo
        });
        
    } catch (error) {
        console.error('Erro ao obter cor litúrgica:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/colors
 * @desc    Obtém todas as cores litúrgicas
 * @access  Public
 */
router.get('/colors', async (req, res) => {
    try {
        const colors = catholicThemeConfig.getAllLiturgicalColors();
        
        res.json({
            success: true,
            data: colors
        });
        
    } catch (error) {
        console.error('Erro ao obter cores litúrgicas:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/statistics
 * @desc    Obtém estatísticas dos temas
 * @access  Public
 */
router.get('/statistics', async (req, res) => {
    try {
        const stats = catholicThemeConfig.getThemeStatistics();
        
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
 * @route   POST /api/seasonal-themes/apply/:churchId
 * @desc    Aplica tema sazonal a uma igreja
 * @access  Private (Apenas igrejas)
 */
router.post('/apply/:churchId', async (req, res) => {
    try {
        const { churchId } = req.params;
        const { themeName, customColors } = req.body;
        
        const result = await seasonalThemeService.applyThemeToChurch(
            churchId, 
            themeName, 
            customColors
        );
        
        res.json({
            success: true,
            data: result,
            message: 'Tema aplicado com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao aplicar tema:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            message: error.message
        });
    }
});

/**
 * @route   GET /api/seasonal-themes/church/:churchId
 * @desc    Obtém tema atual de uma igreja
 * @access  Public
 */
router.get('/church/:churchId', async (req, res) => {
    try {
        const { churchId } = req.params;
        
        const churchTheme = await seasonalThemeService.getChurchTheme(churchId);
        
        res.json({
            success: true,
            data: churchTheme
        });
        
    } catch (error) {
        console.error('Erro ao obter tema da igreja:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router;