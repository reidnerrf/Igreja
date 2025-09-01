# 🎯 ConnectFé - Funcionalidades Católicas Implementadas

## 📋 Visão Geral

Este documento descreve todas as funcionalidades católicas implementadas no sistema ConnectFé, incluindo:

- **App Exclusivamente Católico**: Remoção de outras denominações
- **Temas Sazonais Automáticos**: Mudança automática baseada no calendário litúrgico
- **Branding da Igreja**: Personalização completa de cores, logos e temas
- **Gamificação Expandida**: Quests, streaks, badges e animações
- **Notificações com Ações Rápidas**: Confirmação de presença, doações e orações

## 🚀 Funcionalidades Implementadas

### 1. 🎯 App Exclusivamente Católico

#### Modificações Realizadas:
- ✅ **Removido campo `denomination`** do modelo User
- ✅ **Onboarding exclusivamente católico** implementado
- ✅ **Declaração de fé católica** obrigatória
- ✅ **Validação de usuários católicos** em todas as rotas

#### Arquivos Modificados:
- `backend/models/User.js` - Removido campo denomination
- `backend/models/CatholicOnboarding.js` - Modelo de onboarding católico
- `backend/services/catholicOnboardingService.js` - Serviço de onboarding
- `backend/routes/catholic-onboarding.js` - Rotas de onboarding

#### Endpoints Disponíveis:
```http
POST /api/catholic-onboarding/start          # Inicia onboarding
GET  /api/catholic-onboarding/status        # Status atual
PUT  /api/catholic-onboarding/step/:stepId  # Completa etapa
POST /api/catholic-onboarding/faith-declaration # Confirma fé católica
POST /api/catholic-onboarding/church-info   # Salva info da paróquia
POST /api/catholic-onboarding/sacraments    # Salva sacramentos
POST /api/catholic-onboarding/preferences   # Salva preferências
POST /api/catholic-onboarding/community     # Salva preferências de comunidade
POST /api/catholic-onboarding/complete      # Finaliza onboarding
GET  /api/catholic-onboarding/steps         # Lista etapas
POST /api/catholic-onboarding/validate      # Valida onboarding
```

### 2. 🎨 Temas Sazonais Automáticos

#### Funcionalidades:
- ✅ **Mudança automática** de temas baseada no calendário litúrgico
- ✅ **Datas especiais católicas** reconhecidas automaticamente
- ✅ **Cores litúrgicas** aplicadas conforme a estação
- ✅ **Cálculo automático** de datas móveis (Páscoa, Pentecostes)

#### Temas Implementados:
- **Advento** (Dezembro) - Azul
- **Natal** (25 Dez - 6 Jan) - Vermelho e Dourado
- **Quaresma** (40 dias antes da Páscoa) - Roxo
- **Páscoa** (Domingo de Páscoa) - Dourado
- **Pentecostes** (50 dias após Páscoa) - Laranja
- **Tempo Comum** (resto do ano) - Verde

#### Arquivos Implementados:
- `backend/config/catholic-theme.js` - Configuração de temas
- `backend/services/seasonalThemeService.js` - Serviço de temas
- `backend/routes/seasonal-themes.js` - Rotas de temas

#### Endpoints Disponíveis:
```http
GET /api/seasonal-themes/current            # Tema atual
GET /api/seasonal-themes/date/:date         # Tema para data específica
GET /api/seasonal-themes/upcoming           # Temas próximos
GET /api/seasonal-themes/special-dates      # Datas especiais do ano
GET /api/seasonal-themes/seasons            # Todas as estações
GET /api/seasonal-themes/season/:seasonName # Estação específica
GET /api/seasonal-themes/calculate-easter/:year # Calcula datas da Páscoa
GET /api/seasonal-themes/calendar/:year     # Calendário litúrgico
GET /api/seasonal-themes/feasts             # Todas as festas
GET /api/seasonal-themes/colors             # Cores litúrgicas
GET /api/seasonal-themes/statistics         # Estatísticas dos temas
POST /api/seasonal-themes/apply/:churchId   # Aplica tema à igreja
GET /api/seasonal-themes/church/:churchId   # Tema atual da igreja
```

### 3. 🏛️ Branding da Igreja

#### Funcionalidades:
- ✅ **Personalização de cores** (primária, secundária, destaque, etc.)
- ✅ **Upload de logos** (principal, secundário, favicon)
- ✅ **Imagens de capa** personalizáveis
- ✅ **Temas visuais** pré-definidos
- ✅ **Preview em tempo real** das mudanças

#### Arquivos Implementados:
- `backend/models/ChurchBranding.js` - Modelo de branding
- `backend/services/churchBrandingService.js` - Serviço de branding
- `backend/routes/church-branding.js` - Rotas de branding

#### Endpoints Disponíveis:
```http
GET    /api/church-branding/:churchId       # Obtém branding
POST   /api/church-branding/:churchId       # Cria/atualiza branding
PUT    /api/church-branding/:churchId/colors # Atualiza cores
POST   /api/church-branding/:churchId/logo  # Upload de logo
POST   /api/church-branding/:churchId/cover # Upload de capa
PUT    /api/church-branding/:churchId/theme # Atualiza tema
DELETE /api/church-branding/:churchId/logo/:logoType # Remove logo
DELETE /api/church-branding/:churchId/cover # Remove capa
GET    /api/church-branding/:churchId/preview # Preview do branding
POST   /api/church-branding/:churchId/reset # Reseta para padrão
```

### 4. 🏆 Gamificação Expandida

#### Funcionalidades:
- ✅ **Quests semanais** com barras de progresso
- ✅ **Streaks diários** com lembretes
- ✅ **Sistema de badges** para conquistas
- ✅ **Animações de conquista** (confetes, sons, cartões)
- ✅ **Ranking da comunidade** e estatísticas
- ✅ **Desafios semanais** e metas mensais

#### Arquivos Implementados:
- `backend/models/Quest.js` - Modelo de quests
- `backend/models/Streak.js` - Modelo de streaks
- `backend/models/Badge.js` - Modelo de badges
- `backend/services/gamificationService.js` - Serviço de gamificação
- `backend/routes/gamification-expanded.js` - Rotas de gamificação

#### Endpoints Disponíveis:
```http
GET  /api/gamification/quests               # Lista quests do usuário
GET  /api/gamification/quests/active        # Quests ativas
GET  /api/gamification/quests/seasonal      # Quests sazonais
POST /api/gamification/quests/:questId/progress # Atualiza progresso
POST /api/gamification/quests/:questId/complete # Completa quest
GET  /api/gamification/streak               # Streak atual
POST /api/gamification/streak/checkin       # Check-in no streak
GET  /api/gamification/streak/history       # Histórico de check-ins
GET  /api/gamification/badges               # Badges do usuário
GET  /api/gamification/badges/available     # Badges disponíveis
GET  /api/gamification/leaderboard          # Ranking da comunidade
GET  /api/gamification/stats/:userId        # Estatísticas do usuário
POST /api/gamification/achievement          # Registra conquista
GET  /api/gamification/challenges/weekly    # Desafios semanais
POST /api/gamification/challenges/:challengeId/accept # Aceita desafio
GET  /api/gamification/animations           # Configurações de animações
POST /api/gamification/animations/trigger   # Dispara animação
```

### 5. 🔔 Notificações com Ações Rápidas

#### Funcionalidades:
- ✅ **Confirmação de presença** diretamente da notificação
- ✅ **Doações rápidas** para campanhas
- ✅ **Registro de orações** via notificação
- ✅ **Participação em eventos** sem abrir o app
- ✅ **Configurações personalizáveis** por tipo
- ✅ **Histórico completo** de notificações

#### Arquivos Implementados:
- `backend/models/QuickActionNotification.js` - Modelo de notificações
- `backend/services/notificationService.js` - Serviço de notificações
- `backend/routes/quick-notifications.js` - Rotas de notificações

#### Endpoints Disponíveis:
```http
GET  /api/quick-notifications               # Lista notificações
GET  /api/quick-notifications/unread       # Notificações não lidas
GET  /api/quick-notifications/:notificationId # Notificação específica
PUT  /api/quick-notifications/:notificationId/read # Marca como lida
PUT  /api/quick-notifications/:notificationId/dismiss # Dispensa notificação
POST /api/quick-notifications/:notificationId/action # Executa ação
POST /api/quick-notifications/confirm-presence # Confirma presença
POST /api/quick-notifications/donate        # Faz doação
POST /api/quick-notifications/pray          # Registra oração
POST /api/quick-notifications/join-event    # Participa de evento
DELETE /api/quick-notifications/:notificationId # Remove notificação
POST /api/quick-notifications/bulk-action   # Ação em massa
GET  /api/quick-notifications/settings      # Configurações
PUT  /api/quick-notifications/settings      # Atualiza configurações
```

## 🛠️ Configuração e Instalação

### 1. Dependências Necessárias

```bash
npm install express mongoose multer sharp node-cron qrcode expo-server-sdk axios natural @tensorflow/tfjs-node socket.io jsonwebtoken bcryptjs cors helmet express-rate-limit dotenv
```

### 2. Variáveis de Ambiente

```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/connectfe

# JWT
JWT_SECRET=your_jwt_secret_here

# Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_MAX_FILES=10

# Temas Sazonais
SEASONAL_THEMES_ENABLED=true
AUTO_THEME_CHANGE=true

# Gamificação
GAMIFICATION_ENABLED=true
POINTS_SYSTEM=true
BADGES_ENABLED=true

# Notificações
NOTIFICATIONS_ENABLED=true
PUSH_NOTIFICATIONS=true
QUICK_ACTIONS_ENABLED=true
```

### 3. Estrutura de Diretórios

```
backend/
├── config/
│   ├── catholic-theme.js          # Configuração de temas católicos
│   └── index.js                   # Configuração principal
├── models/
│   ├── CatholicOnboarding.js      # Modelo de onboarding
│   ├── ChurchBranding.js          # Modelo de branding
│   ├── Quest.js                   # Modelo de quests
│   ├── Streak.js                  # Modelo de streaks
│   ├── Badge.js                   # Modelo de badges
│   └── QuickActionNotification.js # Modelo de notificações
├── services/
│   ├── catholicOnboardingService.js # Serviço de onboarding
│   ├── churchBrandingService.js     # Serviço de branding
│   ├── seasonalThemeService.js      # Serviço de temas
│   ├── gamificationService.js       # Serviço de gamificação
│   └── notificationService.js       # Serviço de notificações
├── routes/
│   ├── catholic-onboarding.js      # Rotas de onboarding
│   ├── church-branding.js          # Rotas de branding
│   ├── seasonal-themes.js          # Rotas de temas
│   ├── gamification-expanded.js    # Rotas de gamificação
│   └── quick-notifications.js      # Rotas de notificações
├── uploads/
│   ├── branding/                   # Logos e imagens de branding
│   └── thumbnails/                 # Thumbnails gerados
└── server.js                       # Servidor principal
```

## 🎮 Como Usar

### 1. Onboarding Católico

```javascript
// Iniciar onboarding
const response = await fetch('/api/catholic-onboarding/start', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Completar etapa
const stepResponse = await fetch('/api/catholic-onboarding/step/faith_declaration', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        data: {
            isCatholic: true,
            baptismDate: '1990-01-01'
        }
    })
});
```

### 2. Temas Sazonais

```javascript
// Obter tema atual
const currentTheme = await fetch('/api/seasonal-themes/current');

// Obter tema para data específica
const themeForDate = await fetch('/api/seasonal-themes/date/2024-12-25');

// Aplicar tema à igreja
const applyTheme = await fetch('/api/seasonal-themes/apply/church123', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        themeName: 'christmas',
        customColors: {
            primary: '#D32F2F',
            secondary: '#FFD700'
        }
    })
});
```

### 3. Branding da Igreja

```javascript
// Atualizar cores
const updateColors = await fetch('/api/church-branding/church123/colors', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        colors: {
            primary: '#1976D2',
            secondary: '#FFC107',
            accent: '#E91E63'
        }
    })
});

// Upload de logo
const formData = new FormData();
formData.append('logo', logoFile);
formData.append('logoType', 'primary');

const uploadLogo = await fetch('/api/church-branding/church123/logo', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
});
```

### 4. Gamificação

```javascript
// Obter quests ativas
const activeQuests = await fetch('/api/gamification/quests/active', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Fazer check-in no streak
const checkIn = await fetch('/api/gamification/streak/checkin', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        activity: 'prayer',
        notes: 'Oração matinal'
    })
});

// Obter ranking
const leaderboard = await fetch('/api/gamification/leaderboard?type=points&limit=10');
```

### 5. Notificações com Ações Rápidas

```javascript
// Obter notificações não lidas
const unreadNotifications = await fetch('/api/quick-notifications/unread', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Confirmar presença via notificação
const confirmPresence = await fetch('/api/quick-notifications/confirm-presence', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        eventId: 'event123',
        notificationId: 'notif456'
    })
});

// Fazer doação via notificação
const donate = await fetch('/api/quick-notifications/donate', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        campaignId: 'campaign789',
        amount: 50.00,
        paymentMethod: 'pix',
        notificationId: 'notif456'
    })
});
```

## 🎨 Interface de Demonstração

### Acesso à Demonstração

A interface de demonstração está disponível em:
```
http://localhost:3001/catholic-features-demo.html
```

### Funcionalidades Demonstradas

1. **Cards de Funcionalidades**: Visão geral de todas as funcionalidades
2. **Onboarding Católico**: Demonstração do processo de onboarding
3. **Temas Sazonais**: Visualização dos temas e cores litúrgicas
4. **Branding da Igreja**: Personalização de cores e uploads
5. **Gamificação**: Quests, streaks, badges e estatísticas
6. **Notificações**: Sistema de notificações com ações rápidas
7. **Menu Flutuante**: Ações rápidas para dispositivos móveis

## 🔧 Configuração Avançada

### 1. Personalização de Temas

```javascript
// Configurar tema personalizado
const customTheme = {
    name: 'Tema Personalizado',
    colors: {
        primary: '#1976D2',
        secondary: '#FFC107',
        accent: '#E91E63',
        background: '#FFFFFF',
        text: '#212121'
    },
    fonts: {
        primary: 'Inter',
        secondary: 'Roboto'
    },
    spacing: {
        small: '8px',
        medium: '16px',
        large: '24px'
    }
};
```

### 2. Configuração de Gamificação

```javascript
// Configurar sistema de pontos
const pointsConfig = {
    prayer: 10,
    charity: 25,
    event: 15,
    streak: 5,
    quest: 100,
    badge: 50
};

// Configurar quests automáticas
const autoQuests = {
    daily: true,
    weekly: true,
    monthly: true,
    seasonal: true
};
```

### 3. Configuração de Notificações

```javascript
// Configurar tipos de notificação
const notificationTypes = {
    events: true,
    prayers: true,
    donations: true,
    announcements: false,
    dailyDevotional: true
};

// Configurar quiet hours
const quietHours = {
    enabled: true,
    start: '22:00',
    end: '08:00'
};
```

## 🚀 Próximos Passos

### Funcionalidades Planejadas

1. **Integração com Calendário Litúrgico**: Sincronização com calendários oficiais
2. **Sistema de Indulgências**: Rastreamento de indulgências plenárias e parciais
3. **Comunhão Espiritual**: Sistema de comunhão espiritual para fiéis
4. **Novenas e Tríduos**: Rastreamento de devoções específicas
5. **Santo do Dia**: Informações sobre santos e beatos
6. **Orações Tradicionais**: Biblioteca de orações católicas

### Melhorias Técnicas

1. **Cache Inteligente**: Cache automático de temas e configurações
2. **Sincronização Offline**: Funcionalidades offline para dispositivos móveis
3. **Analytics Avançado**: Métricas detalhadas de engajamento
4. **API GraphQL**: Implementação de GraphQL para consultas complexas
5. **Microserviços**: Arquitetura de microserviços para escalabilidade

## 📚 Recursos Adicionais

### Documentação Relacionada

- [Sistema de Upload Local](UPLOAD-README.md)
- [Sistema de Configuração](CONFIGURATION_SYSTEM_README.md)
- [Funcionalidades Avançadas](ADVANCED_FEATURES_README.md)
- [UX e Navegação](UX_NAVIGATION_README.md)

### Links Úteis

- [Calendário Litúrgico Católico](https://www.vatican.va)
- [Catecismo da Igreja Católica](https://www.vatican.va/archive/ENG0015/_INDEX.HTM)
- [Missal Romano](https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_po.html)

## 🤝 Contribuição

Para contribuir com o desenvolvimento das funcionalidades católicas:

1. **Fork** do repositório
2. **Crie uma branch** para sua feature
3. **Implemente** as mudanças
4. **Teste** todas as funcionalidades
5. **Submeta um Pull Request**

### Padrões de Código

- Use **ES6+** e **async/await**
- Siga o padrão **REST API**
- Implemente **validação** adequada
- Adicione **testes** para novas funcionalidades
- Documente **todas as APIs**

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre as funcionalidades católicas:

- **Issues**: [GitHub Issues](https://github.com/connectfe/backend/issues)
- **Documentação**: [Wiki do Projeto](https://github.com/connectfe/backend/wiki)
- **Email**: suporte@connectfe.com.br

---

**🎉 ConnectFé - Conectando Fé e Tecnologia para a Comunidade Católica! 🎉**