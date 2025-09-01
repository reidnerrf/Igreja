import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  Heart, 
  Gift, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  PiggyBank, 
  Plus, 
  Edit, 
  Trash2, 
  Share2, 
  Star,
  Crown,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  church: string;
  churchId: string;
  goal: number;
  raised: number;
  currency: string;
  category: 'mission' | 'building' | 'charity' | 'general' | 'event';
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'monthly' | 'yearly';
  isVerified: boolean;
  isPremium: boolean;
  image?: string;
  tags: string[];
}

interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  donorEmail?: string;
  amount: number;
  currency: string;
  type: 'one-time' | 'recurring';
  paymentMethod: 'credit-card' | 'pix' | 'bank-transfer' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  date: string;
  anonymous: boolean;
  message?: string;
  isVerified: boolean;
}

interface DonationComponentProps {
  userType: 'church' | 'user';
  churchId?: string;
  churchName?: string;
}

export function DonationComponent({ userType, churchId, churchName }: DonationComponentProps) {
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<DonationCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);
  const [newCampaignDialog, setNewCampaignDialog] = useState(false);
  const [editCampaignDialog, setEditCampaignDialog] = useState(false);
  const [donateDialog, setDonateDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'goal' | 'raised' | 'date' | 'name'>('date');

  // Dados mockados de campanhas de doação
  useEffect(() => {
    const mockCampaigns: DonationCampaign[] = [
      {
        id: '1',
        title: 'Construção do Novo Templo',
        description: 'Ajude-nos a construir um novo templo para nossa comunidade crescente',
        church: 'Igreja Batista Central',
        churchId: 'church1',
        goal: 500000,
        raised: 320000,
        currency: 'BRL',
        category: 'building',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2025-12-31',
        isRecurring: false,
        isVerified: true,
        isPremium: true,
        tags: ['construção', 'templo', 'infraestrutura']
      },
      {
        id: '2',
        title: 'Missão na África',
        description: 'Suporte para nossa missão evangelística na África',
        church: 'Igreja Batista Central',
        churchId: 'church1',
        goal: 25000,
        raised: 18750,
        currency: 'BRL',
        category: 'mission',
        status: 'active',
        startDate: '2024-06-01',
        endDate: '2025-05-31',
        isRecurring: true,
        recurringPattern: 'monthly',
        isVerified: true,
        isPremium: false,
        tags: ['missão', 'evangelismo', 'áfrica']
      },
      {
        id: '3',
        title: 'Ajuda aos Necessitados',
        description: 'Campanha para ajudar famílias em situação de vulnerabilidade',
        church: 'Igreja Batista Central',
        churchId: 'church1',
        goal: 15000,
        raised: 15000,
        currency: 'BRL',
        category: 'charity',
        status: 'completed',
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        isRecurring: false,
        isVerified: true,
        isPremium: false,
        tags: ['caridade', 'ajuda', 'famílias']
      },
      {
        id: '4',
        title: 'Evento de Jovens',
        description: 'Financiamento para o retiro de jovens deste ano',
        church: 'Igreja Batista Central',
        churchId: 'church1',
        goal: 8000,
        raised: 5200,
        currency: 'BRL',
        category: 'event',
        status: 'active',
        startDate: '2024-11-01',
        endDate: '2025-02-28',
        isRecurring: false,
        isVerified: false,
        isPremium: false,
        tags: ['jovens', 'retiro', 'evento']
      }
    ];

    const mockDonations: Donation[] = [
      {
        id: '1',
        campaignId: '1',
        donorName: 'João Silva',
        donorEmail: 'joao@email.com',
        amount: 500,
        currency: 'BRL',
        type: 'one-time',
        paymentMethod: 'credit-card',
        status: 'completed',
        date: '2025-01-10',
        anonymous: false,
        message: 'Que Deus abençoe este projeto!',
        isVerified: true
      },
      {
        id: '2',
        campaignId: '1',
        donorName: 'Maria Santos',
        donorEmail: 'maria@email.com',
        amount: 1000,
        currency: 'BRL',
        type: 'recurring',
        paymentMethod: 'pix',
        status: 'completed',
        date: '2025-01-08',
        anonymous: false,
        isVerified: true
      },
      {
        id: '3',
        campaignId: '2',
        donorName: 'Anônimo',
        amount: 250,
        currency: 'BRL',
        type: 'one-time',
        paymentMethod: 'bank-transfer',
        status: 'completed',
        date: '2025-01-05',
        anonymous: true,
        message: 'Deus abençoe esta missão',
        isVerified: true
      }
    ];

    setCampaigns(mockCampaigns);
    setDonations(mockDonations);
    setFilteredCampaigns(mockCampaigns);
  }, []);

  // Filtros e ordenação
  useEffect(() => {
    let filtered = campaigns;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(campaign => campaign.category === filterCategory);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === filterStatus);
    }
    
    if (userType === 'church' && churchId) {
      filtered = filtered.filter(campaign => campaign.churchId === churchId);
    }
    
    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'goal':
          return b.goal - a.goal;
        case 'raised':
          return b.raised - a.raised;
        case 'date':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredCampaigns(filtered);
  }, [campaigns, filterCategory, filterStatus, sortBy, userType, churchId]);

  const handleCreateCampaign = (campaignData: Omit<DonationCampaign, 'id' | 'churchId' | 'raised' | 'status'>) => {
    const newCampaign: DonationCampaign = {
      ...campaignData,
      id: Date.now().toString(),
      churchId: churchId || 'church1',
      raised: 0,
      status: 'active'
    };
    setCampaigns(prev => [...prev, newCampaign]);
    setNewCampaignDialog(false);
  };

  const handleEditCampaign = (campaignData: DonationCampaign) => {
    setCampaigns(prev => prev.map(campaign => campaign.id === campaignData.id ? campaignData : campaign));
    setEditCampaignDialog(false);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
  };

  const handleDonate = (donationData: Omit<Donation, 'id' | 'status' | 'date' | 'isVerified'>) => {
    const newDonation: Donation = {
      ...donationData,
      id: Date.now().toString(),
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      isVerified: false
    };
    
    setDonations(prev => [...prev, newDonation]);
    
    // Atualizar valor arrecadado da campanha
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === donationData.campaignId 
        ? { ...campaign, raised: campaign.raised + donationData.amount }
        : campaign
    ));
    
    setDonateDialog(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mission': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'building': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'charity': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'general': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'event': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency === 'BRL' ? 'BRL' : 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Sistema de Doações</span>
            </CardTitle>
            
            {userType === 'church' && (
              <div className="flex items-center space-x-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="mission">Missão</SelectItem>
                    <SelectItem value="building">Construção</SelectItem>
                    <SelectItem value="charity">Caridade</SelectItem>
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="paused">Pausada</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Ordenar por data</SelectItem>
                    <SelectItem value="goal">Ordenar por meta</SelectItem>
                    <SelectItem value="raised">Ordenar por arrecadado</SelectItem>
                    <SelectItem value="name">Ordenar por nome</SelectItem>
                  </SelectContent>
                </Select>
                
                <Dialog open={newCampaignDialog} onOpenChange={setNewCampaignDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Campanha
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Campanha</DialogTitle>
                      <DialogDescription>
                        Configure uma nova campanha de doação
                      </DialogDescription>
                    </DialogHeader>
                    
                    <CampaignForm
                      onSubmit={handleCreateCampaign}
                      onCancel={() => setNewCampaignDialog(false)}
                      churchName={churchName}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
                <p className="text-2xl font-bold">
                  {filteredCampaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Arrecadado</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    filteredCampaigns.reduce((sum, c) => sum + c.raised, 0),
                    'BRL'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Doações</p>
                <p className="text-2xl font-bold">{donations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Meta Geral</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    filteredCampaigns.reduce((sum, c) => sum + c.goal, 0),
                    'BRL'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Campanhas */}
      <div className="space-y-4">
        {filteredCampaigns.map(campaign => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <h3 className="font-semibold text-xl">{campaign.title}</h3>
                    <Badge className={getCategoryColor(campaign.category)}>
                      {campaign.category === 'mission' ? 'Missão' :
                       campaign.category === 'building' ? 'Construção' :
                       campaign.category === 'charity' ? 'Caridade' :
                       campaign.category === 'general' ? 'Geral' :
                       campaign.category === 'event' ? 'Evento' : campaign.category}
                    </Badge>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status === 'active' ? 'Ativa' :
                       campaign.status === 'completed' ? 'Concluída' :
                       campaign.status === 'paused' ? 'Pausada' : campaign.status}
                    </Badge>
                    {campaign.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Star className="w-3 h-3 mr-1" />
                        Verificada
                      </Badge>
                    )}
                    {campaign.isPremium && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{campaign.description}</p>
                  
                  {/* Progresso da Campanha */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Arrecadado: {formatCurrency(campaign.raised, campaign.currency)}</span>
                      <span>Meta: {formatCurrency(campaign.goal, campaign.currency)}</span>
                    </div>
                    <Progress value={getProgressPercentage(campaign.raised, campaign.goal)} />
                    <p className="text-xs text-muted-foreground text-center">
                      {Math.round(getProgressPercentage(campaign.raised, campaign.goal))}% da meta alcançada
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Início: {formatDate(campaign.startDate)}</span>
                    </span>
                    {campaign.endDate && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Fim: {formatDate(campaign.endDate)}</span>
                      </span>
                    )}
                    {campaign.isRecurring && (
                      <span className="flex items-center space-x-1">
                        <Gift className="w-3 h-3" />
                        <span>Recorrente</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 ml-6">
                  {userType === 'church' && campaign.churchId === churchId ? (
                    // Controles para igreja
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setEditCampaignDialog(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  ) : (
                    // Controles para usuário
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setDonateDialog(true);
                        }}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Doar
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma campanha encontrada</p>
              <p className="text-sm">Tente ajustar os filtros ou criar uma nova campanha</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Histórico de Doações (apenas para igrejas) */}
      {userType === 'church' && (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Doações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donations
                .filter(donation => campaigns.some(c => c.churchId === churchId && c.id === donation.campaignId))
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map(donation => {
                  const campaign = campaigns.find(c => c.id === donation.campaignId);
                  return (
                    <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{donation.donorName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {campaign?.title} • {formatDate(donation.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(donation.amount, donation.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {donation.type === 'one-time' ? 'Única' : 'Recorrente'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              
              {donations.filter(d => campaigns.some(c => c.churchId === churchId && c.id === d.campaignId)).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma doação recebida ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {newCampaignDialog && (
        <Dialog open={newCampaignDialog} onOpenChange={setNewCampaignDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
              <DialogDescription>
                Configure uma nova campanha de doação
              </DialogDescription>
            </DialogHeader>
            
            <CampaignForm
              onSubmit={handleCreateCampaign}
              onCancel={() => setNewCampaignDialog(false)}
              churchName={churchName}
            />
          </DialogContent>
        </Dialog>
      )}

      {editCampaignDialog && selectedCampaign && (
        <Dialog open={editCampaignDialog} onOpenChange={setEditCampaignDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Campanha</DialogTitle>
              <DialogDescription>
                Faça as alterações necessárias na campanha
              </DialogDescription>
            </DialogHeader>
            
            <CampaignForm
              campaign={selectedCampaign}
              onSubmit={handleEditCampaign}
              onCancel={() => setEditCampaignDialog(false)}
              churchName={churchName}
            />
          </DialogContent>
        </Dialog>
      )}

      {donateDialog && selectedCampaign && (
        <Dialog open={donateDialog} onOpenChange={setDonateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Fazer Doação</DialogTitle>
              <DialogDescription>
                {selectedCampaign.title} - {selectedCampaign.church}
              </DialogDescription>
            </DialogHeader>
            
            <DonationForm
              campaign={selectedCampaign}
              onSubmit={handleDonate}
              onCancel={() => setDonateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Componente de formulário para campanhas
interface CampaignFormProps {
  campaign?: DonationCampaign;
  onSubmit: (campaign: DonationCampaign) => void;
  onCancel: () => void;
  churchName?: string;
}

function CampaignForm({ campaign, onSubmit, onCancel, churchName }: CampaignFormProps) {
  const [formData, setFormData] = useState({
    title: campaign?.title || '',
    description: campaign?.description || '',
    goal: campaign?.goal || 0,
    currency: campaign?.currency || 'BRL',
    category: campaign?.category || 'general',
    startDate: campaign?.startDate || new Date().toISOString().split('T')[0],
    endDate: campaign?.endDate || '',
    isRecurring: campaign?.isRecurring || false,
    recurringPattern: campaign?.recurringPattern || 'monthly',
    tags: campaign?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: DonationCampaign = {
      ...campaign,
      ...formData,
      id: campaign?.id || Date.now().toString(),
      church: churchName || 'Igreja',
      churchId: campaign?.churchId || 'church1',
      raised: campaign?.raised || 0,
      status: campaign?.status || 'active',
      isVerified: campaign?.isVerified || false,
      isPremium: campaign?.isPremium || false
    };
    onSubmit(newCampaign);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título da Campanha</Label>
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
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="goal">Meta (R$)</Label>
          <Input
            id="goal"
            type="number"
            value={formData.goal}
            onChange={(e) => setFormData(prev => ({ ...prev, goal: parseInt(e.target.value) }))}
            min="1"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mission">Missão</SelectItem>
              <SelectItem value="building">Construção</SelectItem>
              <SelectItem value="charity">Caridade</SelectItem>
              <SelectItem value="general">Geral</SelectItem>
              <SelectItem value="event">Evento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Data de Início</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="endDate">Data de Fim (opcional)</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="isRecurring"
          checked={formData.isRecurring}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
        />
        <Label htmlFor="isRecurring">Campanha recorrente</Label>
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
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {campaign ? 'Salvar Alterações' : 'Criar Campanha'}
        </Button>
      </div>
    </form>
  );
}

// Componente de formulário para doações
interface DonationFormProps {
  campaign: DonationCampaign;
  onSubmit: (donation: Donation) => void;
  onCancel: () => void;
}

function DonationForm({ campaign, onSubmit, onCancel }: DonationFormProps) {
  const [formData, setFormData] = useState({
    donorName: '',
    donorEmail: '',
    amount: 0,
    type: 'one-time' as const,
    paymentMethod: 'credit-card' as const,
    anonymous: false,
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDonation: Omit<Donation, 'id' | 'status' | 'date' | 'isVerified'> = {
      campaignId: campaign.id,
      donorName: formData.anonymous ? 'Anônimo' : formData.donorName,
      donorEmail: formData.anonymous ? undefined : formData.donorEmail,
      amount: formData.amount,
      currency: campaign.currency,
      type: formData.type,
      paymentMethod: formData.paymentMethod,
      anonymous: formData.anonymous,
      message: formData.message
    };
    onSubmit(newDonation);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-medium mb-2">{campaign.title}</h3>
        <p className="text-sm text-muted-foreground">
          Meta: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(campaign.goal)}
        </p>
        <p className="text-sm text-muted-foreground">
          Arrecadado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(campaign.raised)}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="anonymous"
          checked={formData.anonymous}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: checked }))}
        />
        <Label htmlFor="anonymous">Doação anônima</Label>
      </div>
      
      {!formData.anonymous && (
        <>
          <div>
            <Label htmlFor="donorName">Seu Nome</Label>
            <Input
              id="donorName"
              value={formData.donorName}
              onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="donorEmail">Email (opcional)</Label>
            <Input
              id="donorEmail"
              type="email"
              value={formData.donorEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, donorEmail: e.target.value }))}
            />
          </div>
        </>
      )}
      
      <div>
        <Label htmlFor="amount">Valor da Doação (R$)</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
          min="1"
          step="1"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Doação</Label>
          <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one-time">Única</SelectItem>
              <SelectItem value="recurring">Recorrente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="paymentMethod">Método de Pagamento</Label>
          <Select value={formData.paymentMethod} onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credit-card">Cartão de Crédito</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="bank-transfer">Transferência Bancária</SelectItem>
              <SelectItem value="cash">Dinheiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="message">Mensagem (opcional)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Deixe uma mensagem de apoio..."
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Confirmar Doação
        </Button>
      </div>
    </form>
  );
}