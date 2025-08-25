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
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Gift, 
  Plus, 
  Ticket,
  Clock,
  Users,
  Trophy,
  DollarSign
} from 'lucide-react-native';
import { useTheme, tokens } from '@/constants/theme';
import PressableScale from '@/components/PressableScale';

interface Rifa {
  id: string;
  titulo: string;
  descricao: string;
  premio: string;
  valorNumero: number;
  totalNumeros: number;
  vendidos: number;
  dataInicio: string;
  dataFim: string;
  imagem: string;
  status: 'ativa' | 'finalizada' | 'em-breve';
}

const rifasExemplo: Rifa[] = [
  {
    id: '1',
    titulo: 'Rifa do Natal - Ceia Completa',
    descricao: 'Rifa beneficente para arrecadar fundos para o Natal dos necessitados',
    premio: 'Ceia de Natal + R$ 500 em vale-compras',
    valorNumero: 10,
    totalNumeros: 100,
    vendidos: 67,
    dataInicio: '2025-01-01',
    dataFim: '2025-02-15',
    imagem: 'https://images.pexels.com/photos/6287497/pexels-photo-6287497.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'ativa'
  },
  {
    id: '2',
    titulo: 'Rifa da Festa Junina',
    descricao: 'Grande rifa da tradicional festa junina da paróquia',
    premio: 'Smart TV 55" + R$ 1.000',
    valorNumero: 20,
    totalNumeros: 200,
    vendidos: 134,
    dataInicio: '2025-01-10',
    dataFim: '2025-03-01',
    imagem: 'https://images.pexels.com/photos/1708600/pexels-photo-1708600.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'ativa'
  },
  {
    id: '3',
    titulo: 'Rifa do Mês das Crianças',
    descricao: 'Rifa especial para celebrar o Dia das Crianças',
    premio: 'Bicicleta + Kit de brinquedos',
    valorNumero: 5,
    totalNumeros: 150,
    vendidos: 150,
    dataInicio: '2024-09-01',
    dataFim: '2024-10-12',
    imagem: 'https://images.pexels.com/photos/1104007/pexels-photo-1104007.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'finalizada'
  }
];

const statusColors = {
  ativa: { bg: '#ECFDF5', text: '#059669', border: '#6EE7B7' },
  finalizada: { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' },
  'em-breve': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }
};

export default function RifasScreen() {
  const theme = useTheme();
  const [rifas, setRifas] = useState<Rifa[]>(rifasExemplo);
  const [modalVisible, setModalVisible] = useState(false);
  const [novaRifa, setNovaRifa] = useState({
    titulo: '',
    descricao: '',
    premio: '',
    valorNumero: '',
    totalNumeros: '',
    dataFim: ''
  });

  const calcularProgresso = (vendidos: number, total: number) => {
    return Math.round((vendidos / total) * 100);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const criarRifa = () => {
    if (!novaRifa.titulo || !novaRifa.premio || !novaRifa.valorNumero || !novaRifa.totalNumeros) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const rifa: Rifa = {
      id: Date.now().toString(),
      titulo: novaRifa.titulo,
      descricao: novaRifa.descricao,
      premio: novaRifa.premio,
      valorNumero: parseFloat(novaRifa.valorNumero),
      totalNumeros: parseInt(novaRifa.totalNumeros),
      vendidos: 0,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: novaRifa.dataFim,
      imagem: 'https://images.pexels.com/photos/1666065/pexels-photo-1666065.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'ativa'
    };

    setRifas([rifa, ...rifas]);
    setModalVisible(false);
    setNovaRifa({
      titulo: '',
      descricao: '',
      premio: '',
      valorNumero: '',
      totalNumeros: '',
      dataFim: ''
    });
    Alert.alert('Sucesso', 'Rifa criada com sucesso!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[tokens.blue[700], tokens.blue[500]]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Rifas & Sorteios</Text>
          <Text style={styles.headerSubtitle}>Ações beneficentes</Text>
        </View>
        
        <PressableScale
          style={[styles.addButton, { borderRadius: theme.radius.md }]}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </PressableScale>
      </LinearGradient>

      {/* Resumo de Rifas */}
      <View style={styles.resumoContainer}>
        <View style={[styles.resumoCard, { backgroundColor: theme.colors.surface }]}>
          <Gift size={24} color={tokens.blue[700]} />
          <Text style={[styles.resumoNumero, { color: theme.colors.text }]}>
            {rifas.filter(r => r.status === 'ativa').length}
          </Text>
          <Text style={[styles.resumoLabel, { color: theme.colors.subtleText }]}>Ativas</Text>
        </View>
        
        <View style={[styles.resumoCard, { backgroundColor: theme.colors.surface }]}>
          <Trophy size={24} color="#F59E0B" />
          <Text style={[styles.resumoNumero, { color: theme.colors.text }]}>
            {rifas.filter(r => r.status === 'finalizada').length}
          </Text>
          <Text style={[styles.resumoLabel, { color: theme.colors.subtleText }]}>Finalizadas</Text>
        </View>
        
        <View style={[styles.resumoCard, { backgroundColor: theme.colors.surface }]}>
          <DollarSign size={24} color={tokens.emerald[600]} />
          <Text style={[styles.resumoNumero, { color: theme.colors.text }]}>
            {rifas.reduce((acc, rifa) => acc + (rifa.vendidos * rifa.valorNumero), 0).toFixed(0)}
          </Text>
          <Text style={[styles.resumoLabel, { color: theme.colors.subtleText }]}>Arrecadado</Text>
        </View>
      </View>

      {/* Lista de Rifas */}
      <ScrollView style={styles.rifasContainer} showsVerticalScrollIndicator={false}>
        {rifas.map((rifa) => (
          <View key={rifa.id} style={[styles.rifaCard, { backgroundColor: theme.colors.surface }]}>
            <Image source={{ uri: rifa.imagem }} style={styles.rifaImagem} />
            
            <View style={styles.rifaContent}>
              <View style={styles.rifaHeader}>
                <View style={[
                  styles.statusTag,
                  { 
                    backgroundColor: statusColors[rifa.status].bg,
                    borderColor: statusColors[rifa.status].border
                  }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: statusColors[rifa.status].text }
                  ]}>
                    {rifa.status.toUpperCase().replace('-', ' ')}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.rifaTitulo, { color: theme.colors.text }]}>{rifa.titulo}</Text>
              <Text style={[styles.rifaDescricao, { color: theme.colors.subtleText }]}>{rifa.descricao}</Text>
              
              <View style={[styles.premioContainer, { backgroundColor: '#FEF3C7' }]}>
                <Trophy size={16} color="#F59E0B" />
                <Text style={styles.premioText}>{rifa.premio}</Text>
              </View>
              
              <View style={styles.rifaInfo}>
                <View style={styles.infoItem}>
                  <Ticket size={16} color={theme.colors.mutedForeground} />
                  <Text style={[styles.infoText, { color: theme.colors.mutedForeground }]}>
                    {formatarMoeda(rifa.valorNumero)} / número
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Users size={16} color={theme.colors.mutedForeground} />
                  <Text style={[styles.infoText, { color: theme.colors.mutedForeground }]}>
                    {rifa.vendidos}/{rifa.totalNumeros}
                  </Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Clock size={16} color={theme.colors.mutedForeground} />
                  <Text style={[styles.infoText, { color: theme.colors.mutedForeground }]}>
                    até {new Date(rifa.dataFim).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
              
              {/* Barra de Progresso */}
              <View style={styles.progressoContainer}>
                <View style={[styles.progressoBar, { backgroundColor: theme.colors.border }]}>
                  <View 
                    style={[
                      styles.progressoFill,
                      { width: `${calcularProgresso(rifa.vendidos, rifa.totalNumeros)}%`, backgroundColor: tokens.blue[700] }
                    ]}
                  />
                </View>
                <Text style={[styles.progressoText, { color: theme.colors.mutedForeground }]}>
                  {calcularProgresso(rifa.vendidos, rifa.totalNumeros)}% vendido
                </Text>
              </View>
              
              {rifa.status === 'ativa' && (
                <PressableScale style={[styles.comprarButton, { backgroundColor: tokens.blue[700] }]}>
                  <Ticket size={16} color="#FFFFFF" />
                  <Text style={styles.comprarText}>Comprar Números</Text>
                </PressableScale>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal Nova Rifa */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={[styles.cancelarText, { color: theme.colors.subtleText }]}>Cancelar</Text>
            </TouchableOpacity>
            
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Nova Rifa</Text>
            
            <TouchableOpacity onPress={criarRifa}>
              <Text style={[styles.salvarText, { color: tokens.blue[700] }]}>Criar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Título da Rifa *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={novaRifa.titulo}
                onChangeText={(text) => setNovaRifa({...novaRifa, titulo: text})}
                placeholder="Ex: Rifa do Dia das Mães"
                placeholderTextColor={theme.colors.mutedForeground}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={novaRifa.descricao}
                onChangeText={(text) => setNovaRifa({...novaRifa, descricao: text})}
                placeholder="Descreva o objetivo da rifa..."
                placeholderTextColor={theme.colors.mutedForeground}
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Prêmio *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={novaRifa.premio}
                onChangeText={(text) => setNovaRifa({...novaRifa, premio: text})}
                placeholder="Ex: Smart TV 55 polegadas"
                placeholderTextColor={theme.colors.mutedForeground}
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Valor por Número *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                  value={novaRifa.valorNumero}
                  onChangeText={(text) => setNovaRifa({...novaRifa, valorNumero: text})}
                  placeholder="10.00"
                  placeholderTextColor={theme.colors.mutedForeground}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Total de Números *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                  value={novaRifa.totalNumeros}
                  onChangeText={(text) => setNovaRifa({...novaRifa, totalNumeros: text})}
                  placeholder="100"
                  placeholderTextColor={theme.colors.mutedForeground}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Data do Sorteio *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
                value={novaRifa.dataFim}
                onChangeText={(text) => setNovaRifa({...novaRifa, dataFim: text})}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.mutedForeground}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E9D5FF',
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  resumoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  resumoNumero: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  resumoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  rifasContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  rifaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  rifaImagem: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  rifaContent: {
    padding: 16,
  },
  rifaHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  rifaTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  rifaDescricao: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  premioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  premioText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 8,
  },
  rifaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressoContainer: {
    marginBottom: 16,
  },
  progressoBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressoFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 4,
  },
  progressoText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  comprarButton: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  comprarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#7C3AED',
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
  inputRow: {
    flexDirection: 'row',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});