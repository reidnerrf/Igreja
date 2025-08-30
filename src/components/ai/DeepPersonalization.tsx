import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Brain, 
  User, 
  Settings, 
  Target, 
  TrendingUp, 
  Eye,
  Loader2,
  Zap,
  Filter,
  BarChart3,
  Users,
  MapPin,
  Clock,
  Star,
  Heart,
  Calendar,
  Radio,
  DollarSign,
  Gift,
  Bell,
  MessageCircle,
  Shield,
  Crown
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  preferences: {
    denominations: string[];
    preferredServices: string[];
    preferredTimes: string[];
    maxDistance: number;
    minRating: number;
    verifiedOnly: boolean;
    premiumOnly: boolean;
  };
  behavior: {
    searchPatterns: string[];
    clickPatterns: string[];
    timeSpent: { [key: string]: number };
    interactions: { [key: string]: number };
  };
  demographics: {
    age: number;
    location: string;
    interests: string[];
    activityLevel: 'low' | 'medium' | 'high';
  };
  aiScore: number;
  lastUpdated: string;
}

interface PersonalizationRule {
  id: string;
  name: string;
  description: string;
  type: 'content' | 'layout' | 'recommendation' | 'notification';
  conditions: {
    userSegment: string;
    behavior: string;
    time: string;
    location: string;
  };
  actions: {
    type: string;
    value: any;
    priority: number;
  }[];
  effectiveness: number;
  lastApplied: string;
  status: 'active' | 'testing' | 'deprecated';
}

interface ContentRecommendation {
  id: string;
  type: 'church' | 'event' | 'content' | 'service';
  title: string;
  description: string;
  relevance: number;
  reason: string;
  userSegment: string;
  personalizationFactors: string[];
  aiConfidence: number;
}

interface PersonalizationProps {
  userType: 'church' | 'user';
  onProfileUpdate?: (profile: UserProfile) => void;
}

export function DeepPersonalization({ userType, onProfileUpdate }: PersonalizationProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [personalizationRules, setPersonalizationRules] = useState<PersonalizationRule[]>([]);
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [selectedRule, setSelectedRule] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Perfil do usuário mockado
  useEffect(() => {
    const mockProfile: UserProfile = {
      id: 'user-001',
      name: 'João Silva',
      preferences: {
        denominations: ['Batista', 'Assembleia de Deus', 'Católica'],
        preferredServices: ['Culto', 'Estudo Bíblico', 'Oração'],
        preferredTimes: ['19:00', '20:00', '18:00'],
        maxDistance: 15,
        minRating: 4.0,
        verifiedOnly: true,
        premiumOnly: false
      },
      behavior: {
        searchPatterns: ['igrejas próximas', 'cultos domingo', 'estudo bíblico'],
        clickPatterns: ['ver detalhes', 'ver mapa', 'ver agenda'],
        timeSpent: {
          'mapa': 45,
          'agenda': 30,
          'transmissoes': 60,
          'doacoes': 15
        },
        interactions: {
          'favoritar': 12,
          'compartilhar': 5,
          'avaliar': 8,
          'comentar': 3
        }
      },
      demographics: {
        age: 35,
        location: 'São Paulo, SP',
        interests: ['teologia', 'família', 'comunidade', 'crescimento espiritual'],
        activityLevel: 'high'
      },
      aiScore: 87,
      lastUpdated: new Date().toISOString()
    };

    setUserProfile(mockProfile);
  }, []);

  // Regras de personalização mockadas
  useEffect(() => {
    const mockRules: PersonalizationRule[] = [
      {
        id: 'rule-1',
        name: 'Priorizar Igrejas Verificadas',
        description: 'Usuários que preferem igrejas verificadas recebem boost no ranking',
        type: 'recommendation',
        conditions: {
          userSegment: 'verified_preferrer',
          behavior: 'clicks_on_verified',
          time: 'any',
          location: 'any'
        },
        actions: [
          {
            type: 'boost_score',
            value: 0.3,
            priority: 1
          }
        ],
        effectiveness: 0.89,
        lastApplied: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'rule-2',
        name: 'Layout Adaptativo por Dispositivo',
        description: 'Adaptar interface baseado no dispositivo e padrões de uso',
        type: 'layout',
        conditions: {
          userSegment: 'mobile_user',
          behavior: 'long_session_time',
          time: 'evening',
          location: 'any'
        },
        actions: [
          {
            type: 'simplify_interface',
            value: true,
            priority: 2
          },
          {
            type: 'increase_font_size',
            value: 1.2,
            priority: 1
          }
        ],
        effectiveness: 0.76,
        lastApplied: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: 'rule-3',
        name: 'Notificações Contextuais',
        description: 'Enviar notificações baseadas no comportamento e localização',
        type: 'notification',
        conditions: {
          userSegment: 'active_user',
          behavior: 'location_based_search',
          time: 'weekend',
          location: 'home_area'
        },
        actions: [
          {
            type: 'send_event_reminder',
            value: 'nearby_events',
            priority: 1
          }
        ],
        effectiveness: 0.82,
        lastApplied: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'active'
      }
    ];

    setPersonalizationRules(mockRules);
  }, []);

  // Recomendações personalizadas mockadas
  useEffect(() => {
    const mockRecommendations: ContentRecommendation[] = [
      {
        id: 'rec-1',
        type: 'church',
        title: 'Igreja Batista Central',
        description: 'Igreja verificada com cultos aos domingos às 19:00',
        relevance: 94,
        reason: 'Combina com suas preferências de denominação e horário',
        userSegment: 'verified_preferrer',
        personalizationFactors: ['denominação preferida', 'horário ideal', 'verificada'],
        aiConfidence: 0.89
      },
      {
        id: 'rec-2',
        type: 'event',
        title: 'Estudo Bíblico - Jovens',
        description: 'Evento semanal para jovens com foco em crescimento espiritual',
        relevance: 87,
        reason: 'Alinhado com seus interesses e padrão de participação',
        userSegment: 'active_user',
        personalizationFactors: ['interesse em crescimento', 'atividade alta', 'horário compatível'],
        aiConfidence: 0.82
      },
      {
        id: 'rec-3',
        type: 'content',
        title: 'Devocional Matinal',
        description: 'Reflexões bíblicas para começar o dia',
        relevance: 79,
        reason: 'Baseado no seu padrão de uso matinal',
        userSegment: 'morning_user',
        personalizationFactors: ['uso matinal', 'interesse em devocionais', 'preferência por conteúdo'],
        aiConfidence: 0.76
      }
    ];

    setRecommendations(mockRecommendations);
  }, []);

  const analyzeUserBehavior = async () => {
    if (!userProfile) return;

    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Etapa 1: Análise de padrões de navegação
    setAnalysisStep(1);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Etapa 2: Análise de preferências implícitas
    setAnalysisStep(2);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Etapa 3: Segmentação do usuário
    setAnalysisStep(3);
    await new Promise(resolve => setTimeout(resolve, 600));

    // Etapa 4: Geração de regras personalizadas
    setAnalysisStep(4);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Etapa 5: Aplicação de personalizações
    setAnalysisStep(5);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Atualizar perfil com novos insights
    const updatedProfile: UserProfile = {
      ...userProfile,
      aiScore: Math.min(userProfile.aiScore + Math.floor(Math.random() * 5), 100),
      lastUpdated: new Date().toISOString()
    };

    setUserProfile(updatedProfile);
    
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }

    setIsAnalyzing(false);
    setAnalysisStep(0);
  };

  const trainPersonalizationModel = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simular treinamento do modelo de personalização
    for (let i = 0; i <= 100; i += 5) {
      setTrainingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsTraining(false);
    setTrainingProgress(0);
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const filteredRules = personalizationRules.filter(rule => {
    if (selectedRule !== 'all' && rule.type !== selectedRule) return false;
    if (selectedType !== 'all' && rule.status !== selectedType) return false;
    return true;
  });

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" />
          <p>Carregando perfil de personalização...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Personalização Profunda com IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema inteligente que adapta a experiência baseado no comportamento e preferências do usuário
          </p>
        </CardContent>
      </Card>

      {/* Perfil do Usuário */}
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Personalização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userProfile.aiScore}%</div>
                <div className="text-sm text-muted-foreground">Score de IA</div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Informações Demográficas</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Idade:</span>
                    <span>{userProfile.demographics.age} anos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Localização:</span>
                    <span>{userProfile.demographics.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nível de Atividade:</span>
                    <Badge variant="outline">
                      {userProfile.demographics.activityLevel === 'high' ? 'Alto' :
                       userProfile.demographics.activityLevel === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferências */}
            <div className="space-y-4">
              <h4 className="font-medium">Preferências</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Denominações:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.preferences.denominations.map((denom, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {denom}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Serviços Preferidos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.preferences.preferredServices.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Horários:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userProfile.preferences.preferredTimes.map((time, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comportamento */}
            <div className="space-y-4">
              <h4 className="font-medium">Análise de Comportamento</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Tempo por Seção:</span>
                  <div className="space-y-2">
                    {Object.entries(userProfile.behavior.timeSpent).map(([section, time]) => (
                      <div key={section} className="flex justify-between text-sm">
                        <span className="capitalize">{section}:</span>
                        <span>{time} min</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Interações:</span>
                  <div className="space-y-2">
                    {Object.entries(userProfile.behavior.interactions).map(([action, count]) => (
                      <div key={action} className="flex justify-between text-sm">
                        <span className="capitalize">{action}:</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Controles de Personalização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={analyzeUserBehavior} 
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando Comportamento...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Analisar Comportamento do Usuário
                </>
              )}
            </Button>

            <Button 
              onClick={trainPersonalizationModel} 
              disabled={isTraining}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isTraining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Treinando Modelo...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Treinar Modelo de Personalização
                </>
              )}
            </Button>
          </div>

          {(isAnalyzing || isTraining) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {isAnalyzing && 'Analisando padrões de comportamento...'}
                  {isTraining && 'Treinando modelo com novos dados...'}
                </span>
                <span>
                  {isAnalyzing ? `${analysisStep}/5` : `${trainingProgress}%`}
                </span>
              </div>
              <Progress value={isAnalyzing ? (analysisStep / 5) * 100 : trainingProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Regras de Personalização */}
      <Card>
        <CardHeader>
          <CardTitle>Regras de Personalização Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex space-x-4 mb-4">
            <select
              value={selectedRule}
              onChange={(e) => setSelectedRule(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">Todos os Tipos</option>
              <option value="content">Conteúdo</option>
              <option value="layout">Layout</option>
              <option value="recommendation">Recomendação</option>
              <option value="notification">Notificação</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="testing">Testando</option>
              <option value="deprecated">Depreciado</option>
            </select>
          </div>

          {/* Lista de Regras */}
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{rule.type}</Badge>
                    <Badge className={getEffectivenessColor(rule.effectiveness)}>
                      {Math.round(rule.effectiveness * 100)}% eficaz
                    </Badge>
                    <Badge 
                      variant={rule.status === 'active' ? 'default' : 'secondary'}
                      className={rule.status === 'testing' ? 'bg-yellow-100 text-yellow-800' : ''}
                    >
                      {rule.status === 'active' ? 'Ativo' : 
                       rule.status === 'testing' ? 'Testando' : 'Depreciado'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h5 className="font-medium mb-2">Condições:</h5>
                    <div className="space-y-1 text-sm">
                      <div><span className="font-medium">Segmento:</span> {rule.conditions.userSegment}</div>
                      <div><span className="font-medium">Comportamento:</span> {rule.conditions.behavior}</div>
                      <div><span className="font-medium">Tempo:</span> {rule.conditions.time}</div>
                      <div><span className="font-medium">Localização:</span> {rule.conditions.location}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Ações:</h5>
                    <div className="space-y-1">
                      {rule.actions.map((action, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {action.type}: {action.value} (prioridade: {action.priority})
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Última aplicação: {new Date(rule.lastApplied).toLocaleString('pt-BR')}</span>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações Personalizadas */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">{rec.type}</Badge>
                    <Badge className={getRelevanceColor(rec.relevance)}>
                      {rec.relevance}% relevante
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(rec.aiConfidence * 100)}% confiança
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Motivo da Recomendação:</span>
                    <p className="text-sm mt-1">{rec.reason}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Segmento:</span>
                    <Badge variant="outline" className="ml-2">{rec.userSegment}</Badge>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Fatores de Personalização:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.personalizationFactors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}