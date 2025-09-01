import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  Loader2,
  Zap,
  Filter,
  Settings,
  Users,
  MapPin,
  Clock,
  Star,
  Brain,
  Shield,
  Crown,
  Activity,
  RefreshCw,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  version: string;
  type: 'nlp' | 'vision' | 'recommendation' | 'fraud' | 'personalization';
  status: 'active' | 'training' | 'evaluating' | 'deprecated';
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    latency: number;
  };
  training: {
    lastTrained: string;
    trainingDataSize: number;
    epochs: number;
    learningRate: number;
    batchSize: number;
  };
  evaluation: {
    lastEvaluated: string;
    testDataSize: number;
    driftScore: number;
    performanceTrend: 'improving' | 'stable' | 'declining';
    alerts: string[];
  };
  metrics: {
    totalPredictions: number;
    correctPredictions: number;
    falsePositives: number;
    falseNegatives: number;
    averageConfidence: number;
  };
}

interface ModelDrift {
  id: string;
  modelId: string;
  modelName: string;
  timestamp: string;
  driftType: 'data' | 'concept' | 'label';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metrics: {
    beforeDrift: number;
    afterDrift: number;
    change: number;
  };
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  actions: string[];
}

interface TrainingJob {
  id: string;
  modelId: string;
  modelName: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedCompletion: string;
  metrics: {
    currentEpoch: number;
    totalEpochs: number;
    currentLoss: number;
    validationAccuracy: number;
  };
  resources: {
    gpu: string;
    memory: string;
    cpu: string;
  };
}

interface ContinuousEvaluationProps {
  userType: 'church' | 'user' | 'admin';
  onModelUpdate?: (model: AIModel) => void;
}

export function ContinuousEvaluation({ userType, onModelUpdate }: ContinuousEvaluationProps) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [driftAlerts, setDriftAlerts] = useState<ModelDrift[]>([]);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationStep, setEvaluationStep] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modelos de IA mockados
  useEffect(() => {
    const mockModels: AIModel[] = [
      {
        id: 'model-1',
        name: 'FaithVision NLP',
        version: '2.1.0',
        type: 'nlp',
        status: 'active',
        performance: {
          accuracy: 94.2,
          precision: 0.93,
          recall: 0.94,
          f1Score: 0.935,
          latency: 45
        },
        training: {
          lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          trainingDataSize: 125000,
          epochs: 150,
          learningRate: 0.001,
          batchSize: 32
        },
        evaluation: {
          lastEvaluated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          testDataSize: 25000,
          driftScore: 0.12,
          performanceTrend: 'improving',
          alerts: []
        },
        metrics: {
          totalPredictions: 1250000,
          correctPredictions: 1177500,
          falsePositives: 37500,
          falseNegatives: 37500,
          averageConfidence: 0.89
        }
      },
      {
        id: 'model-2',
        name: 'FaithVision Computer Vision',
        version: '1.8.0',
        type: 'vision',
        status: 'evaluating',
        performance: {
          accuracy: 91.7,
          precision: 0.92,
          recall: 0.91,
          f1Score: 0.915,
          latency: 120
        },
        training: {
          lastTrained: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          trainingDataSize: 89000,
          epochs: 200,
          learningRate: 0.0005,
          batchSize: 16
        },
        evaluation: {
          lastEvaluated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          testDataSize: 17800,
          driftScore: 0.23,
          performanceTrend: 'declining',
          alerts: ['Detecção de drift de dados detectada', 'Performance em declínio']
        },
        metrics: {
          totalPredictions: 890000,
          correctPredictions: 816130,
          falsePositives: 35600,
          falseNegatives: 38270,
          averageConfidence: 0.87
        }
      },
      {
        id: 'model-3',
        name: 'FaithVision Recommendation',
        version: '3.0.0',
        type: 'recommendation',
        status: 'training',
        performance: {
          accuracy: 88.9,
          precision: 0.89,
          recall: 0.88,
          f1Score: 0.885,
          latency: 25
        },
        training: {
          lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          trainingDataSize: 250000,
          epochs: 100,
          learningRate: 0.002,
          batchSize: 64
        },
        evaluation: {
          lastEvaluated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          testDataSize: 50000,
          driftScore: 0.08,
          performanceTrend: 'stable',
          alerts: []
        },
        metrics: {
          totalPredictions: 2100000,
          correctPredictions: 1866900,
          falsePositives: 115500,
          falseNegatives: 118600,
          averageConfidence: 0.85
        }
      }
    ];

    setModels(mockModels);
  }, []);

  // Alertas de drift mockados
  useEffect(() => {
    const mockDrifts: ModelDrift[] = [
      {
        id: 'drift-1',
        modelId: 'model-2',
        modelName: 'FaithVision Computer Vision',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        driftType: 'data',
        severity: 'high',
        description: 'Mudança significativa na distribuição de dados de entrada',
        metrics: {
          beforeDrift: 0.89,
          afterDrift: 0.67,
          change: -24.7
        },
        status: 'investigating',
        actions: ['Coletar novos dados de treinamento', 'Reavaliar modelo', 'Considerar retraining']
      },
      {
        id: 'drift-2',
        modelId: 'model-3',
        modelName: 'FaithVision Recommendation',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        driftType: 'concept',
        severity: 'medium',
        description: 'Mudança no comportamento dos usuários afetando recomendações',
        metrics: {
          beforeDrift: 0.92,
          afterDrift: 0.88,
          change: -4.3
        },
        status: 'detected',
        actions: ['Monitorar tendências', 'Ajustar parâmetros', 'Avaliar necessidade de retraining']
      }
    ];

    setDriftAlerts(mockDrifts);
  }, []);

  // Jobs de treinamento mockados
  useEffect(() => {
    const mockJobs: TrainingJob[] = [
      {
        id: 'job-1',
        modelId: 'model-3',
        modelName: 'FaithVision Recommendation',
        status: 'running',
        progress: 65,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
        metrics: {
          currentEpoch: 65,
          totalEpochs: 100,
          currentLoss: 0.0234,
          validationAccuracy: 0.891
        },
        resources: {
          gpu: 'RTX 4090',
          memory: '24GB',
          cpu: 'Intel i9-13900K'
        }
      }
    ];

    setTrainingJobs(mockJobs);
  }, []);

  const runModelEvaluation = async () => {
    setIsEvaluating(true);
    setEvaluationStep(0);

    // Etapa 1: Coleta de dados de teste
    setEvaluationStep(1);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Etapa 2: Execução de inferências
    setEvaluationStep(2);
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Etapa 3: Cálculo de métricas
    setEvaluationStep(3);
    await new Promise(resolve => setTimeout(resolve, 600));

    // Etapa 4: Detecção de drift
    setEvaluationStep(4);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Etapa 5: Geração de relatório
    setEvaluationStep(5);
    await new Promise(resolve => setTimeout(resolve), 500);

    // Simular atualização de modelo
    if (models.length > 0) {
      const updatedModel = { ...models[0] };
      updatedModel.evaluation.lastEvaluated = new Date().toISOString();
      updatedModel.evaluation.driftScore = Math.random() * 0.3;
      updatedModel.evaluation.performanceTrend = ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as any;
      
      setModels(prev => prev.map(m => m.id === updatedModel.id ? updatedModel : m));
      
      if (onModelUpdate) {
        onModelUpdate(updatedModel);
      }
    }

    setIsEvaluating(false);
    setEvaluationStep(0);
  };

  const startTraining = async (modelId: string) => {
    setIsTraining(true);

    // Simular início de treinamento
    const newJob: TrainingJob = {
      id: `job-${Date.now()}`,
      modelId,
      modelName: models.find(m => m.id === modelId)?.name || 'Unknown',
      status: 'running',
      progress: 0,
      startTime: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      metrics: {
        currentEpoch: 0,
        totalEpochs: 100,
        currentLoss: 0.5,
        validationAccuracy: 0.0
      },
      resources: {
        gpu: 'RTX 4090',
        memory: '24GB',
        cpu: 'Intel i9-13900K'
      }
    };

    setTrainingJobs(prev => [...prev, newJob]);

    // Simular progresso do treinamento
    const interval = setInterval(() => {
      setTrainingJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, progress: Math.min(job.progress + 5, 100) }
          : job
      ));
    }, 2000);

    // Parar simulação após 20 segundos
    setTimeout(() => {
      clearInterval(interval);
      setIsTraining(false);
    }, 20000);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getDriftColor = (score: number) => {
    if (score <= 0.1) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score <= 0.2) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (score <= 0.3) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getDriftSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'training': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'evaluating': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'deprecated': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredModels = models.filter(model => {
    if (selectedModel !== 'all' && model.type !== selectedModel) return false;
    if (selectedStatus !== 'all' && model.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Avaliação e Retraining Contínuos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Monitoramento contínuo e melhoria automática dos modelos de IA
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Modelos Ativos</p>
                <p className="text-2xl font-bold">{models.filter(m => m.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Alertas de Drift</p>
                <p className="text-2xl font-bold">{driftAlerts.filter(d => d.status === 'detected' || d.status === 'investigating').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Jobs Ativos</p>
                <p className="text-2xl font-bold">{trainingJobs.filter(j => j.status === 'running').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Performance Média</p>
                <p className="text-2xl font-bold">
                  {models.length > 0 
                    ? Math.round(models.reduce((sum, m) => sum + m.performance.accuracy, 0) / models.length)
                    : 0}%
                </p>
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
              onClick={runModelEvaluation} 
              disabled={isEvaluating}
              className="w-full"
              size="lg"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Avaliando Modelos...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Executar Avaliação de Modelos
                </>
              )}
            </Button>

            <Button 
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar Agendamento
            </Button>
          </div>

          {isEvaluating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {evaluationStep === 1 && 'Coletando dados de teste...'}
                  {evaluationStep === 2 && 'Executando inferências...'}
                  {evaluationStep === 3 && 'Calculando métricas...'}
                  {evaluationStep === 4 && 'Detectando drift...'}
                  {evaluationStep === 5 && 'Gerando relatório...'}
                </span>
                <span>{evaluationStep}/5</span>
              </div>
              <Progress value={(evaluationStep / 5) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modelos de IA */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos de IA</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex space-x-4 mb-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">Todos os Tipos</option>
              <option value="nlp">NLP</option>
              <option value="vision">Visão Computacional</option>
              <option value="recommendation">Recomendação</option>
              <option value="fraud">Antifraude</option>
              <option value="personalization">Personalização</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background text-sm"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="training">Treinando</option>
              <option value="evaluating">Avaliando</option>
              <option value="deprecated">Depreciado</option>
            </select>
          </div>

          {/* Lista de Modelos */}
          <div className="space-y-4">
            {filteredModels.map((model) => (
              <div key={model.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{model.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Versão {model.version} • {model.type.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(model.status)}>
                      {model.status === 'active' ? 'Ativo' :
                       model.status === 'training' ? 'Treinando' :
                       model.status === 'evaluating' ? 'Avaliando' : 'Depreciado'}
                    </Badge>
                    <Badge className={getPerformanceColor(model.performance.accuracy)}>
                      {model.performance.accuracy}% acurácia
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <h5 className="font-medium mb-2">Performance</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Precisão:</span>
                        <span>{(model.performance.precision * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recall:</span>
                        <span>{(model.performance.recall * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>F1-Score:</span>
                        <span>{(model.performance.f1Score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latência:</span>
                        <span>{model.performance.latency}ms</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Treinamento</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Último:</span>
                        <span>{new Date(model.training.lastTrained).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dados:</span>
                        <span>{(model.training.trainingDataSize / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Épocas:</span>
                        <span>{model.training.epochs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LR:</span>
                        <span>{model.training.learningRate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2">Avaliação</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Última:</span>
                        <span>{new Date(model.evaluation.lastEvaluated).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Drift Score:</span>
                        <Badge className={getDriftColor(model.evaluation.driftScore)}>
                          {(model.evaluation.driftScore * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Tendência:</span>
                        <Badge variant="outline">
                          {model.evaluation.performanceTrend === 'improving' ? 'Melhorando' :
                           model.evaluation.performanceTrend === 'stable' ? 'Estável' : 'Declinando'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Teste:</span>
                        <span>{(model.evaluation.testDataSize / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => startTraining(model.id)}
                      disabled={model.status === 'training'}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Retrain
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {model.metrics.totalPredictions.toLocaleString()} predições
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Drift */}
      {driftAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas de Drift de Modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driftAlerts.map((drift) => (
                <div key={drift.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{drift.modelName}</h4>
                      <p className="text-sm text-muted-foreground">{drift.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getDriftSeverityColor(drift.severity)}>
                        {drift.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{drift.driftType}</Badge>
                      <Badge 
                        variant={drift.status === 'resolved' ? 'default' : 'secondary'}
                        className={drift.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' : ''}
                      >
                        {drift.status === 'detected' ? 'Detectado' :
                         drift.status === 'investigating' ? 'Investigando' :
                         drift.status === 'mitigated' ? 'Mitigado' : 'Resolvido'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="font-medium mb-2">Métricas de Drift:</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Antes:</span>
                          <span>{(drift.metrics.beforeDrift * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Depois:</span>
                          <span>{(drift.metrics.afterDrift * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mudança:</span>
                          <span className={drift.metrics.change > 0 ? 'text-red-600' : 'text-green-600'}>
                            {drift.metrics.change > 0 ? '+' : ''}{drift.metrics.change.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Ações Recomendadas:</h5>
                      <div className="space-y-1">
                        {drift.actions.map((action, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Detectado em: {new Date(drift.timestamp).toLocaleString('pt-BR')}</span>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Investigar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs de Treinamento */}
      {trainingJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Jobs de Treinamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingJobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{job.modelName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Job ID: {job.id} • Iniciado: {new Date(job.startTime).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={job.status === 'running' ? 'default' : 'secondary'}
                        className={job.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {job.status === 'queued' ? 'Na Fila' :
                         job.status === 'running' ? 'Executando' :
                         job.status === 'completed' ? 'Concluído' : 'Falhou'}
                      </Badge>
                      <Badge variant="outline">
                        {job.progress}%
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Métricas</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Época:</span>
                            <span>{job.metrics.currentEpoch}/{job.metrics.totalEpochs}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Loss:</span>
                            <span>{job.metrics.currentLoss.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Acurácia:</span>
                            <span>{(job.metrics.validationAccuracy * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Recursos</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>GPU:</span>
                            <span>{job.resources.gpu}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Memória:</span>
                            <span>{job.resources.memory}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>CPU:</span>
                            <span>{job.resources.cpu}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Tempo</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Início:</span>
                            <span>{new Date(job.startTime).toLocaleTimeString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimado:</span>
                            <span>{new Date(job.estimatedCompletion).toLocaleTimeString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Pause className="w-4 h-4 mr-1" />
                        Pausar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Square className="w-4 h-4 mr-1" />
                        Parar
                      </Button>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Logs
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}