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
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Filter,
  Bell
} from 'lucide-react-native';

interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  tipo: 'missa' | 'novena' | 'terco' | 'retiro' | 'festa';
  descricao: string;
}

const eventosExemplo: Evento[] = [
  {
    id: '1',
    titulo: 'Santa Missa Dominical',
    data: '2025-01-19',
    hora: '10:00',
    local: 'Igreja Principal',
    tipo: 'missa',
    descricao: 'Missa com bênção das crianças'
  },
  {
    id: '2',
    titulo: 'Novena de Nossa Senhora',
    data: '2025-01-20',
    hora: '19:30',
    local: 'Capela Lateral',
    tipo: 'novena',
    descricao: 'Novena mensal de Nossa Senhora Aparecida'
  },
  {
    id: '3',
    titulo: 'Terço dos Homens',
    data: '2025-01-21',
    hora: '06:00',
    local: 'Salão Paroquial',
    tipo: 'terco',
    descricao: 'Encontro mensal do Terço dos Homens'
  }
];

const tipoColors = {
  missa: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  novena: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  terco: { bg: '#F3E8FF', text: '#7C3AED', border: '#C4B5FD' },
  retiro: { bg: '#ECFDF5', text: '#059669', border: '#6EE7B7' },
  festa: { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' }
};

export default function AgendaScreen() {
  const [eventos, setEventos] = useState<Evento[]>(eventosExemplo);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<'hoje' | 'semana' | 'mes'>('semana');
  const [novoEvento, setNovoEvento] = useState({
    titulo: '',
    data: '',
    hora: '',
    local: '',
    tipo: 'missa' as Evento['tipo'],
    descricao: ''
  });

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const adicionarEvento = () => {
    if (!novoEvento.titulo || !novoEvento.data || !novoEvento.hora) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    const evento: Evento = {
      id: Date.now().toString(),
      ...novoEvento
    };

    setEventos([...eventos, evento]);
    setModalVisible(false);
    setNovoEvento({
      titulo: '',
      data: '',
      hora: '',
      local: '',
      tipo: 'missa',
      descricao: ''
    });
    Alert.alert('Sucesso', 'Evento adicionado à agenda!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Agenda Paroquial</Text>
          <Text style={styles.headerSubtitle}>Eventos e celebrações</Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {(['hoje', 'semana', 'mes'] as const).map((filtro) => (
          <TouchableOpacity
            key={filtro}
            style={[
              styles.filtroButton,
              filtroAtivo === filtro && styles.filtroAtivo
            ]}
            onPress={() => setFiltroAtivo(filtro)}
          >
            <Text style={[
              styles.filtroText,
              filtroAtivo === filtro && styles.filtroTextoAtivo
            ]}>
              {filtro === 'hoje' ? 'Hoje' : 
               filtro === 'semana' ? 'Semana' : 'Mês'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de Eventos */}
      <ScrollView style={styles.eventosContainer} showsVerticalScrollIndicator={false}>
        {eventos.map((evento) => (
          <View key={evento.id} style={styles.eventoCard}>
            <View style={styles.eventoHeader}>
              <View style={[
                styles.tipoTag,
                { 
                  backgroundColor: tipoColors[evento.tipo].bg,
                  borderColor: tipoColors[evento.tipo].border
                }
              ]}>
                <Text style={[
                  styles.tipoText,
                  { color: tipoColors[evento.tipo].text }
                ]}>
                  {evento.tipo.toUpperCase()}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.lembreteButton}>
                <Bell size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.eventoTitulo}>{evento.titulo}</Text>
            
            <View style={styles.eventoInfo}>
              <View style={styles.infoRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.infoText}>
                  {formatarData(evento.data)}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.infoText}>{evento.hora}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.infoText}>{evento.local}</Text>
              </View>
            </View>
            
            {evento.descricao ? (
              <Text style={styles.eventoDescricao}>{evento.descricao}</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>

      {/* Modal Adicionar Evento */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelarText}>Cancelar</Text>
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Novo Evento</Text>
            
            <TouchableOpacity onPress={adicionarEvento}>
              <Text style={styles.salvarText}>Salvar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título *</Text>
              <TextInput
                style={styles.input}
                value={novoEvento.titulo}
                onChangeText={(text) => setNovoEvento({...novoEvento, titulo: text})}
                placeholder="Nome do evento"
              />
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Data *</Text>
                <TextInput
                  style={styles.input}
                  value={novoEvento.data}
                  onChangeText={(text) => setNovoEvento({...novoEvento, data: text})}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Hora *</Text>
                <TextInput
                  style={styles.input}
                  value={novoEvento.hora}
                  onChangeText={(text) => setNovoEvento({...novoEvento, hora: text})}
                  placeholder="HH:MM"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Local</Text>
              <TextInput
                style={styles.input}
                value={novoEvento.local}
                onChangeText={(text) => setNovoEvento({...novoEvento, local: text})}
                placeholder="Local do evento"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo</Text>
              <View style={styles.tipoSelector}>
                {(['missa', 'novena', 'terco', 'retiro', 'festa'] as const).map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoOption,
                      novoEvento.tipo === tipo && styles.tipoSelecionado
                    ]}
                    onPress={() => setNovoEvento({...novoEvento, tipo})}
                  >
                    <Text style={[
                      styles.tipoOptionText,
                      novoEvento.tipo === tipo && styles.tipoSelecionadoText
                    ]}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoEvento.descricao}
                onChangeText={(text) => setNovoEvento({...novoEvento, descricao: text})}
                placeholder="Descrição opcional do evento"
                multiline
                numberOfLines={3}
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
    color: '#BFDBFE',
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filtroAtivo: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },
  eventosContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventoCard: {
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
  eventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipoTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipoText: {
    fontSize: 10,
    fontWeight: '600',
  },
  lembreteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  eventoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  eventoInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  eventoDescricao: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 12,
    fontStyle: 'italic',
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
  inputRow: {
    flexDirection: 'row',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tipoSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipoSelecionado: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  tipoOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tipoSelecionadoText: {
    color: '#FFFFFF',
  },
});