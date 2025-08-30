import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Sparkles, 
  Heart, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  TrendingUp,
  Loader2,
  Target,
  Filter,
  Zap
} from 'lucide-react';

interface Church {
  id: string;
  name: string;
  denomination: string;
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  members: number;
  services: string[];
  isVerified: boolean;
  isPremium: boolean;
  tags: string[];
  distance?: number;
}

interface UserPreferences {
  denomination: string[];
  maxDistance: number;
  preferredServices: string[];
  preferredTimes: string[];
  minRating: number;
  verifiedOnly: boolean;
  premiumOnly: boolean;
}

interface Recommendation {
  church: Church;
  score: number;
  reasons: string[];
  matchPercentage: number;
}

interface RecommendationEngineProps {
  churches: Church[];
  userLocation?: { lat: number; lng: number };
  userPreferences?: Partial<UserPreferences>;
  onChurchSelect?: (church: Church) => void;
}

export function RecommendationEngine({ 
  churches, 
  userLocation, 
  userPreferences = {},
  onChurchSelect 
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [filters, setFilters] = useState({
    denomination: 'all',
    maxDistance: 10,
    minRating: 0,
    verifiedOnly: false,
    premiumOnly: false
  });

  // Preferências padrão do usuário
  const defaultPreferences: UserPreferences = {
    denomination: ['Batista', 'Assembleia de Deus', 'Católica', 'Presbiteriana'],
    maxDistance: 10,
    preferredServices: ['Culto', 'Estudo Bíblico', 'Oração'],
    preferredTimes: ['19:00', '20:00', '18:00'],
    minRating: 4.0,
    verifiedOnly: false,
    premiumOnly: false,
    ...userPreferences
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    if (!userLocation) return 0;
    
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateRecommendationScore = (church: Church, preferences: UserPreferences): number => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Distância (30% do peso)
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        church.coordinates.lat, 
        church.coordinates.lng
      );
      
      if (distance <= preferences.maxDistance) {
        const distanceScore = 1 - (distance / preferences.maxDistance);
        score += distanceScore * 0.3;
        reasons.push(`Próxima (${distance.toFixed(1)}km)`);
      }
    }

    // 2. Denominação (25% do peso)
    if (preferences.denomination.includes(church.denomination)) {
      score += 0.25;
      reasons.push(`Denominação preferida: ${church.denomination}`);
    }

    // 3. Avaliação (20% do peso)
    if (church.rating >= preferences.minRating) {
      const ratingScore = (church.rating - preferences.minRating) / (5 - preferences.minRating);
      score += ratingScore * 0.2;
      reasons.push(`Boa avaliação: ${church.rating}/5`);
    }

    // 4. Serviços preferidos (15% do peso)
    const matchingServices = church.services.filter(service => 
      preferences.preferredServices.some(pref => 
        service.toLowerCase().includes(pref.toLowerCase())
      )
    );
    if (matchingServices.length > 0) {
      const serviceScore = matchingServices.length / preferences.preferredServices.length;
      score += serviceScore * 0.15;
      reasons.push(`${matchingServices.length} serviço(s) de interesse`);
    }

    // 5. Verificação e Premium (10% do peso)
    if (preferences.verifiedOnly && church.isVerified) {
      score += 0.05;
      reasons.push('Igreja verificada');
    }
    if (preferences.premiumOnly && church.isPremium) {
      score += 0.05;
      reasons.push('Igreja premium');
    }

    return Math.min(score, 1);
  };

  const generateRecommendations = async () => {
    setIsProcessing(true);
    setProcessingStep(0);

    // Etapa 1: Calcular distâncias
    setProcessingStep(1);
    await new Promise(resolve => setTimeout(resolve, 300));

    const churchesWithDistance = churches.map(church => ({
      ...church,
      distance: userLocation ? calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        church.coordinates.lat, 
        church.coordinates.lng
      ) : 0
    }));

    // Etapa 2: Aplicar filtros
    setProcessingStep(2);
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredChurches = churchesWithDistance;

    if (filters.denomination !== 'all') {
      filteredChurches = filteredChurches.filter(church => 
        church.denomination === filters.denomination
      );
    }

    if (filters.maxDistance > 0) {
      filteredChurches = filteredChurches.filter(church => 
        church.distance! <= filters.maxDistance
      );
    }

    if (filters.minRating > 0) {
      filteredChurches = filteredChurches.filter(church => 
        church.rating >= filters.minRating
      );
    }

    if (filters.verifiedOnly) {
      filteredChurches = filteredChurches.filter(church => 
        church.isVerified
      );
    }

    if (filters.premiumOnly) {
      filteredChurches = filteredChurches.filter(church => 
        church.isPremium
      );
    }

    // Etapa 3: Calcular scores
    setProcessingStep(3);
    await new Promise(resolve => setTimeout(resolve, 300));

    const recommendations: Recommendation[] = filteredChurches.map(church => {
      const score = calculateRecommendationScore(church, defaultPreferences);
      const reasons: string[] = [];
      
      // Gerar razões baseadas no score
      if (church.distance! <= defaultPreferences.maxDistance) {
        reasons.push(`Próxima (${church.distance!.toFixed(1)}km)`);
      }
      if (defaultPreferences.denomination.includes(church.denomination)) {
        reasons.push(`Denominação: ${church.denomination}`);
      }
      if (church.rating >= defaultPreferences.minRating) {
        reasons.push(`Avaliação: ${church.rating}/5`);
      }
      if (church.isVerified) {
        reasons.push('Verificada');
      }
      if (church.isPremium) {
        reasons.push('Premium');
      }

      return {
        church,
        score,
        reasons,
        matchPercentage: Math.round(score * 100)
      };
    });

    // Etapa 4: Ordenar por score
    setProcessingStep(4);
    await new Promise(resolve => setTimeout(resolve, 300));

    recommendations.sort((a, b) => b.score - a.score);

    setRecommendations(recommendations);
    setIsProcessing(false);
    setProcessingStep(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (score >= 0.4) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getScoreText = (score: number) => {
    if (score >= 0.8) return 'Excelente';
    if (score >= 0.6) return 'Boa';
    if (score >= 0.4) return 'Regular';
    return 'Baixa';
  };

  useEffect(() => {
    if (churches.length > 0) {
      generateRecommendations();
    }
  }, [churches, filters]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Motor de Recomendações IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Denominação</label>
              <select
                value={filters.denomination}
                onChange={(e) => setFilters(prev => ({ ...prev, denomination: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="all">Todas</option>
                <option value="Batista">Batista</option>
                <option value="Assembleia de Deus">Assembleia de Deus</option>
                <option value="Católica">Católica</option>
                <option value="Presbiteriana">Presbiteriana</option>
                <option value="Metodista">Metodista</option>
                <option value="Luterana">Luterana</option>
                <option value="Evangélica">Evangélica</option>
                <option value="Pentecostal">Pentecostal</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Distância Máx (km)</label>
              <input
                type="number"
                value={filters.maxDistance}
                onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Avaliação Mín</label>
              <input
                type="number"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                min="0"
                max="5"
                step="0.5"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verifiedOnly"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
              />
              <label htmlFor="verifiedOnly" className="text-sm">Apenas verificadas</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="premiumOnly"
                checked={filters.premiumOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, premiumOnly: e.target.checked }))}
              />
              <label htmlFor="premiumOnly" className="text-sm">Apenas premium</label>
            </div>
          </div>

          <Button 
            onClick={generateRecommendations} 
            disabled={isProcessing}
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
                Atualizar Recomendações
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {processingStep === 1 && 'Calculando distâncias...'}
                  {processingStep === 2 && 'Aplicando filtros...'}
                  {processingStep === 3 && 'Calculando scores...'}
                  {processingStep === 4 && 'Ordenando resultados...'}
                </span>
                <span>{processingStep}/4</span>
              </div>
              <Progress value={(processingStep / 4) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Igrejas</p>
                <p className="text-2xl font-bold">{churches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Após Filtros</p>
                <p className="text-2xl font-bold">{recommendations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Score Médio</p>
                <p className="text-2xl font-bold">
                  {recommendations.length > 0 
                    ? Math.round(recommendations.reduce((sum, r) => sum + r.score, 0) / recommendations.length * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Melhor Match</p>
                <p className="text-2xl font-bold">
                  {recommendations.length > 0 ? Math.round(recommendations[0].score * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Recomendações */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recomendações Personalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.slice(0, 10).map((recommendation, index) => (
                <div key={recommendation.church.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-semibold">#{index + 1}</span>
                        <h3 className="text-lg font-semibold">{recommendation.church.name}</h3>
                        <Badge className={getScoreColor(recommendation.score)}>
                          {getScoreText(recommendation.score)} ({recommendation.matchPercentage}%)
                        </Badge>
                        {recommendation.church.isVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <Star className="w-3 h-3 mr-1" />
                            Verificada
                          </Badge>
                        )}
                        {recommendation.church.isPremium && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{recommendation.church.address}, {recommendation.church.city} - {recommendation.church.state}</span>
                          {recommendation.church.distance && (
                            <span className="ml-2">({recommendation.church.distance.toFixed(1)} km)</span>
                          )}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{recommendation.church.rating}/5.0</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{recommendation.church.members} membros</span>
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {recommendation.church.denomination}
                        </Badge>
                        {recommendation.church.services.slice(0, 3).map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {service}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Razões da recomendação */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          Por que foi recomendada:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.reasons.slice(0, 4).map((reason, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => onChurchSelect?.(recommendation.church)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {recommendation.matchPercentage}%
                        </div>
                        <div className="text-xs text-muted-foreground">Match</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recommendations.length === 0 && !isProcessing && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma recomendação encontrada</p>
            <p className="text-sm">Tente ajustar os filtros ou expandir a área de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}