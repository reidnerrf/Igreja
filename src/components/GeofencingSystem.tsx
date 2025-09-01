import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { 
  MapPin, 
  Bell, 
  Settings, 
  Navigation, 
  Clock, 
  Users,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Eye,
  Zap
} from 'lucide-react';

interface Geofence {
  id: string;
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // metros
  type: 'church' | 'event' | 'custom';
  isActive: boolean;
  notifications: {
    onEnter: boolean;
    onExit: boolean;
    onProximity: boolean;
    proximityDistance: number; // metros
  };
  events: string[]; // IDs dos eventos associados
  lastTriggered?: string;
  triggerCount: number;
}

interface NearbyEvent {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  startTime: string;
  endTime: string;
  distance: number; // metros
  relevance: number; // 0-100
  church: {
    name: string;
    denomination: string;
    rating: number;
  };
  notifications: {
    sent: boolean;
    scheduled: boolean;
    reminderTime: string;
  };
}

interface GeofencingProps {
  userType: 'church' | 'user';
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onEventNotification?: (event: NearbyEvent) => void;
}

export function GeofencingSystem({ userType, userLocation, onEventNotification }: GeofencingProps) {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<NearbyEvent[]>([]);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [showGeofenceForm, setShowGeofenceForm] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    enableGeofencing: true,
    enableProximityAlerts: true,
    enableSmartReminders: true,
    defaultRadius: 1000, // metros
    reminderAdvanceTime: 30 // minutos
  });

  // Geofences mockados
  useEffect(() => {
    const mockGeofences: Geofence[] = [
      {
        id: 'geofence-1',
        name: 'Igreja Batista Central',
        center: {
          latitude: -23.5505,
          longitude: -46.6333
        },
        radius: 500,
        type: 'church',
        isActive: true,
        notifications: {
          onEnter: true,
          onExit: false,
          onProximity: true,
          proximityDistance: 1000
        },
        events: ['event-1', 'event-2'],
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        triggerCount: 15
      },
      {
        id: 'geofence-2',
        name: 'Centro da Cidade',
        center: {
          latitude: -23.5505,
          longitude: -46.6333
        },
        radius: 2000,
        type: 'custom',
        isActive: true,
        notifications: {
          onEnter: true,
          onExit: true,
          onProximity: true,
          proximityDistance: 500
        },
        events: ['event-3'],
        lastTriggered: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        triggerCount: 8
      }
    ];

    setGeofences(mockGeofences);
  }, []);

  // Eventos próximos mockados
  useEffect(() => {
    const mockNearbyEvents: NearbyEvent[] = [
      {
        id: 'event-1',
        title: 'Culto Dominical',
        description: 'Culto de domingo com pregação sobre fé',
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Rua das Flores, 123 - São Paulo, SP'
        },
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        distance: 450,
        relevance: 95,
        church: {
          name: 'Igreja Batista Central',
          denomination: 'Batista',
          rating: 4.8
        },
        notifications: {
          sent: false,
          scheduled: true,
          reminderTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        id: 'event-2',
        title: 'Estudo Bíblico',
        description: 'Estudo sobre o livro de João',
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Sala de Estudos - São Paulo, SP'
        },
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
        distance: 1200,
        relevance: 87,
        church: {
          name: 'Igreja Batista Central',
          denomination: 'Batista',
          rating: 4.8
        },
        notifications: {
          sent: false,
          scheduled: true,
          reminderTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    ];

    setNearbyEvents(mockNearbyEvents);
  }, []);

  const enableLocationServices = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setIsLocationEnabled(true);
        
        // Simular detecção de eventos próximos
        detectNearbyEvents({ latitude, longitude });
      } catch (error) {
        console.error('Erro ao obter localização:', error);
      }
    }
  };

  const detectNearbyEvents = (location: {latitude: number; longitude: number}) => {
    // Simular detecção de eventos baseada na localização
    const updatedEvents = nearbyEvents.map(event => ({
      ...event,
      distance: Math.floor(Math.random() * 2000) + 100,
      relevance: Math.floor(Math.random() * 30) + 70
    }));

    setNearbyEvents(updatedEvents);
  };

  const createGeofence = (geofenceData: Partial<Geofence>) => {
    const newGeofence: Geofence = {
      id: `geofence-${Date.now()}`,
      name: geofenceData.name || 'Nova Geofence',
      center: geofenceData.center || { latitude: -23.5505, longitude: -46.6333 },
      radius: geofenceData.radius || 1000,
      type: geofenceData.type || 'custom',
      isActive: true,
      notifications: {
        onEnter: true,
        onExit: false,
        onProximity: true,
        proximityDistance: 500
      },
      events: [],
      triggerCount: 0
    };

    setGeofences(prev => [...prev, newGeofence]);
    setShowGeofenceForm(false);
  };

  const updateGeofence = (geofenceId: string, updates: Partial<Geofence>) => {
    setGeofences(prev => prev.map(geofence => 
      geofence.id === geofenceId ? { ...geofence, ...updates } : geofence
    ));
    setEditingGeofence(null);
  };

  const deleteGeofence = (geofenceId: string) => {
    setGeofences(prev => prev.filter(geofence => geofence.id !== geofenceId));
  };

  const toggleGeofence = (geofenceId: string) => {
    setGeofences(prev => prev.map(geofence => 
      geofence.id === geofenceId ? { ...geofence, isActive: !geofence.isActive } : geofence
    ));
  };

  const sendEventNotification = (event: NearbyEvent) => {
    // Simular envio de notificação
    const updatedEvents = nearbyEvents.map(e => 
      e.id === event.id ? { ...e, notifications: { ...e.notifications, sent: true } } : e
    );
    setNearbyEvents(updatedEvents);
    
    if (onEventNotification) {
      onEventNotification(event);
    }
  };

  const scheduleReminder = (event: NearbyEvent) => {
    // Simular agendamento de lembrete
    const reminderTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos antes
    
    const updatedEvents = nearbyEvents.map(e => 
      e.id === event.id ? { 
        ...e, 
        notifications: { 
          ...e.notifications, 
          scheduled: true,
          reminderTime: reminderTime.toISOString()
        } 
      } : e
    );
    setNearbyEvents(updatedEvents);
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 500) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (distance <= 1000) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getDistanceText = (distance: number) => {
    if (distance < 1000) return `${distance}m`;
    return `${(distance / 1000).toFixed(1)}km`;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Sistema de Geofencing</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Lembretes inteligentes baseados em localização e eventos próximos
          </p>
        </CardContent>
      </Card>

      {/* Status de Localização */}
      <Card>
        <CardHeader>
          <CardTitle>Status de Localização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isLocationEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium">
                {isLocationEnabled ? 'Localização Ativa' : 'Localização Desativada'}
              </span>
            </div>
            
            {!isLocationEnabled && (
              <Button onClick={enableLocationServices}>
                <Navigation className="w-4 h-4 mr-2" />
                Ativar Localização
              </Button>
            )}
          </div>
          
          {currentLocation && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <span className="font-medium">Localização Atual:</span>
                <div className="text-muted-foreground">
                  Lat: {currentLocation.latitude.toFixed(6)}, 
                  Lng: {currentLocation.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações de Notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Notificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Geofencing</span>
                <p className="text-sm text-muted-foreground">
                  Notificações baseadas em entrada/saída de áreas
                </p>
              </div>
              <Switch
                checked={notificationSettings.enableGeofencing}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  enableGeofencing: checked
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Alertas de Proximidade</span>
                <p className="text-sm text-muted-foreground">
                  Notificações quando estiver próximo de eventos
                </p>
              </div>
              <Switch
                checked={notificationSettings.enableProximityAlerts}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  enableProximityAlerts: checked
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Lembretes Inteligentes</span>
                <p className="text-sm text-muted-foreground">
                  Lembretes baseados em localização e tempo
                </p>
              </div>
              <Switch
                checked={notificationSettings.enableSmartReminders}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  enableSmartReminders: checked
                }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Raio Padrão (metros)</label>
                <Input
                  type="number"
                  value={notificationSettings.defaultRadius}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    defaultRadius: parseInt(e.target.value) || 1000
                  }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Lembrete Antecipado (min)</label>
                <Input
                  type="number"
                  value={notificationSettings.reminderAdvanceTime}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    reminderAdvanceTime: parseInt(e.target.value) || 30
                  }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geofences Ativas */}
      <Card>
        <CardHeader>
          <CardTitle>Geofences Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              {geofences.filter(g => g.isActive).length} geofences ativas
            </span>
            <Button onClick={() => setShowGeofenceForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nova Geofence
            </Button>
          </div>
          
          <div className="space-y-4">
            {geofences.map((geofence) => (
              <div key={geofence.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{geofence.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {geofence.center.latitude.toFixed(6)}, {geofence.center.longitude.toFixed(6)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={geofence.isActive ? 'default' : 'secondary'}>
                      {geofence.isActive ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <Badge variant="outline">{geofence.type}</Badge>
                    <Badge variant="outline">{geofence.radius}m</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                  <div>
                    <span className="font-medium">Notificações:</span>
                    <div className="text-muted-foreground">
                      {geofence.notifications.onEnter ? 'Entrada' : ''}
                      {geofence.notifications.onExit ? ' Saída' : ''}
                      {geofence.notifications.onProximity ? ' Proximidade' : ''}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Distância Proximidade:</span>
                    <div className="text-muted-foreground">{geofence.notifications.proximityDistance}m</div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Último Trigger:</span>
                    <div className="text-muted-foreground">
                      {geofence.lastTriggered 
                        ? new Date(geofence.lastTriggered).toLocaleDateString('pt-BR')
                        : 'Nunca'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Total Triggers:</span>
                    <div className="text-muted-foreground">{geofence.triggerCount}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleGeofence(geofence.id)}
                    >
                      {geofence.isActive ? 'Desativar' : 'Ativar'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingGeofence(geofence)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGeofence(geofence.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eventos Próximos */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos Próximos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nearbyEvents.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getDistanceColor(event.distance)}>
                      {getDistanceText(event.distance)}
                    </Badge>
                    <Badge variant="outline">{event.relevance}% relevante</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(event.startTime).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{event.church.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendEventNotification(event)}
                      disabled={event.notifications.sent}
                    >
                      {event.notifications.sent ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Notificado
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 mr-1" />
                          Notificar
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => scheduleReminder(event)}
                      disabled={event.notifications.scheduled}
                    >
                      {event.notifications.scheduled ? (
                        <>
                          <Clock className="w-4 h-4 mr-1" />
                          Lembrete Agendado
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-1" />
                          Agendar Lembrete
                        </>
                      )}
                    </Button>
                  </div>
                  
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

      {/* Formulário de Geofence */}
      {showGeofenceForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Geofence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input placeholder="Nome da geofence" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Latitude</label>
                  <Input type="number" step="0.000001" placeholder="-23.5505" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Longitude</label>
                  <Input type="number" step="0.000001" placeholder="-46.6333" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Raio (metros)</label>
                <Input type="number" placeholder="1000" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <select className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="custom">Personalizada</option>
                  <option value="church">Igreja</option>
                  <option value="event">Evento</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={() => setShowGeofenceForm(false)} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={() => createGeofence({})}>
                  Criar Geofence
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}