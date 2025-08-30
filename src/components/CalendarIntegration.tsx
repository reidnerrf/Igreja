import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Calendar, 
  Download, 
  Upload, 
  Link, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Users,
  Settings,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: string[];
  isAllDay: boolean;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
  externalId?: string;
  lastSync?: string;
  syncStatus: 'synced' | 'pending' | 'error';
}

interface CalendarIntegration {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'ical';
  email: string;
  isConnected: boolean;
  lastSync: string;
  syncDirection: 'bidirectional' | 'import' | 'export';
  autoSync: boolean;
  syncInterval: number; // minutes
}

interface CalendarIntegrationProps {
  userType: 'church' | 'user';
  onEventSync?: (events: CalendarEvent[]) => void;
}

export function CalendarIntegration({ userType, onEventSync }: CalendarIntegrationProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string>('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Eventos mockados
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Culto Dominical',
        description: 'Culto de domingo com pregação sobre fé',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Igreja Batista Central',
        attendees: ['Membros da igreja'],
        isAllDay: false,
        recurrence: {
          frequency: 'weekly',
          interval: 1
        },
        syncStatus: 'synced'
      },
      {
        id: 'event-2',
        title: 'Estudo Bíblico',
        description: 'Estudo sobre o livro de João',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
        location: 'Sala de Estudos',
        attendees: ['Jovens e adultos'],
        isAllDay: false,
        syncStatus: 'pending'
      }
    ];

    setEvents(mockEvents);
  }, []);

  // Integrações mockadas
  useEffect(() => {
    const mockIntegrations: CalendarIntegration[] = [
      {
        id: 'google-1',
        name: 'Google Calendar',
        type: 'google',
        email: 'igreja@batista.com',
        isConnected: true,
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        syncDirection: 'bidirectional',
        autoSync: true,
        syncInterval: 15
      },
      {
        id: 'outlook-1',
        name: 'Outlook Calendar',
        type: 'outlook',
        email: 'admin@igreja.com',
        isConnected: false,
        lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        syncDirection: 'import',
        autoSync: false,
        syncInterval: 60
      }
    ];

    setIntegrations(mockIntegrations);
  }, []);

  const connectCalendar = async (type: string) => {
    setIsConnecting(true);
    
    // Simular processo de conexão OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newIntegration: CalendarIntegration = {
      id: `${type}-${Date.now()}`,
      name: type === 'google' ? 'Google Calendar' : 'Outlook Calendar',
      type: type as any,
      email: 'usuario@exemplo.com',
      isConnected: true,
      lastSync: new Date().toISOString(),
      syncDirection: 'bidirectional',
      autoSync: true,
      syncInterval: 15
    };

    setIntegrations(prev => [...prev, newIntegration]);
    setIsConnecting(false);
  };

  const syncCalendar = async (integrationId: string) => {
    setIsSyncing(true);
    
    // Simular sincronização
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Atualizar status de sincronização
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, lastSync: new Date().toISOString() }
        : integration
    ));

    // Simular eventos sincronizados
    const syncedEvents = events.map(event => ({
      ...event,
      syncStatus: 'synced' as const,
      lastSync: new Date().toISOString()
    }));

    setEvents(syncedEvents);
    
    if (onEventSync) {
      onEventSync(syncedEvents);
    }

    setIsSyncing(false);
  };

  const generateICS = (event: CalendarEvent) => {
    const formatDate = (date: string) => {
      return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FaithConnect//Calendar//PT',
      'BEGIN:VEVENT',
      `UID:${event.id}@faithconnect.com`,
      `DTSTAMP:${formatDate(new Date().toISOString())}`,
      `DTSTART:${formatDate(event.startDate)}`,
      `DTEND:${formatDate(event.endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      event.recurrence ? `RRULE:FREQ=${event.recurrence.frequency.toUpperCase()};INTERVAL=${event.recurrence.interval}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(line => line !== '').join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addToGoogleCalendar = (event: CalendarEvent) => {
    const startDate = new Date(event.startDate).toISOString();
    const endDate = new Date(event.endDate).toISOString();
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.replace(/[-:]/g, '').split('.')[0]}Z/${endDate.replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const addToOutlookCalendar = (event: CalendarEvent) => {
    const startDate = new Date(event.startDate).toISOString();
    const endDate = new Date(event.endDate).toISOString();
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${startDate}&enddt=${endDate}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(outlookUrl, '_blank');
  };

  const createEvent = (eventData: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || '',
      description: eventData.description || '',
      startDate: eventData.startDate || new Date().toISOString(),
      endDate: eventData.endDate || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      location: eventData.location || '',
      attendees: eventData.attendees || [],
      isAllDay: eventData.isAllDay || false,
      syncStatus: 'pending'
    };

    setEvents(prev => [...prev, newEvent]);
    setShowEventForm(false);
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
    setEditingEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Integração com Calendários</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sincronização bidirecional com Google Calendar, Outlook e outros calendários
          </p>
        </CardContent>
      </Card>

      {/* Conectar Calendários */}
      <Card>
        <CardHeader>
          <CardTitle>Conectar Calendários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => connectCalendar('google')}
              disabled={isConnecting}
              className="w-full"
              variant="outline"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Conectar Google Calendar
                </>
              )}
            </Button>

            <Button
              onClick={() => connectCalendar('outlook')}
              disabled={isConnecting}
              className="w-full"
              variant="outline"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Conectar Outlook
                </>
              )}
            </Button>

            <Button
              onClick={() => setShowEventForm(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Evento
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendários Conectados */}
      <Card>
        <CardHeader>
          <CardTitle>Calendários Conectados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${integration.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <h4 className="font-semibold">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={integration.isConnected ? 'default' : 'secondary'}>
                      {integration.isConnected ? 'Conectado' : 'Desconectado'}
                    </Badge>
                    <Badge variant="outline">
                      {integration.syncDirection === 'bidirectional' ? 'Bidirecional' :
                       integration.syncDirection === 'import' ? 'Importar' : 'Exportar'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="font-medium">Última Sincronização:</span>
                    <div className="text-muted-foreground">
                      {new Date(integration.lastSync).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Sincronização:</span>
                    <div className="text-muted-foreground">
                      {integration.autoSync ? 'Automática' : 'Manual'}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Intervalo:</span>
                    <div className="text-muted-foreground">
                      {integration.syncInterval} min
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="text-muted-foreground">
                      {integration.isConnected ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncCalendar(integration.id)}
                      disabled={!integration.isConnected || isSyncing}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          Sincronizando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Sincronizar
                        </>
                      )}
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-1" />
                      Configurar
                    </Button>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Desconectar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos do Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={event.syncStatus === 'synced' ? 'default' : 
                               event.syncStatus === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {event.syncStatus === 'synced' ? 'Sincronizado' :
                       event.syncStatus === 'pending' ? 'Pendente' : 'Erro'}
                    </Badge>
                    
                    {event.recurrence && (
                      <Badge variant="outline">
                        {event.recurrence.frequency === 'weekly' ? 'Semanal' :
                         event.recurrence.frequency === 'monthly' ? 'Mensal' :
                         event.recurrence.frequency === 'yearly' ? 'Anual' : 'Diário'}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(event.startDate).toLocaleString('pt-BR')} - 
                      {new Date(event.endDate).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees.length} participantes</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateICS(event)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Baixar ICS
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToGoogleCalendar(event)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Google Calendar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToOutlookCalendar(event)}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Outlook
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Evento */}
      {showEventForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input placeholder="Nome do evento" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea placeholder="Descrição do evento" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data de Início</label>
                  <Input type="datetime-local" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Data de Fim</label>
                  <Input type="datetime-local" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Local</label>
                <Input placeholder="Local do evento" />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={() => setShowEventForm(false)} variant="outline">
                  Cancelar
                </Button>
                <Button onClick={() => createEvent({})}>
                  Criar Evento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}