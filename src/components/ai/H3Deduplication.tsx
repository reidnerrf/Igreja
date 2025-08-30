import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  MapPin, 
  Target, 
  Merge, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Globe,
  Hash,
  Users,
  Building
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
  phone?: string;
  email?: string;
  website?: string;
  isVerified: boolean;
  createdAt: string;
}

interface H3Cell {
  h3Index: string;
  resolution: number;
  churches: Church[];
  center: {
    lat: number;
    lng: number;
  };
}

interface DuplicateGroup {
  id: string;
  churches: Church[];
  similarity: number;
  h3Cell: string;
  suggestedMerge: {
    name: string;
    denomination: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    phone?: string;
    email?: string;
    website?: string;
  };
}

interface H3DeduplicationProps {
  churches: Church[];
  onMerge?: (churches: Church[], mergedData: any) => void;
  onDelete?: (churchId: string) => void;
}

export function H3Deduplication({ churches, onMerge, onDelete }: H3DeduplicationProps) {
  const [h3Cells, setH3Cells] = useState<H3Cell[]>([]);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [selectedResolution, setSelectedResolution] = useState(9); // H3 resolution 9 (~174m)
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7);

  // Simular H3 geohashing (em produção, usar biblioteca h3-js)
  const generateH3Index = (lat: number, lng: number, resolution: number): string => {
    // Simulação simplificada do H3
    const latInt = Math.floor(lat * 1000000);
    const lngInt = Math.floor(lng * 1000000);
    const res = resolution.toString().padStart(2, '0');
    return `${res}${latInt.toString(16).padStart(8, '0')}${lngInt.toString(16).padStart(8, '0')}`;
  };

  const getH3Center = (h3Index: string) => {
    // Extrair coordenadas do H3 simulado
    const latHex = h3Index.substring(2, 10);
    const lngHex = h3Index.substring(10, 18);
    const lat = parseInt(latHex, 16) / 1000000;
    const lng = parseInt(lngHex, 16) / 1000000;
    return { lat, lng };
  };

  const calculateSimilarity = (church1: Church, church2: Church): number => {
    let score = 0;
    let totalChecks = 0;

    // Comparar nome (usando similaridade de strings)
    if (church1.name && church2.name) {
      const nameSimilarity = calculateStringSimilarity(
        church1.name.toLowerCase(), 
        church2.name.toLowerCase()
      );
      score += nameSimilarity * 0.4; // 40% do peso
      totalChecks += 0.4;
    }

    // Comparar endereço
    if (church1.address && church2.address) {
      const addressSimilarity = calculateStringSimilarity(
        church1.address.toLowerCase(), 
        church2.address.toLowerCase()
      );
      score += addressSimilarity * 0.3; // 30% do peso
      totalChecks += 0.3;
    }

    // Comparar cidade
    if (church1.city && church2.city) {
      const citySimilarity = church1.city.toLowerCase() === church2.city.toLowerCase() ? 1 : 0;
      score += citySimilarity * 0.2; // 20% do peso
      totalChecks += 0.2;
    }

    // Comparar denominação
    if (church1.denomination && church2.denomination) {
      const denominationSimilarity = church1.denomination.toLowerCase() === church2.denomination.toLowerCase() ? 1 : 0;
      score += denominationSimilarity * 0.1; // 10% do peso
      totalChecks += 0.1;
    }

    return totalChecks > 0 ? score / totalChecks : 0;
  };

  const calculateStringSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    // Algoritmo de similaridade de Jaro-Winkler simplificado
    const maxDistance = Math.floor(longer.length / 2) - 1;
    let matches = 0;
    let transpositions = 0;
    
    for (let i = 0; i < shorter.length; i++) {
      const start = Math.max(0, i - maxDistance);
      const end = Math.min(longer.length, i + maxDistance + 1);
      
      for (let j = start; j < end; j++) {
        if (shorter[i] === longer[j]) {
          matches++;
          break;
        }
      }
    }
    
    if (matches === 0) return 0;
    
    return matches / longer.length;
  };

  const processH3Deduplication = async () => {
    setIsProcessing(true);
    setProcessingStep(0);

    // Etapa 1: Gerar células H3
    setProcessingStep(1);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cells: H3Cell[] = [];
    const cellMap = new Map<string, Church[]>();

    for (const church of churches) {
      const h3Index = generateH3Index(church.coordinates.lat, church.coordinates.lng, selectedResolution);
      
      if (!cellMap.has(h3Index)) {
        cellMap.set(h3Index, []);
      }
      cellMap.get(h3Index)!.push(church);
    }

    for (const [h3Index, churchesInCell] of cellMap) {
      if (churchesInCell.length > 1) {
        cells.push({
          h3Index,
          resolution: selectedResolution,
          churches: churchesInCell,
          center: getH3Center(h3Index)
        });
      }
    }

    setH3Cells(cells);

    // Etapa 2: Identificar duplicatas
    setProcessingStep(2);
    await new Promise(resolve => setTimeout(resolve, 500));

    const duplicates: DuplicateGroup[] = [];

    for (const cell of cells) {
      const churchGroups: Church[][] = [];
      
      // Agrupar igrejas por similaridade
      for (let i = 0; i < cell.churches.length; i++) {
        let addedToGroup = false;
        
        for (const group of churchGroups) {
          const similarity = calculateSimilarity(cell.churches[i], group[0]);
          if (similarity >= similarityThreshold) {
            group.push(cell.churches[i]);
            addedToGroup = true;
            break;
          }
        }
        
        if (!addedToGroup) {
          churchGroups.push([cell.churches[i]]);
        }
      }

      // Criar grupos de duplicatas
      for (const group of churchGroups) {
        if (group.length > 1) {
          const similarity = calculateSimilarity(group[0], group[1]);
          
          // Sugerir dados mesclados
          const suggestedMerge = suggestMergeData(group);
          
          duplicates.push({
            id: `group-${duplicates.length}`,
            churches: group,
            similarity,
            h3Cell: cell.h3Index,
            suggestedMerge
          });
        }
      }
    }

    setDuplicateGroups(duplicates);

    // Etapa 3: Finalizar
    setProcessingStep(3);
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsProcessing(false);
    setProcessingStep(0);
  };

  const suggestMergeData = (churches: Church[]) => {
    // Selecionar os melhores dados de cada campo
    const bestName = churches.reduce((best, current) => 
      current.isVerified ? current : best
    ).name;
    
    const bestDenomination = churches.reduce((best, current) => 
      current.isVerified ? current : best
    ).denomination;
    
    const bestAddress = churches.reduce((best, current) => 
      current.isVerified ? current : best
    ).address;
    
    const bestCoordinates = churches.reduce((best, current) => 
      current.isVerified ? current : best
    ).coordinates;
    
    const bestPhone = churches.find(c => c.phone)?.phone;
    const bestEmail = churches.find(c => c.email)?.email;
    const bestWebsite = churches.find(c => c.website)?.website;

    return {
      name: bestName,
      denomination: bestDenomination,
      address: bestAddress,
      coordinates: bestCoordinates,
      phone: bestPhone,
      email: bestEmail,
      website: bestWebsite
    };
  };

  const handleMerge = (group: DuplicateGroup) => {
    if (onMerge) {
      onMerge(group.churches, group.suggestedMerge);
    }
    
    // Remover grupo das duplicatas
    setDuplicateGroups(prev => prev.filter(g => g.id !== group.id));
  };

  const handleDelete = (churchId: string) => {
    if (onDelete) {
      onDelete(churchId);
    }
    
    // Remover igreja de todos os grupos
    setDuplicateGroups(prev => 
      prev.map(group => ({
        ...group,
        churches: group.churches.filter(c => c.id !== churchId)
      })).filter(group => group.churches.length > 1)
    );
  };

  const getResolutionDescription = (resolution: number) => {
    const descriptions: Record<number, string> = {
      7: '~36km²',
      8: '~5.2km²', 
      9: '~0.73km²',
      10: '~0.105km²',
      11: '~0.015km²',
      12: '~0.002km²'
    };
    return descriptions[resolution] || 'Desconhecido';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="w-5 h-5" />
            <span>Deduplicação H3 - Detecção de Duplicatas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Resolução H3</label>
              <select
                value={selectedResolution}
                onChange={(e) => setSelectedResolution(parseInt(e.target.value))}
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
              >
                <option value={7}>7 - {getResolutionDescription(7)}</option>
                <option value={8}>8 - {getResolutionDescription(8)}</option>
                <option value={9}>9 - {getResolutionDescription(9)}</option>
                <option value={10}>10 - {getResolutionDescription(10)}</option>
                <option value={11}>11 - {getResolutionDescription(11)}</option>
                <option value={12}>12 - {getResolutionDescription(12)}</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Limiar de Similaridade</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
              <div className="text-xs text-muted-foreground text-center">
                {Math.round(similarityThreshold * 100)}%
              </div>
            </div>
          </div>

          <Button 
            onClick={processH3Deduplication} 
            disabled={isProcessing || churches.length === 0}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Identificar Duplicatas
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>
                  {processingStep === 1 && 'Gerando células H3...'}
                  {processingStep === 2 && 'Identificando duplicatas...'}
                  {processingStep === 3 && 'Finalizando...'}
                </span>
                <span>{processingStep}/3</span>
              </div>
              <Progress value={(processingStep / 3) * 100} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-8 h-8 text-blue-600" />
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
              <Hash className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Células H3</p>
                <p className="text-2xl font-bold">{h3Cells.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Merge className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Grupos de Duplicatas</p>
                <p className="text-2xl font-bold">{duplicateGroups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Igrejas Duplicadas</p>
                <p className="text-2xl font-bold">
                  {duplicateGroups.reduce((sum, group) => sum + group.churches.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Células H3 */}
      {h3Cells.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Células H3 com Múltiplas Igrejas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {h3Cells.map((cell) => (
                <div key={cell.h3Index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Célula H3: {cell.h3Index}</h4>
                      <p className="text-sm text-muted-foreground">
                        Coordenadas: {cell.center.lat.toFixed(6)}, {cell.center.lng.toFixed(6)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {cell.churches.length} igrejas
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cell.churches.map((church) => (
                      <div key={church.id} className="p-3 bg-muted rounded-lg">
                        <h5 className="font-medium text-sm">{church.name}</h5>
                        <p className="text-xs text-muted-foreground">{church.address}</p>
                        <p className="text-xs text-muted-foreground">{church.denomination}</p>
                        {church.isVerified && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verificada
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grupos de Duplicatas */}
      {duplicateGroups.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Merge className="w-5 h-5" />
              <span>Grupos de Duplicatas Identificados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {duplicateGroups.map((group) => (
                <div key={group.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Grupo de Duplicatas</h4>
                      <p className="text-sm text-muted-foreground">
                        Célula H3: {group.h3Cell} • Similaridade: {Math.round(group.similarity * 100)}%
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleMerge(group)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Merge className="w-4 h-4 mr-2" />
                        Mesclar
                      </Button>
                    </div>
                  </div>

                  {/* Igrejas no grupo */}
                  <div className="space-y-3 mb-4">
                    {group.churches.map((church) => (
                      <div key={church.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <h5 className="font-medium">{church.name}</h5>
                          <p className="text-sm text-muted-foreground">{church.address}</p>
                          <p className="text-sm text-muted-foreground">{church.denomination}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {church.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verificada
                            </Badge>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(church.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sugestão de mesclagem */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Sugestão de Mesclagem
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Nome:</span> {group.suggestedMerge.name}
                      </div>
                      <div>
                        <span className="font-medium">Denominação:</span> {group.suggestedMerge.denomination}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Endereço:</span> {group.suggestedMerge.address}
                      </div>
                      <div>
                        <span className="font-medium">Telefone:</span> {group.suggestedMerge.phone || 'Não informado'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {group.suggestedMerge.email || 'Não informado'}
                      </div>
                    </div>
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