import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { MapPin, Navigation, Phone, Mail, Globe, Clock, Users, Star } from 'lucide-react';

interface Church {
  id: string;
  name: string;
  denomination: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  verified: boolean;
  rating: number;
  members: number;
  services: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  distance?: number;
}

interface MapComponentProps {
  userLocation?: { lat: number; lng: number };
  onChurchSelect?: (church: Church) => void;
}

export function MapComponent({ userLocation, onChurchSelect }: MapComponentProps) {
  const [churches, setChurches] = useState<Church[]>([]);
  const [filteredChurches, setFilteredChurches] = useState<Church[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDenomination, setSelectedDenomination] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');

  // Dados mockados de igrejas para demonstração
  useEffect(() => {
    const mockChurches: Church[] = [
      {
        id: '1',
        name: 'Igreja Batista Central',
        denomination: 'Batista',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        phone: '(11) 9999-9999',
        email: 'contato@igrejabatista.com',
        website: 'www.igrejabatista.com',
        verified: true,
        rating: 4.8,
        members: 1200,
        services: ['Domingo 19:00', 'Quarta 20:00'],
        coordinates: { lat: -23.5505, lng: -46.6333 },
        distance: 0.5
      },
      {
        id: '2',
        name: 'Igreja Assembleia de Deus',
        denomination: 'Assembleia de Deus',
        address: 'Av. Paulista, 456',
        city: 'São Paulo',
        state: 'SP',
        phone: '(11) 8888-8888',
        email: 'contato@igrejaassembleia.com',
        verified: true,
        rating: 4.6,
        members: 800,
        services: ['Domingo 18:00', 'Terça 19:30'],
        coordinates: { lat: -23.5605, lng: -46.6583 },
        distance: 1.2
      },
      {
        id: '3',
        name: 'Igreja Católica Nossa Senhora',
        denomination: 'Católica',
        address: 'Rua Augusta, 789',
        city: 'São Paulo',
        state: 'SP',
        phone: '(11) 7777-7777',
        email: 'contato@igrejacatolica.com',
        verified: true,
        rating: 4.7,
        members: 1500,
        services: ['Domingo 10:00', 'Sábado 18:00'],
        coordinates: { lat: -23.5405, lng: -46.6483 },
        distance: 0.8
      },
      {
        id: '4',
        name: 'Igreja Presbiteriana',
        denomination: 'Presbiteriana',
        address: 'Rua Consolação, 321',
        city: 'São Paulo',
        state: 'SP',
        phone: '(11) 6666-6666',
        email: 'contato@igrejapresbiteriana.com',
        verified: false,
        rating: 4.5,
        members: 600,
        services: ['Domingo 17:00', 'Quinta 20:00'],
        coordinates: { lat: -23.5305, lng: -46.6383 },
        distance: 1.5
      }
    ];

    setChurches(mockChurches);
    setFilteredChurches(mockChurches);
  }, []);

  // Filtros e ordenação
  useEffect(() => {
    let filtered = churches.filter(church => {
      const matchesSearch = church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           church.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           church.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDenomination = selectedDenomination === 'all' || church.denomination === selectedDenomination;
      
      return matchesSearch && matchesDenomination;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredChurches(filtered);
  }, [churches, searchTerm, selectedDenomination, sortBy]);

  const denominations = ['all', ...Array.from(new Set(churches.map(c => c.denomination)))];

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Encontrar Igrejas</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por nome, endereço ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedDenomination}
              onChange={(e) => setSelectedDenomination(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {denominations.map(denom => (
                <option key={denom} value={denom}>
                  {denom === 'all' ? 'Todas as denominações' : denom}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="distance">Ordenar por distância</option>
              <option value="rating">Ordenar por avaliação</option>
              <option value="name">Ordenar por nome</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Mapa Simulado */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Igrejas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
            {/* Mapa simulado com pontos das igrejas */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              {/* Pontos das igrejas no mapa */}
              {filteredChurches.map((church, index) => (
                <div
                  key={church.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 hover:scale-150 transition-transform"
                  style={{
                    left: `${20 + (index * 20)}%`,
                    top: `${30 + (index * 15)}%`
                  }}
                  title={church.name}
                />
              ))}
              
              {/* Legenda */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Igrejas</span>
                </div>
              </div>
            </div>
            
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Mapa interativo em desenvolvimento</p>
              <p className="text-sm">Clique nos pontos para ver detalhes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Igrejas */}
      <div className="space-y-4">
        {filteredChurches.map(church => (
          <Card key={church.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{church.name}</h3>
                    {church.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Star className="w-3 h-3 mr-1" />
                        Verificada
                      </Badge>
                    )}
                    <Badge variant="outline">{church.denomination}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{church.address}, {church.city} - {church.state}</span>
                    {church.distance && (
                      <span className="ml-2 text-sm">({church.distance} km)</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{church.members} membros</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{church.rating}/5.0</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {church.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => onChurchSelect?.(church)}>
                    <Navigation className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" className="p-2">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-2">
                      <Mail className="w-4 h-4" />
                    </Button>
                    {church.website && (
                      <Button size="sm" variant="ghost" className="p-2">
                        <Globe className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredChurches.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma igreja encontrada com os filtros aplicados</p>
              <p className="text-sm">Tente ajustar os critérios de busca</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}