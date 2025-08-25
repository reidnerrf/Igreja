import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MessageCircle, 
  Plus, 
  User,
  Clock,
  Heart,
  Check
} from 'lucide-react-native';

interface PedidoOracao {
  id: string;
  nome: string;
  intencao: string;
  comentario?: string;
  data: string;
  status: 'pendente' | 'orando' | 'atendido';
}

const pedidosExemplo: PedidoOracao[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    intencao: 'Pela cura da minha mãe',
    comentario: 'Minha mãe está internada e precisa de orações para se recuperar rapidamente',
    data: '2025-01-19',
    status: 'orando'
  },
  {
    id: '2',
    nome: 'João Santos',
    intencao: 'Por uma nova oportunidade de trabalho',
    data: '2025-01-18',
    status: 'pendente'
  },
  {
    id: '3',
    nome: 'Ana Costa',
    intencao: 'Pela paz na família',
    comentario: 'Pedindo a intercessão de Nossa Senhora para harmonizar nossa família',
    data: '2025-01-17',
    status: 'atendido'
  }
];

const statusColors = {
  pendente: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  orando: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  atendido: { bg: '#ECFDF5', text: '#059669', border: '#6EE7B7' }
};

const statusLabels = {
  pendente: 'Pendente',
  orando: 'Em Oração',
  atendido: 'Atendido'
};

export default function OracoesScreen() {
  const [pedidos, setPedidos] = useState<PedidoOracao[]>(pedidosExemplo);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoPedido, setNovoPedido] = useState({
    nome: '',
    intencao: '',
    comentario: ''
  });

  const adicionarPedido = () => {
    if (!novoPedido.nome || !novoPedido.intencao) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    const pedido: PedidoOracao = {
      id: Date.now().toString(),
      ...novoPedido,
      data: new Date().toISOString().split('T')[0],
      status: 'pendente'
    };

    setPedidos([pedido, ...pedidos]);
    setModalVisible(false);
    setNovoPedido({ nome: '', intencao: '', comentario: '' });
    Alert.alert('Sucesso', 'Seu pedido de oração foi enviado!');
  };

  const atualizarStatus = (id: string, novoStatus: PedidoOracao['status']) => {
    setPedidos(pedidos.map(p => 
      p.id === id ? { ...p, status: novoStatus } : p
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Pedidos de Oração</Text>
          <Text style={styles.headerSubtitle}>Intenções da comunidade</Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {pedidos.filter(p => p.status === 'orando').length}
          </Text>
          <Text style={styles.statLabel}>Em Oração</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {pedidos.filter(p => p.status === 'atendido').length}
          </Text>
          <Text style={styles.statLabel}>Atendidos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{pedidos.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Lista de Pedidos */}
      <ScrollView style={styles.pedidosContainer} showsVerticalScrollIndicator={false}>
        {pedidos.map((pedido) => (
          <View key={pedido.id} style={styles.pedidoCard}>
            <View style={styles.pedidoHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <User size={16} color="#6B7280" />
                </View>
                <Text style={styles.userName}>{pedido.nome}</Text>
              </View>
              
              <View style={[
                styles.statusTag,
                { 
                  backgroundColor: statusColors[pedido.status].bg,
                  borderColor: statusColors[pedido.status].border
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: statusColors[pedido.status].text }
                ]}>
                  {statusLabels[pedido.status]}
                </Text>
              </View>
            </View>
            
            <Text style={styles.intencaoTitulo}>Intenção:</Text>
            <Text style={styles.intencaoTexto}>{pedido.intencao}</Text>
            
            {pedido.comentario && (
              <>
                <Text style={styles.comentarioTitulo}>Comentário:</Text>
                <Text style={styles.comentarioTexto}>{pedido.comentario}</Text>
              </>
            )}
            
            <View style={styles.pedidoFooter}>
              <View style={styles.dataInfo}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.dataText}>
                  {new Date(pedido.data).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              
              <View style={styles.acoesPedido}>
                {pedido.status === 'pendente' && (
                  <TouchableOpacity
                    style={styles.acaoButton}
                    onPress={() => atualizarStatus(pedido.id, 'orando')}
                  >
                    <Heart size={16} color="#1E40AF" />
                  </TouchableOpacity>
                )}
                
                {pedido.status === 'orando' && (
                  <TouchableOpacity
                    style={styles.acaoButton}
                    onPress={() => atualizarStatus(pedido.id, 'atendido')}
                  >
                    <Check size={16} color="#059669" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal Novo Pedido */}
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
            
            <Text style={styles.modalTitle}>Novo Pedido</Text>
            
            <TouchableOpacity onPress={adicionarPedido}>
              <Text style={styles.salvarText}>Enviar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome *</Text>
              <TextInput
                style={styles.input}
                value={novoPedido.nome}
                onChangeText={(text) => setNovoPedido({...novoPedido, nome: text})}
                placeholder="Seu nome"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Intenção *</Text>
              <TextInput
                style={styles.input}
                value={novoPedido.intencao}
                onChangeText={(text) => setNovoPedido({...novoPedido, intencao: text})}
                placeholder="Para que você gostaria que orássemos?"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Comentário (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoPedido.comentario}
                onChangeText={(text) => setNovoPedido({...novoPedido, comentario: text})}
                placeholder="Compartilhe mais detalhes se desejar..."
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.avisoContainer}>
              <Text style={styles.avisoText}>
                Seu pedido será compartilhado com a comunidade para orações em conjunto.
              </Text>
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
    color: '#A7F3D0',
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  pedidosContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pedidoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
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
  intencaoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 4,
  },
  intencaoTexto: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 8,
  },
  comentarioTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  comentarioTexto: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  pedidoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dataText: {
    fontSize: 12,
    color: '#6B7280',
  },
  acoesPedido: {
    flexDirection: 'row',
    gap: 8,
  },
  acaoButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
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
    color: '#059669',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  avisoContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  avisoText: {
    fontSize: 14,
    color: '#1E40AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});