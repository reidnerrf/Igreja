import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Brain, 
  Clock, 
  Church, 
  Calendar, 
  Search, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface NLPResult {
  denomination: string;
  confidence: number;
  alternatives: string[];
  extractedTimes: string[];
  extractedDates: string[];
  services: Array<{
    day: string;
    time: string;
    type: string;
    confidence: number;
  }>;
  rawText: string;
  processedAt: string;
}

interface NLPProcessorProps {
  onResult?: (result: NLPResult) => void;
  mode: 'denomination' | 'schedule' | 'both';
}

export function NLPProcessor({ onResult, mode }: NLPProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<NLPResult | null>(null);
  const [processingStep, setProcessingStep] = useState(0);

  // Dados de treinamento para denominações
  const denominationPatterns = {
    'Batista': [
      'batista', 'batistas', 'convenção batista', 'igreja batista',
      'primeira igreja batista', 'segunda igreja batista'
    ],
    'Assembleia de Deus': [
      'assembleia de deus', 'assembleia', 'assembleias', 'ad',
      'igreja assembleia', 'primeira assembleia'
    ],
    'Católica': [
      'católica', 'católico', 'catolicismo', 'igreja católica',
      'paróquia', 'diocese', 'arquidiocese'
    ],
    'Presbiteriana': [
      'presbiteriana', 'presbiteriano', 'igreja presbiteriana',
      'ipb', 'primeira igreja presbiteriana'
    ],
    'Metodista': [
      'metodista', 'metodismo', 'igreja metodista',
      'primeira igreja metodista'
    ],
    'Luterana': [
      'luterana', 'luterano', 'igreja luterana',
      'ielb', 'primeira igreja luterana'
    ],
    'Evangélica': [
      'evangélica', 'evangélico', 'igreja evangélica',
      'comunidade evangélica'
    ],
    'Pentecostal': [
      'pentecostal', 'igreja pentecostal', 'renovação carismática'
    ]
  };

  // Padrões de horários
  const timePatterns = [
    /(\d{1,2}):(\d{2})\s*(h|hr|hora|horas)?/gi,
    /(\d{1,2})h(\d{2})?/gi,
    /(\d{1,2})\s*(h|hr|hora|horas)\s*(\d{2})?/gi,
    /às\s*(\d{1,2}):(\d{2})/gi,
    /(\d{1,2}):(\d{2})\s*(am|pm)/gi
  ];

  // Padrões de dias da semana
  const dayPatterns = {
    'Domingo': ['domingo', 'dom', 'domingos'],
    'Segunda-feira': ['segunda', 'segunda-feira', 'seg', 'segundas'],
    'Terça-feira': ['terça', 'terça-feira', 'ter', 'terças'],
    'Quarta-feira': ['quarta', 'quarta-feira', 'qua', 'quartas'],
    'Quinta-feira': ['quinta', 'quinta-feira', 'qui', 'quintas'],
    'Sexta-feira': ['sexta', 'sexta-feira', 'sex', 'sextas'],
    'Sábado': ['sábado', 'sab', 'sábados']
  };

  // Padrões de tipos de serviço
  const serviceTypePatterns = {
    'Culto': ['culto', 'missa', 'celebração', 'adoração'],
    'Estudo Bíblico': ['estudo', 'estudo bíblico', 'escola bíblica', 'ebd'],
    'Oração': ['oração', 'orações', 'intercessão', 'vigília'],
    'Jovens': ['jovens', 'juventude', 'encontro de jovens'],
    'Crianças': ['crianças', 'infantil', 'escola dominical'],
    'Mulheres': ['mulheres', 'sociedade feminina', 'encontro de mulheres'],
    'Homens': ['homens', 'sociedade masculina', 'encontro de homens'],
    'Casais': ['casais', 'encontro de casais', 'família']
  };

  const processNLP = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setProcessingStep(0);

    // Simular processamento em etapas
    const steps = [
      'Analisando texto...',
      'Identificando denominação...',
      'Extraindo horários...',
      'Processando serviços...',
      'Finalizando análise...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Processar NLP
    const nlpResult = await performNLPAnalysis(inputText);
    
    setResult(nlpResult);
    setIsProcessing(false);
    setProcessingStep(0);
    
    if (onResult) {
      onResult(nlpResult);
    }
  };

  const performNLPAnalysis = async (text: string): Promise<NLPResult> => {
    const lowerText = text.toLowerCase();
    
    // 1. Identificar denominação
    let bestDenomination = 'Não identificada';
    let bestConfidence = 0;
    const alternatives: string[] = [];

    for (const [denomination, patterns] of Object.entries(denominationPatterns)) {
      let matchCount = 0;
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          matchCount++;
        }
      }
      
      if (matchCount > 0) {
        const confidence = Math.min((matchCount / patterns.length) * 100, 100);
        if (confidence > bestConfidence) {
          bestConfidence = confidence;
          bestDenomination = denomination;
        }
        alternatives.push(denomination);
      }
    }

    // 2. Extrair horários
    const extractedTimes: string[] = [];
    for (const pattern of timePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        extractedTimes.push(...matches);
      }
    }

    // 3. Extrair datas
    const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})|(\d{1,2})-(\d{1,2})-(\d{4})/g;
    const extractedDates = text.match(datePattern) || [];

    // 4. Identificar serviços
    const services: Array<{
      day: string;
      time: string;
      type: string;
      confidence: number;
    }> = [];

    // Análise de contexto para serviços
    const lines = text.split('\n');
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Identificar dia
      let identifiedDay = '';
      for (const [day, patterns] of Object.entries(dayPatterns)) {
        if (patterns.some(pattern => lowerLine.includes(pattern))) {
          identifiedDay = day;
          break;
        }
      }

      // Identificar tipo de serviço
      let identifiedType = '';
      let typeConfidence = 0;
      for (const [type, patterns] of Object.entries(serviceTypePatterns)) {
        const matchCount = patterns.filter(pattern => lowerLine.includes(pattern)).length;
        if (matchCount > 0) {
          const confidence = (matchCount / patterns.length) * 100;
          if (confidence > typeConfidence) {
            typeConfidence = confidence;
            identifiedType = type;
          }
        }
      }

      // Extrair horário da linha
      let lineTime = '';
      for (const pattern of timePatterns) {
        const match = line.match(pattern);
        if (match) {
          lineTime = match[0];
          break;
        }
      }

      if (identifiedDay || identifiedType || lineTime) {
        services.push({
          day: identifiedDay,
          time: lineTime,
          type: identifiedType,
          confidence: typeConfidence
        });
      }
    }

    return {
      denomination: bestDenomination,
      confidence: bestConfidence,
      alternatives: alternatives.slice(0, 3),
      extractedTimes: [...new Set(extractedTimes)],
      extractedDates: [...new Set(extractedDates)],
      services,
      rawText: text,
      processedAt: new Date().toISOString()
    };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'Alta';
    if (confidence >= 60) return 'Média';
    return 'Baixa';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Processamento de Linguagem Natural</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === 'denomination' && 'Descreva a denominação da igreja'}
              {mode === 'schedule' && 'Descreva os horários e serviços'}
              {mode === 'both' && 'Descreva a igreja, denominação e horários'}
            </label>
            <Textarea
              placeholder={
                mode === 'denomination' 
                  ? "Ex: Igreja Batista Central, fundada em 1950, seguindo os princípios batistas..."
                  : mode === 'schedule'
                  ? "Ex: Cultos aos domingos às 19h, Estudo Bíblico às quartas 20h, Reunião de Jovens às sextas 19h30..."
                  : "Ex: Igreja Batista Central. Cultos aos domingos às 19h, Estudo Bíblico às quartas 20h..."
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={processNLP} 
            disabled={!inputText.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Analisar com IA
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processando...</span>
                <span>{processingStep + 1}/5</span>
              </div>
              <Progress value={((processingStep + 1) / 5) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          {/* Resultado da Denominação */}
          {mode !== 'schedule' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Church className="w-5 h-5" />
                  <span>Denominação Identificada</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{result.denomination}</h3>
                  <Badge className={getConfidenceColor(result.confidence)}>
                    {getConfidenceText(result.confidence)} ({Math.round(result.confidence)}%)
                  </Badge>
                </div>
                
                {result.alternatives.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Alternativas identificadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.alternatives.map((alt, index) => (
                        <Badge key={index} variant="outline">
                          {alt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resultado dos Horários */}
          {mode !== 'denomination' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Horários e Serviços</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Horários Extraídos */}
                {result.extractedTimes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Horários Identificados:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.extractedTimes.map((time, index) => (
                        <Badge key={index} variant="secondary">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Datas Extraídas */}
                {result.extractedDates.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Datas Identificadas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.extractedDates.map((date, index) => (
                        <Badge key={index} variant="secondary">
                          {date}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Serviços Identificados */}
                {result.services.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Serviços Identificados:</h4>
                    <div className="space-y-2">
                      {result.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            {service.day && (
                              <Badge variant="outline">
                                <Calendar className="w-3 h-3 mr-1" />
                                {service.day}
                              </Badge>
                            )}
                            {service.time && (
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {service.time}
                              </Badge>
                            )}
                            {service.type && (
                              <Badge variant="outline">
                                <Church className="w-3 h-3 mr-1" />
                                {service.type}
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getConfidenceColor(service.confidence)}
                          >
                            {Math.round(service.confidence)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estatísticas */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {result.extractedTimes.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Horários</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {result.services.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Serviços</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {result.extractedDates.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Datas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações do Processamento */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Informações do Processamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Processado em: {new Date(result.processedAt).toLocaleString('pt-BR')}</p>
                <p>Confiança geral: {Math.round(result.confidence)}%</p>
                <p>Texto analisado: {result.rawText.length} caracteres</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}