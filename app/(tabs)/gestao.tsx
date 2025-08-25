import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Users, ChartBar as BarChart3, User, Plus, Crown, Calendar, Phone, Mail, MapPin, Palette, Bell, Shield, CircleHelp as HelpCircle } from 'lucide-react-native';

interface Membro {
  id: string;
  nome: string;
  ministerio: string;
  telefone: string;
  email: string;
  aniversario: string;
  sacramentos: string[];
}

const membrosExemplo: Membro[] = [
  {
    id: '1',
    nome: 'Maria Santos',
    ministerio: 'Catequese',
    telefone: '(11) 99999-9999',
    email: 'maria@email.com',
    aniversario: '15/03',
    sacramentos: ['Batismo', 'Primeira Comunhão', 'Crisma']
  },
  {
    id: '2',
    nome: 'João Silva',
    ministerio: 'Coral',
    telefone: '(11) 88888-8888',
    email: 'joao@email.com',
    aniversario: '22/07',
    sacramentos: ['Batismo', 'Primeira Comunhão']
  }
];

export default function GestaoScreen() {
  const [activeTab, setActiveTab] = useState<'membros' | 'relatorios' | 'configuracoes'>('membros');
  const [membros, setMembros] = useState<Membro[]>(membrosExemplo);
  const [modalVisible, setModalVisible] = useState(false);
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const [novoMembro, setNovoMembro] = useState({
    nome: '',
    ministerio: '',
    telefone: '',
    email: '',
    aniversario: ''
  });

  const adicionarMembro = () => {
    if (!novoMembro.nome || !novoMembro.telefone) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    const membro: Membro = {
      id: Date.now().toString(),
      ...novoMembro,
      sacramentos: []
    };

    setMembros([...membros, membro]);
    setModalVisible(false);
    setNovoMembro({
      nome: '',
      ministerio: '',
      telefone: '',
      email: '',
      aniversario: ''
    });
    Alert.alert('Sucesso', 'Membro adicionado com sucesso!');
  };

  const renderMembros = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.membrosHeader}>
        <Text style={styles.sectionTitle}>
          Membros Cadastrados ({membros.length})
        </Text>
        <TouchableOpacity
          style={styles.addMemberButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addMemberText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      
      {membros.map((membro) => (
        <View key={membro.id} style={styles.membroCard}>
          <View style={styles.membroHeader}>
            <View style={styles.membroAvatar}>
              <User size={20} color="#6B7280" />
            </View>
            <View style={styles.membroInfo}>
              <Text style={styles.membroNome}>{membro.nome}</Text>
              <Text style={styles.membroMinisterio}>{membro.ministerio}</Text>
            </View>
          </View>
          
          <View style={styles.membroDetalhes}>
            <View style={styles.detalheItem}>
              <Phone size={14} color="#6B7280" />
              <Text style={styles.detalheText}>{membro.telefone}</Text>
            </View>
            
            {membro.email && (
              <View style={styles.detalheItem}>
                <Mail size={14} color="#6B7280" />
                <Text style={styles.detalheText}>{membro.email}</Text>
              </View>
            )}
            
            <View style={styles.detalheItem}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.detalheText}>Aniversário: {membro.aniversario}</Text>
            </View>
            
            {membro.sacramentos.length > 0 && (
              <View style={styles.sacramentosContainer}>
                <Text style={styles.sacramentosLabel}>Sacramentos:</Text>
                <View style={styles.sacramentosList}>
                  {membro.sacramentos.map((sacramento, index) => (
                    <View key={index} style={styles.sacramentoTag}>
                      <Text style={styles.sacramentoText}>{sacramento}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderRelatorios = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Relatórios e Estatísticas</Text>
      
      <View style={styles.relatorioCard}>
        <View style={styles.relatorioHeader}>
          <BarChart3 size={24} color="#059669" />
          <Text style={styles.relatorioTitulo}>Resumo do Mês</Text>
        </View>
        
        <View style={styles.estatisticas}>
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaLabel}>Eventos realizados:</Text>
            <Text style={styles.estatisticaValor}>12</Text>
          </View>
          
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaLabel}>Doações recebidas:</Text>
            <Text style={styles.estatisticaValor}>R$ 8.750</Text>
          </View>
          
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaLabel}>Rifas ativas:</Text>
            <Text style={styles.estatisticaValor}>3</Text>
          </View>
          
          <View style={styles.estatisticaItem}>
            <Text style={styles.estatisticaLabel}>Pedidos de oração:</Text>
            <Text style={styles.estatisticaValor}>47</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.premiumButton}>
        <Crown size={20} color="#F59E0B" />
        <Text style={styles.premiumText}>Upgrade para Premium</Text>
        <Text style={styles.premiumSubText}>
          Relatórios avançados e mais funcionalidades
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderConfiguracoes = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Configurações da Paróquia</Text>
      
      {/* Informações da Igreja */}
      <View style={styles.configCard}>
        <View style={styles.configHeader}>
          <MapPin size={20} color="#1E40AF" />
          <Text style={styles.configTitulo}>Informações da Igreja</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoValue}>Paróquia Nossa Senhora Aparecida</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Endereço:</Text>
          <Text style={styles.infoValue}>Rua das Flores, 123 - Centro</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Responsável:</Text>
          <Text style={styles.infoValue}>Padre João Santos</Text>
        </View>
        
        <TouchableOpacity style={styles.editarButton}>
          <Text style={styles.editarText}>Editar Informações</Text>
        </TouchableOpacity>
      </View>
      
      {/* Preferências */}
      <View style={styles.configCard}>
        <View style={styles.configHeader}>
          <Palette size={20} color="#7C3AED" />
          <Text style={styles.configTitulo}>Aparência</Text>
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Tema escuro</Text>
          <Switch
            value={temaEscuro}
            onValueChange={setTemaEscuro}
            trackColor={{ false: '#E5E7EB', true: '#1E40AF' }}
            thumbColor={temaEscuro ? '#FFFFFF' : '#F3F4F6'}
          />
        </View>
      </View>
      
      {/* Notificações */}
      <View style={styles.configCard}>
        <View style={styles.configHeader}>
          <Bell size={20} color="#F59E0B" />
          <Text style={styles.configTitulo}>Notificações</Text>
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Notificações push</Text>
          <Switch
            value={notificacoes}
            onValueChange={setNotificacoes}
            trackColor={{ false: '#E5E7EB', true: '#1E40AF' }}
            thumbColor={notificacoes ? '#FFFFFF' : '#F3F4F6'}
          />
        </View>
      </View>
      
      {/* Ajuda */}
      <TouchableOpacity style={styles.ajudaButton}>
        <HelpCircle size={20} color="#6B7280" />
        <Text style={styles.ajudaText}>Central de Ajuda</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6B7280', '#9CA3AF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gestão Paroquial</Text>
          <Text style={styles.headerSubtitle}>Administração da igreja</Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: 'membros', label: 'Membros', icon: Users },
          { key: 'relatorios', label: 'Relatórios', icon: BarChart3 },
          { key: 'configuracoes', label: 'Configurações', icon: Settings }
        ].map(({ key, label, icon: Icon }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tab,
              activeTab === key && styles.tabAtiva
            ]}
            onPress={() => setActiveTab(key as any)}
          >
            <Icon 
              size={18} 
              color={activeTab === key ? '#1E40AF' : '#6B7280'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === key && styles.tabTextoAtivo
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conteúdo das Tabs */}
      {activeTab === 'membros' && renderMembros()}
      {activeTab === 'relatorios' && renderRelatorios()}
      {activeTab === 'configuracoes' && renderConfiguracoes()}

      {/* Modal Novo Membro */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelarText}>Cancelar</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Novo Membro</Text>
            
            <TouchableOpacity onPress={adicionarMembro}>
              <Text style={styles.salvarText}>Salvar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome Completo *</Text>
              <TextInput
                style={styles.input}
                value={novoMembro.nome}
                onChangeText={(text) => setNovoMembro({...novoMembro, nome: text})}
                placeholder="Nome do membro"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ministério</Text>
              <TextInput
                style={styles.input}
                value={novoMembro.ministerio}
                onChangeText={(text) => setNovoMembro({...novoMembro, ministerio: text})}
                placeholder="Ex: Coral, Catequese, Liturgia"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone *</Text>
              <TextInput
                style={styles.input}
                value={novoMembro.telefone}
                onChangeText={(text) => setNovoMembro({...novoMembro, telefone: text})}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={novoMembro.email}
                onChangeText={(text) => setNovoMembro({...novoMembro, email: text})}
                placeholder="email@exemplo.com"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Aniversário</Text>
              <TextInput
                style={styles.input}
                value={novoMembro.aniversario}
                onChangeText={(text) => setNovoMembro({...novoMembro, aniversario: text})}
                placeholder="DD/MM"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    fontWeight: '400',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabAtiva: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextoAtivo: {
    color: '#1E40AF',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  membrosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addMemberButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addMemberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  membroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  membroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  membroAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  membroInfo: {
    flex: 1,
  },
  membroNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  membroMinisterio: {
    fontSize: 14,
    color: '#6B7280',
  },
  membroDetalhes: {
    gap: 8,
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detalheText: {
    fontSize: 14,
    color: '#4B5563',
  },
  sacramentosContainer: {
    marginTop: 8,
  },
  sacramentosLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  sacramentosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  sacramentoTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sacramentoText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '500',
  },
  relatorioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  relatorioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  relatorioTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  estatisticas: {
    gap: 16,
  },
  estatisticaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estatisticaLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  estatisticaValor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  premiumButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  premiumText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginTop: 8,
  },
  premiumSubText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    marginTop: 4,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  configTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  editarButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  editarText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  ajudaButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  ajudaText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelarText: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  salvarText: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
  },
  modalForm: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
});