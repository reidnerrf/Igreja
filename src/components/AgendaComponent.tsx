import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2, Bell, Star, Church } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // em minutos
  location: string;
  type: 'personal' | 'church' | 'community';
  church?: string;
  attendees?: number;
  maxAttendees?: number;
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'monthly' | 'yearly';
  reminder: boolean;
  reminderTime: number; // minutos antes
  color: string;
  tags: string[];
}

interface AgendaComponentProps {
  userType: 'church' | 'user';
  churchName?: string;
}

export function AgendaComponent({ userType, churchName }: AgendaComponentProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [newEventDialog, setNewEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'personal' | 'church' | 'community'>('all');

  // Dados mockados de eventos
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Culto Dominical',
        description: 'Culto de domingo com pregação e louvor',
        date: '2025-01-12',
        time: '19:00',
        duration: 120,
        location: 'Templo Principal',
        type: 'church',
        church: churchName || 'Igreja Batista Central',
        attendees: 350,
        maxAttendees: 500,
        isRecurring: true,
        recurringPattern: 'weekly',
        reminder: true,
        reminderTime: 30,
        color: 'blue',
        tags: ['culto', 'domingo', 'principal']
      },
      {
        id: '2',
        title: 'Estudo Bíblico',
        description: 'Estudo bíblico sobre o livro de João',
        date: '2025-01-14',
        time: '20:00',
        duration: 90,
        location: 'Sala de Estudos',
        type: 'church',
        church: churchName || 'Igreja Batista Central',
        attendees: 80,
        maxAttendees: 100,
        isRecurring: true,
        recurringPattern: 'weekly',
        reminder: true,
        reminderTime: 15,
        color: 'green',
        tags: ['estudo', 'bíblia', 'joão']
      },
      {
        id: '3',
        title: 'Reunião de Jovens',
        description: 'Encontro dos jovens para comunhão e atividades',
        date: '2025-01-16',
        time: '19:30',
        duration: 120,
        location: 'Salão Social',
        type: 'church',
        church: churchName || 'Igreja Batista Central',
        attendees: 120,
        maxAttendees: 150,
        isRecurring: true,
        recurringPattern: 'weekly',
        reminder: true,
        reminderTime: 60,
        color: 'purple',
        tags: ['jovens', 'comunhão', 'atividades']
      },
      {
        id: '4',
        title: 'Consulta Médica',
        description: 'Consulta de rotina com cardiologista',
        date: '2025-01-15',
        time: '14:00',
        duration: 60,
        location: 'Clínica CardioVida',
        type: 'personal',
        isRecurring: false,
        reminder: true,
        reminderTime: 60,
        color: 'red',
        tags: ['saúde', 'consulta', 'médico']
      },
      {
        id: '5',
        title: 'Encontro de Oração',
        description: 'Momento de oração e intercessão pela igreja',
        date: '2025-01-13',
        time: '07:00',
        duration: 60,
        location: 'Capela de Oração',
        type: 'community',
        church: churchName || 'Igreja Batista Central',
        attendees: 45,
        maxAttendees: 80,
        isRecurring: true,
        recurringPattern: 'weekly',
        reminder: true,
        reminderTime: 30,
        color: 'orange',
        tags: ['oração', 'intercessão', 'manhã']
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, [churchName]);

  // Filtros
  useEffect(() => {
    let filtered = events;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.type === filterType);
    }
    
    setFilteredEvents(filtered);
  }, [events, filterType]);

  const getEventsForDate = (date: string) => {
    return filteredEvents.filter(event => event.date === date);
  };

  const getEventsForWeek = (date: string) => {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  };

  const getEventsForMonth = (date: string) => {
    const [year, month] = date.split('-');
    return filteredEvents.filter(event => {
      const [eventYear, eventMonth] = event.date.split('-');
      return eventYear === year && eventMonth === month;
    });
  };

  const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
    setNewEventDialog(false);
  };

  const handleEditEvent = (eventData: Event) => {
    setEvents(prev => prev.map(event => event.id === eventData.id ? eventData : event));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getEventColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[color] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Agenda */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Minha Agenda</span>
            </CardTitle>
            
            <div className="flex items-center space-x-4">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os eventos</SelectItem>
                  <SelectItem value="personal">Pessoais</SelectItem>
                  <SelectItem value="church">Igreja</SelectItem>
                  <SelectItem value="community">Comunidade</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedView} onValueChange={(value: any) => setSelectedView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mês</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="day">Dia</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog open={newEventDialog} onOpenChange={setNewEventDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Evento</DialogTitle>
                    <DialogDescription>
                      Adicione um novo evento à sua agenda
                    </DialogDescription>
                  </DialogHeader>
                  
                  <EventForm
                    onSubmit={handleCreateEvent}
                    onCancel={() => setNewEventDialog(false)}
                    userType={userType}
                    churchName={churchName}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visualização da Agenda */}
      <Card>
        <CardContent className="p-6">
          {selectedView === 'month' && (
            <MonthView
              selectedDate={selectedDate}
              events={getEventsForMonth(selectedDate)}
              onDateSelect={setSelectedDate}
              onEventClick={(event) => setEditingEvent(event)}
            />
          )}
          
          {selectedView === 'week' && (
            <WeekView
              selectedDate={selectedDate}
              events={getEventsForWeek(selectedDate)}
              onEventClick={(event) => setEditingEvent(event)}
            />
          )}
          
          {selectedView === 'day' && (
            <DayView
              selectedDate={selectedDate}
              events={getEventsForDate(selectedDate)}
              onEventClick={(event) => setEditingEvent(event)}
            />
          )}
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents
              .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
              .slice(0, 10)
              .map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getEventColor(event.color).replace('bg-', 'bg-').replace('text-', '')}`} />
                    
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(event.time)} ({formatDuration(event.duration)})</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </span>
                        {event.type === 'church' && event.attendees && (
                          <span className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{event.attendees}/{event.maxAttendees || '∞'}</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {event.type === 'personal' ? 'Pessoal' : 
                           event.type === 'church' ? 'Igreja' : 'Comunidade'}
                        </Badge>
                        {event.isRecurring && (
                          <Badge variant="secondary" className="text-xs">
                            Recorrente
                          </Badge>
                        )}
                        {event.reminder && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="w-3 h-3 mr-1" />
                            Lembrete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum evento encontrado</p>
                <p className="text-sm">Crie seu primeiro evento para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      {editingEvent && (
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias no evento
              </DialogDescription>
            </DialogHeader>
            
            <EventForm
              event={editingEvent}
              onSubmit={handleEditEvent}
              onCancel={() => setEditingEvent(null)}
              userType={userType}
              churchName={churchName}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente de formulário para criar/editar eventos
interface EventFormProps {
  event?: Event;
  onSubmit: (event: Event) => void;
  onCancel: () => void;
  userType: 'church' | 'user';
  churchName?: string;
}

function EventForm({ event, onSubmit, onCancel, userType, churchName }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || new Date().toISOString().split('T')[0],
    time: event?.time || '19:00',
    duration: event?.duration || 60,
    location: event?.location || '',
    type: event?.type || (userType === 'church' ? 'church' : 'personal'),
    maxAttendees: event?.maxAttendees || 0,
    isRecurring: event?.isRecurring || false,
    recurringPattern: event?.recurringPattern || 'weekly',
    reminder: event?.reminder || true,
    reminderTime: event?.reminderTime || 30,
    color: event?.color || 'blue',
    tags: event?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      ...event,
      ...formData,
      id: event?.id || Date.now().toString(),
      church: formData.type === 'church' ? churchName : undefined,
      attendees: event?.attendees || 0
    };
    onSubmit(newEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="time">Horário</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            min="15"
            step="15"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="color">Cor</Label>
          <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Azul</SelectItem>
              <SelectItem value="green">Verde</SelectItem>
              <SelectItem value="purple">Roxo</SelectItem>
              <SelectItem value="red">Vermelho</SelectItem>
              <SelectItem value="orange">Laranja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Pessoal</SelectItem>
            <SelectItem value="church">Igreja</SelectItem>
            <SelectItem value="community">Comunidade</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.type === 'church' && (
        <div>
          <Label htmlFor="maxAttendees">Máximo de Participantes</Label>
          <Input
            id="maxAttendees"
            type="number"
            value={formData.maxAttendees}
            onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
            min="0"
          />
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isRecurring"
            checked={formData.isRecurring}
            onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
          />
          <Label htmlFor="isRecurring">Evento recorrente</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="reminder"
            checked={formData.reminder}
            onChange={(e) => setFormData(prev => ({ ...prev, reminder: e.target.checked }))}
          />
          <Label htmlFor="reminder">Lembrete</Label>
        </div>
      </div>
      
      {formData.isRecurring && (
        <div>
          <Label htmlFor="recurringPattern">Padrão de recorrência</Label>
          <Select value={formData.recurringPattern} onValueChange={(value: any) => setFormData(prev => ({ ...prev, recurringPattern: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {formData.reminder && (
        <div>
          <Label htmlFor="reminderTime">Lembrar (minutos antes)</Label>
          <Input
            id="reminderTime"
            type="number"
            value={formData.reminderTime}
            onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: parseInt(e.target.value) }))}
            min="5"
            step="5"
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {event ? 'Salvar Alterações' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  );
}

// Componentes de visualização
function MonthView({ selectedDate, events, onDateSelect, onEventClick }: any) {
  // Implementação simplificada da visualização mensal
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">
        {new Date(selectedDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
      </h3>
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="p-2 font-medium text-sm bg-muted rounded">
            {day}
          </div>
        ))}
        {/* Dias do mês seriam renderizados aqui */}
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="p-2 min-h-[80px] border rounded hover:bg-muted/50 cursor-pointer">
            <div className="text-sm text-muted-foreground">{i + 1}</div>
            {/* Eventos do dia seriam renderizados aqui */}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeekView({ selectedDate, events, onEventClick }: any) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">Visualização Semanal</h3>
      <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
    </div>
  );
}

function DayView({ selectedDate, events, onEventClick }: any) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">
        {new Date(selectedDate).toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </h3>
      <div className="space-y-2">
        {events.map(event => (
          <div
            key={event.id}
            className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
            onClick={() => onEventClick(event)}
          >
            <div className="font-medium">{event.title}</div>
            <div className="text-sm text-muted-foreground">
              {event.time} - {event.location}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-muted-foreground">Nenhum evento para este dia</p>
        )}
      </div>
    </div>
  );
}