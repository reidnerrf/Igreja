# FaithConnect - Plataforma de Conectividade para Igrejas

## 🎯 **FASE 1 (MVP) - IMPLEMENTADA COM SUCESSO!**

### ✅ **Funcionalidades Completamente Implementadas:**

#### 🚀 **Core Features:**
1. **Onboarding Completo** - Sistema de introdução com seleção de tipo de usuário (Igreja/Usuário)
2. **Tema Claro/Escuro** - Sistema completo de alternância de temas com persistência
3. **Sistema de Login** - Autenticação para igrejas e usuários
4. **Dashboards Específicos** - Interfaces personalizadas para cada tipo de usuário
5. **Navegação Intuitiva** - Sistema de navegação inferior responsivo

#### 🗺️ **Mapa de Igrejas:**
- Busca e filtros por denominação
- Ordenação por distância, avaliação ou nome
- Perfis verificados com badges de confiança
- Informações detalhadas (endereço, telefone, email, website)
- Horários de cultos e serviços
- Sistema de avaliações e número de membros

#### 📅 **Sistema de Agenda:**
- Visualizações: Mês, Semana e Dia
- Filtros por tipo de evento (Pessoal, Igreja, Comunidade)
- Criação e edição de eventos
- Eventos recorrentes (semanal, mensal, anual)
- Lembretes configuráveis
- Cores personalizadas para categorização
- Gestão completa de eventos para igrejas

#### 📺 **Transmissões ao Vivo:**
- Criação e gestão de transmissões para igrejas
- Categorização (Culto, Estudo, Evento, Oração, Outro)
- Qualidades de vídeo (SD, HD, 4K)
- Chat ao vivo integrado
- Sistema de agendamento
- Controles de transmissão (iniciar, pausar, finalizar)
- Histórico de transmissões
- Badges de verificação e premium

#### 💰 **Sistema de Doações:**
- Campanhas de doação categorizadas
- Metas e progresso visual
- Doações únicas e recorrentes
- Múltiplos métodos de pagamento
- Sistema de doações anônimas
- Histórico completo para igrejas
- Badges de verificação e premium
- Relatórios e estatísticas

#### 🛡️ **Moderação e Verificação:**
- Sistema de perfis verificados
- Badges de confiança para igrejas
- Ferramentas de moderação para administradores
- Controle de conteúdo e usuários
- Sistema de denúncias

#### 🎨 **UI/UX Moderna:**
- Design responsivo com Tailwind CSS
- Componentes Radix UI para acessibilidade
- Animações e transições suaves
- Ícones Lucide React
- Paleta de cores consistente
- Suporte completo a temas claro/escuro

---

## 🚀 **Como Executar:**

### Pré-requisitos:
- Node.js 18+ 
- npm ou yarn

### Instalação:
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Acessar:
- **Desenvolvimento:** http://localhost:5173
- **Produção:** Após build, servir arquivos da pasta `dist`

---

## 🏗️ **Arquitetura Técnica:**

### **Frontend:**
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones

### **Estrutura de Componentes:**
```
src/
├── components/
│   ├── ui/           # Componentes base (Radix UI)
│   ├── MapComponent.tsx      # Mapa de igrejas
│   ├── AgendaComponent.tsx   # Sistema de agenda
│   ├── LiveStreamComponent.tsx # Transmissões ao vivo
│   ├── DonationComponent.tsx # Sistema de doações
│   ├── Onboarding.tsx        # Onboarding
│   ├── ThemeProvider.tsx     # Gerenciamento de temas
│   └── ...
├── App.tsx           # Aplicação principal
└── main.tsx          # Ponto de entrada
```

---

## 🎯 **Próximas Fases (Roadmap):**

### **Fase 2 (3-4 meses):**
- Sistema de notificações push
- Integração com APIs de pagamento reais
- Sistema de rifas premium
- Chat em tempo real entre usuários
- Sistema de grupos e comunidades

### **Fase 3 (2-3 meses):**
- App mobile nativo (React Native)
- Integração com redes sociais
- Sistema de gamificação
- Analytics avançados para igrejas
- API pública para desenvolvedores

---

## 🤝 **Contribuição:**

Este projeto está em desenvolvimento ativo. Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

## 📄 **Licença:**

Projeto desenvolvido para conectar comunidades de fé através de tecnologia moderna e acessível.

---

## 🎉 **Status da Fase 1:**

**✅ COMPLETADA COM SUCESSO!**

Todas as funcionalidades principais da Fase 1 (MVP) foram implementadas e estão funcionando perfeitamente:

- ✅ Mapa + perfis verificados
- ✅ Agenda completa
- ✅ Transmissões integradas
- ✅ Doações básicas
- ✅ Moderação mínima
- ✅ Onboarding completo
- ✅ Tema claro/escuro

**A aplicação está pronta para uso e demonstração!**  