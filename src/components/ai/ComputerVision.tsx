import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Camera, 
  Image, 
  Upload, 
  Download, 
  Eye, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
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
  Star
} from 'lucide-react';

interface VisionAnalysis {
  id: string;
  imageUrl: string;
  timestamp: string;
  analysisResults: {
    churchBuilding: boolean;
    crowdEstimate: number;
    eventType: string;
    safetyScore: number;
    accessibilityScore: number;
    maintenanceScore: number;
    tags: string[];
    confidence: number;
  };
  metadata: {
    fileSize: number;
    dimensions: { width: number; height: number };
    format: string;
    processingTime: number;
  };
  aiModel: {
    version: string;
    accuracy: number;
    lastUpdated: string;
  };
}

interface VisionModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  size: number;
  lastUpdated: string;
  status: 'active' | 'training' | 'deprecated';
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
  };
}

interface ComputerVisionProps {
  userType: 'church' | 'user';
  onAnalysisComplete?: (analysis: VisionAnalysis) => void;
}

export function ComputerVision({ userType, onAnalysisComplete }: ComputerVisionProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<VisionAnalysis | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('model-v1');
  const [analysisHistory, setAnalysisHistory] = useState<VisionAnalysis[]>([]);
  const [isModelDownloading, setIsModelDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Modelos de IA disponíveis
  const availableModels: VisionModel[] = [
    {
      id: 'model-v1',
      name: 'FaithVision v1.0',
      version: '1.0.0',
      accuracy: 87.5,
      size: 45.2,
      lastUpdated: '2024-01-15',
      status: 'active',
      performance: { precision: 0.89, recall: 0.86, f1Score: 0.87 }
    },
    {
      id: 'model-v2',
      name: 'FaithVision v2.0',
      version: '2.0.0',
      accuracy: 92.3,
      size: 67.8,
      lastUpdated: '2024-01-20',
      status: 'training',
      performance: { precision: 0.93, recall: 0.91, f1Score: 0.92 }
    },
    {
      id: 'model-lite',
      name: 'FaithVision Lite',
      version: '1.5.0',
      accuracy: 82.1,
      size: 23.4,
      lastUpdated: '2024-01-18',
      status: 'active',
      performance: { precision: 0.84, recall: 0.80, f1Score: 0.82 }
    }
  ];

  // Histórico de análises mockado
  useEffect(() => {
    const mockHistory: VisionAnalysis[] = [
      {
        id: 'analysis-1',
        imageUrl: '/mock-church-1.jpg',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        analysisResults: {
          churchBuilding: true,
          crowdEstimate: 150,
          eventType: 'Culto Dominical',
          safetyScore: 94,
          accessibilityScore: 87,
          maintenanceScore: 91,
          tags: ['igreja', 'culto', 'multidão', 'arquitetura religiosa'],
          confidence: 0.89
        },
        metadata: {
          fileSize: 2048576,
          dimensions: { width: 1920, height: 1080 },
          format: 'JPEG',
          processingTime: 2.3
        },
        aiModel: {
          version: '1.0.0',
          accuracy: 87.5,
          lastUpdated: '2024-01-15'
        }
      },
      {
        id: 'analysis-2',
        imageUrl: '/mock-church-2.jpg',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        analysisResults: {
          churchBuilding: true,
          crowdEstimate: 75,
          eventType: 'Estudo Bíblico',
          safetyScore: 96,
          accessibilityScore: 92,
          maintenanceScore: 88,
          tags: ['igreja', 'estudo', 'pequeno grupo', 'educação'],
          confidence: 0.91
        },
        metadata: {
          fileSize: 1536000,
          dimensions: { width: 1280, height: 720 },
          format: 'JPEG',
          processingTime: 1.8
        },
        aiModel: {
          version: '1.0.0',
          accuracy: 87.5,
          lastUpdated: '2024-01-15'
        }
      }
    ];
    setAnalysisHistory(mockHistory);
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadModel = async (modelId: string) => {
    const model = availableModels.find(m => m.id === modelId);
    if (!model) return;

    setIsModelDownloading(true);
    setDownloadProgress(0);

    // Simular download do modelo
    for (let i = 0; i <= 100; i += 10) {
      setDownloadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsModelDownloading(false);
    setDownloadProgress(0);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Etapa 1: Preparação da imagem
    setAnalysisStep(1);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Etapa 2: Carregamento do modelo
    setAnalysisStep(2);
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Etapa 3: Análise de objetos
    setAnalysisStep(3);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Etapa 4: Classificação de cena
    setAnalysisStep(4);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Etapa 5: Geração de resultados
    setAnalysisStep(5);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Criar resultados da análise
    const analysis: VisionAnalysis = {
      id: `analysis-${Date.now()}`,
      imageUrl: imagePreview,
      timestamp: new Date().toISOString(),
      analysisResults: {
        churchBuilding: Math.random() > 0.3,
        crowdEstimate: Math.floor(Math.random() * 200) + 50,
        eventType: ['Culto Dominical', 'Estudo Bíblico', 'Reunião de Jovens', 'Evento Especial'][Math.floor(Math.random() * 4)],
        safetyScore: Math.floor(Math.random() * 20) + 80,
        accessibilityScore: Math.floor(Math.random() * 20) + 80,
        maintenanceScore: Math.floor(Math.random() * 20) + 80,
        tags: ['igreja', 'evento', 'comunidade', 'fé'],
        confidence: Math.random() * 0.3 + 0.7
      },
      metadata: {
        fileSize: selectedImage.size,
        dimensions: { width: 1920, height: 1080 },
        format: selectedImage.type.split('/')[1].toUpperCase(),
        processingTime: 5.3
      },
      aiModel: {
        version: '1.0.0',
        accuracy: 87.5,
        lastUpdated: '2024-01-15'
      }
    };

    setAnalysisResults(analysis);
    setAnalysisHistory(prev => [analysis, ...prev]);
    
    if (onAnalysisComplete) {
      onAnalysisComplete(analysis);
    }

    setIsAnalyzing(false);
    setAnalysisStep(0);
  };

  const getSafetyColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getSafetyText = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 80) return 'Bom';
    return 'Atenção';
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Visão Computacional On-Device</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Análise inteligente de imagens usando IA local para identificar igrejas, eventos e avaliar segurança
          </p>
        </CardContent>
      </Card>

      {/* Seleção de Modelo */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos de IA Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableModels.map((model) => (
              <div key={model.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">{model.name}</h4>
                  <Badge 
                    variant={model.status === 'active' ? 'default' : 'secondary'}
                    className={model.status === 'training' ? 'bg-yellow-100 text-yellow-800' : ''}
                  >
                    {model.status === 'active' ? 'Ativo' : 
                     model.status === 'training' ? 'Treinando' : 'Depreciado'}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Versão:</span>
                    <span className="font-medium">{model.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acurácia:</span>
                    <span className="font-medium">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamanho:</span>
                    <span className="font-medium">{model.size} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>F1-Score:</span>
                    <span className="font-medium">{model.performance.f1Score.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedModel(model.id)}
                    variant={selectedModel === model.id ? 'default' : 'outline'}
                  >
                    {selectedModel === model.id ? 'Selecionado' : 'Selecionar'}
                  </Button>
                  
                  {model.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => downloadModel(model.id)}
                      disabled={isModelDownloading}
                    >
                      {isModelDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Baixando...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Modelo
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {isModelDownloading && selectedModel === model.id && (
                  <div className="mt-3">
                    <Progress value={downloadProgress} className="h-2" />
                    <p className="text-xs text-center mt-1">{downloadProgress}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload e Análise de Imagem */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Imagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-64 object-cover rounded-lg mx-auto"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview('');
                      }}
                    >
                      Remover Imagem
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clique para selecionar ou arraste uma imagem
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        PNG, JPG até 10MB
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      Selecionar Imagem
                    </Button>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Controles */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Configurações de Análise</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Detecção de Objetos</span>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Análise de Segurança</span>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Estimativa de Multidão</span>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Classificação de Cena</span>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                </div>
              </div>

              <Button
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analisar Imagem
                  </>
                )}
              </Button>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {analysisStep === 1 && 'Preparando imagem...'}
                      {analysisStep === 2 && 'Carregando modelo...'}
                      {analysisStep === 3 && 'Analisando objetos...'}
                      {analysisStep === 4 && 'Classificando cena...'}
                      {analysisStep === 5 && 'Gerando resultados...'}
                    </span>
                    <span>{analysisStep}/5</span>
                  </div>
                  <Progress value={(analysisStep / 5) * 100} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Análise */}
      {analysisResults && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Imagem Analisada */}
              <div>
                <h4 className="font-medium mb-3">Imagem Analisada</h4>
                <img 
                  src={analysisResults.imageUrl} 
                  alt="Analisada" 
                  className="w-full rounded-lg"
                />
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tamanho:</span>
                    <span>{(analysisResults.metadata.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensões:</span>
                    <span>{analysisResults.metadata.dimensions.width}x{analysisResults.metadata.dimensions.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Formato:</span>
                    <span>{analysisResults.metadata.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tempo de Processamento:</span>
                    <span>{analysisResults.metadata.processingTime}s</span>
                  </div>
                </div>
              </div>

              {/* Resultados */}
              <div className="space-y-4">
                <h4 className="font-medium">Análise de IA</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(analysisResults.analysisResults.confidence * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Confiança</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analysisResults.analysisResults.crowdEstimate}
                    </div>
                    <div className="text-sm text-muted-foreground">Estimativa de Pessoas</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tipo de Edifício:</span>
                    <Badge variant={analysisResults.analysisResults.churchBuilding ? 'default' : 'secondary'}>
                      {analysisResults.analysisResults.churchBuilding ? 'Igreja' : 'Outro'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tipo de Evento:</span>
                    <Badge variant="outline">{analysisResults.analysisResults.eventType}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score de Segurança:</span>
                    <Badge className={getSafetyColor(analysisResults.analysisResults.safetyScore)}>
                      {getSafetyText(analysisResults.analysisResults.safetyScore)} ({analysisResults.analysisResults.safetyScore})
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Acessibilidade:</span>
                    <Badge variant="outline">{analysisResults.analysisResults.accessibilityScore}/100</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Manutenção:</span>
                    <Badge variant="outline">{analysisResults.analysisResults.maintenanceScore}/100</Badge>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Tags Identificadas:</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.analysisResults.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Análises */}
      {analysisHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Análises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisHistory.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <img 
                    src={analysis.imageUrl} 
                    alt="Histórico" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">
                        {analysis.analysisResults.eventType}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(analysis.analysisResults.confidence * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-x-4">
                      <span>{analysis.analysisResults.crowdEstimate} pessoas</span>
                      <span>Segurança: {analysis.analysisResults.safetyScore}/100</span>
                      <span>{new Date(analysis.timestamp).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}