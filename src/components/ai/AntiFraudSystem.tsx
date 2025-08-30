import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Lock,
  Loader2,
  Zap,
  Target,
  Filter,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Star,
  Activity,
  AlertCircle,
  UserCheck,
  CreditCard,
  DollarSign,
  Flag
} from 'lucide-react';

interface FraudAlert {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'donation' | 'login' | 'profile' | 'transaction' | 'behavior';
  description: string;
  riskScore: number;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  entity: {
    id: string;
    name: string;
    type: 'user' | 'church' | 'donor';
    location?: string;
  };
  evidence: {
    patterns: string[];
    anomalies: string[];
    riskFactors: string[];
  };
  actions: {
    taken: string[];
    recommended: string[];
  };
}

interface FraudPattern {
  id: string;
  name: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  lastDetected: string;
  occurrences: number;
  mitigation: string;
}

interface RiskProfile {
  entityId: string;
  entityName: string;
  entityType: 'user' | 'church' | 'donor';
  overallRisk: number;
  riskFactors: {
    factor: string;
    score: number;
    weight: number;
  }[];
  behaviorScore: number;
  transactionScore: number;
  locationScore: number;
  deviceScore: number;
  lastUpdated: string;
}

interface AntiFraudProps {
  userType: 'church' | 'user' | 'admin';
  onAlertCreated?: (alert: FraudAlert) => void;
}

export function AntiFraudSystem({ userType, onAlertCreated }: AntiFraudProps) {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [patterns, setPatterns] = useState<FraudPattern[]>([]);
  const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Padrões de fraude mockados
  useEffect(() => {
    const mockPatterns: FraudPattern[] = [
      {
        id: 'pattern-1',
        name: 'Múltiplas Doações Pequenas',
        description: 'Usuário faz várias doações pequenas em sequência para evitar limites',
        riskLevel: 'medium',
        confidence: 0.87,
        lastDetected: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        occurrences: 23,
        mitigation: 'Implementar cooldown entre doações e análise de padrões temporais'
      },
      {
        id: 'pattern-2',
        name: 'Login de Localizações Incomuns',
        description: 'Acesso de localizações geograficamente distantes em curto período',
        riskLevel: 'high',
        confidence: 0.92,
        lastDetected: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        occurrences: 15,
        mitigation: 'Verificação de dois fatores e alertas de localização'
      },
      {
        id: 'pattern-3',
        name: 'Perfis Falsos',
        description: 'Criação de múltiplos perfis com informações similares',
        riskLevel: 'high',
        confidence: 0.89,
        lastDetected: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        occurrences: 8,
        mitigation: 'Verificação de documentos e análise de similaridade de dados'
      },
      {
        id: 'pattern-4',
        name: 'Comportamento Anômalo',
        description: 'Padrões de navegação e interação inconsistentes com histórico',
        riskLevel: 'medium',
        confidence: 0.78,
        lastDetected: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        occurrences: 34,
        mitigation: 'Análise contínua de comportamento e alertas adaptativos'
      }
    ];

    const mockRiskProfiles: RiskProfile[] = [
      {
        entityId: 'user-001',
        entityName: 'João Silva',
        entityType: 'user',
        overallRisk: 23,
        riskFactors: [
          { factor: 'Localização incomum', score: 45, weight: 0.3 },
          { factor: 'Padrão de doações', score: 15, weight: 0.2 },
          { factor: 'Comportamento online', score: 30, weight: 0.5 }
        ],
        behaviorScore: 30,
        transactionScore: 15,
        locationScore: 45,
        deviceScore: 20,
        lastUpdated: new Date().toISOString()
      },
      {
        entityId: 'church-001',
        entityName: 'Igreja Batista Central',
        entityType: 'church',
        overallRisk: 8,
        riskFactors: [
          { factor: 'Verificação KYC', score: 5, weight: 0.4 },
          { factor: 'Histórico de transações', score: 10, weight: 0.3 },
          { factor: 'Localização', score: 15, weight: 0.3 }
        ],
        behaviorScore: 10,
        transactionScore: 5,
        locationScore: 15,
        deviceScore: 5,
        lastUpdated: new Date().toISOString()
      }
    ];

    setPatterns(mockPatterns);
    setRiskProfiles(mockRiskProfiles);
  }, []);

  // Alertas de fraude mockados
  useEffect(() => {
    const mockAlerts: FraudAlert[] = [
      {
        id: 'alert-1',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        severity: 'high',
        type: 'donation',
        description: 'Múltiplas doações pequenas detectadas em sequência',
        riskScore: 78,
        status: 'investigating',
        entity: {
          id: 'user-001',
          name: 'João Silva',
          type: 'user',
          location: 'São Paulo, SP'
        },
        evidence: {
          patterns: ['Múltiplas Doações Pequenas'],
          anomalies: ['5 doações em 10 minutos', 'Valores sempre abaixo de R$ 10'],
          riskFactors: ['Padrão suspeito', 'Frequência anômala']
        },
        actions: {
          taken: ['Bloqueio temporário de doações', 'Notificação enviada'],
          recommended: ['Verificação de identidade', 'Análise manual']
        }
      },
      {
        id: 'alert-2',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        severity: 'medium',
        type: 'login',
        description: 'Login de localização geograficamente distante',
        riskScore: 65,
        status: 'open',
        entity: {
          id: 'user-002',
          name: 'Maria Santos',
          type: 'user',
          location: 'Rio de Janeiro, RJ'
        },
        evidence: {
          patterns: ['Login de Localizações Incomuns'],
          anomalies: ['Login de SP às 14:00, RJ às 14:30'],
          riskFactors: ['Movimento impossível', 'Tempo insuficiente']
        },
        actions: {
          taken: ['Verificação de dois fatores solicitada'],
          recommended: ['Bloqueio de conta', 'Contato com usuário']
        }
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Flag className="w-4 h-4" />;
      case 'low': return <Eye className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'false_positive': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (score >= 60) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const getRiskText = (score: number) => {
    if (score >= 80) return 'Crítico';
    if (score >= 60) return 'Alto';
    if (score >= 40) return 'Médio';
    return 'Baixo';
  };

  const runFraudScan = async () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simular varredura antifraude
    for (let i = 0; i <= 100; i += 10) {
      setScanProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Simular criação de novo alerta
    const newAlert: FraudAlert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      type: ['donation', 'login', 'profile', 'transaction', 'behavior'][Math.floor(Math.random() * 5)] as any,
      description: 'Atividade suspeita detectada durante varredura automática',
      riskScore: Math.floor(Math.random() * 60) + 20,
      status: 'open',
      entity: {
        id: 'user-003',
        name: 'Usuário Teste',
        type: 'user',
        location: 'Brasília, DF'
      },
      evidence: {
        patterns: ['Comportamento Anômalo'],
        anomalies: ['Navegação irregular detectada'],
        riskFactors: ['Padrão suspeito']
      },
      actions: {
        taken: ['Alerta criado automaticamente'],
        recommended: ['Análise manual recomendada']
      }
    };

    setAlerts(prev => [newAlert, ...prev]);
    
    if (onAlertCreated) {
      onAlertCreated(newAlert);
    }

    setIsScanning(false);
    setScanProgress(0);
  };

  const trainModel = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Simular treinamento do modelo
    for (let i = 0; i <= 100; i += 5) {
      setTrainingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsTraining(false);
    setTrainingProgress(0);
  };

  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && alert.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Sistema Antifraude Inteligente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detecção avançada de fraudes usando IA para proteger doações e transações
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'open' || a.status === 'investigating').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Fraudes Prevenidas</p>
                <p className="text-2xl font-bold">127</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Precisão</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Modelo Atual</p>
                <p className="text-2xl font-bold">v2.1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Controles do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={runFraudScan} 
              disabled={isScanning}
              className="w-full"
              size="lg"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Varredura em Andamento...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Executar Varredura Antifraude
                </>
              )}
            </Button>

            <Button 
              onClick={trainModel} 
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
                  <Target className="w-4 h-4 mr-2" />
                  Treinar Modelo IA
                </>
              )}
            </Button>
          </div>

          {(isScanning || isTraining) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {isScanning && 'Executando varredura antifraude...'}
                  {isTraining && 'Treinando modelo com novos dados...'}
                </span>
                <span>
                  {isScanning ? `${scanProgress}%` : `${trainingProgress}%`}
                </span>
              </div>
              <Progress value={isScanning ? scanProgress : trainingProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Padrões de Fraude */}
      <Card>
        <CardHeader>
          <CardTitle>Padrões de Fraude Detectados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{pattern.name}</h4>
                    <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(pattern.confidence * 100)}>
                      {pattern.riskLevel.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(pattern.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Ocorrências:</span>
                    <span className="ml-2">{pattern.occurrences}</span>
                  </div>
                  <div>
                    <span className="font-medium">Última Detecção:</span>
                    <span className="ml-2">{new Date(pattern.lastDetected).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Mitigação:</span>
                    <span className="ml-2">{pattern.mitigation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Perfis de Risco */}
      <Card>
        <CardHeader>
          <CardTitle>Perfis de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskProfiles.map((profile) => (
              <div key={profile.entityId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{profile.entityName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.entityType === 'user' ? 'Usuário' : 
                       profile.entityType === 'church' ? 'Igreja' : 'Doador'}
                    </p>
                  </div>
                  <Badge className={getRiskColor(profile.overallRisk)}>
                    {getRiskText(profile.overallRisk)} ({profile.overallRisk})
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-sm font-medium">Comportamento</div>
                    <div className="text-lg font-bold">{profile.behaviorScore}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-sm font-medium">Transações</div>
                    <div className="text-lg font-bold">{profile.transactionScore}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-sm font-medium">Localização</div>
                    <div className="text-lg font-bold">{profile.locationScore}</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-sm font-medium">Dispositivo</div>
                    <div className="text-lg font-bold">{profile.deviceScore}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium">Fatores de Risco:</h5>
                  <div className="flex flex-wrap gap-2">
                    {profile.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor.factor}: {factor.score} (peso: {factor.weight})
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Fraude */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Fraude</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex space-x-4 mb-4">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">Todas Severidades</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">Todos os Tipos</option>
              <option value="donation">Doação</option>
              <option value="login">Login</option>
              <option value="profile">Perfil</option>
              <option value="transaction">Transação</option>
              <option value="behavior">Comportamento</option>
            </select>
          </div>

          {/* Lista de Alertas */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{alert.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        {alert.entity.name} • {alert.entity.type} • {alert.entity.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(alert.riskScore)}>
                      {alert.riskScore}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status === 'open' ? 'Aberto' :
                       alert.status === 'investigating' ? 'Investigando' :
                       alert.status === 'resolved' ? 'Resolvido' : 'Falso Positivo'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <h5 className="font-medium mb-2">Evidências:</h5>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Padrões:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.evidence.patterns.map((pattern, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {pattern}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Anomalias:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.evidence.anomalies.map((anomaly, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {anomaly}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Ações:</h5>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Tomadas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.actions.taken.map((action, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Recomendadas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {alert.actions.recommended.map((action, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Detectado em: {new Date(alert.timestamp).toLocaleString('pt-BR')}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marcar Resolvido
                    </Button>
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