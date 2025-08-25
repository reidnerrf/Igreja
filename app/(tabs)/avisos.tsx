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
import { Bell, Plus, Clock, Pin, Eye, CreditCard as Edit, CircleAlert as AlertCircle, Info, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: 'urgente' | 'informativo' | 'evento';
  data: string;
  autor: string;
  fixado: boolean;
  visualizacoes: number;
  imagem?: string;
}

const avisosExemplo: Aviso[] = [
  {
    id: '1',
    titulo: 'Mudança no Horário das Missas',
    conteudo: 'A partir de segunda-feira (20/01), o horário da missa das 18h será alterado para 19h devido às obras na igreja. Pedimos compreensão de todos os fiéis.',
    tipo: 'urgente',
    data: '2025-01-18',
    autor: 'Padre João',
    fixado: true,
    visualizacoes: 234,
    imagem: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    titulo: 'Inscrições para Primeira Comunhão',
    conteudo: 'Estão abertas as inscrições para a catequese de Primeira Comunhão. As aulas começam em fevereiro. Inscrições na secretaria paroquial.',
    tipo: 'informativo',
    data: '2025-01-17',
    autor: 'Secretaria',
    fixado: false,
    visualizacoes: 156
  },
  {
    id: '3',
    titulo: 'Festa de São Sebastião - 20 de Janeiro',
    conteudo: 'Convidamos toda a comunidade para a festa de São Sebastião. Haverá missa solene às 19h seguida de confraternização no salão paroquial.',
    tipo: 'evento',
    data: '2025-01-16',
    autor: 'Comissão de Festas',
    fixado: false,
    visualizacoes: 89,
    imagem: 'https://images.pexels.com/photos/6629766/pexels-photo-6629766.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const tipoIcons = {
  urgente: AlertCircle,
  informativo: Info,
  evento: CheckCircle
};

const tipoColors = {
  urgente: { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' },
  informativo: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  evento: { bg: '#ECFDF5', text: '#059669', border: '#6EE7B7' }
};

export default function AvisosScreen() {
  const [avisos, setAvisos] = useState<Aviso[]>(avisosExemplo);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoAviso, setNovoAviso] = useState({
    titulo: '',
    conteudo: '',
    tipo: 'informativo' as Aviso['tipo']
  });

  const adicionarAviso = () => {
    if (!novoAviso.titulo || !novoAviso.conteudo) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const aviso: Aviso = {
      id: Date.now().toString(),
      ...novoAviso,
      data: new Date().toISOString().split('T')[0],
      autor: 'Administrador',
      fixado: false,
      visualizacoes: 0
    };

    setAvisos([aviso, ...avisos]);
    setModalVisible(false);
    setNovoAviso({
      titulo: '',
      conteudo: '',
      tipo: 'informativo'
    });
    Alert.alert('Sucesso', 'Aviso publicado com sucesso!');
  };

  const toggleFixar = (id: string) => {
    setAvisos(avisos.map(aviso => 
      aviso.id === id ? { ...aviso, fixado: !aviso.fixado } : aviso
    ));
  };

  const avisosOrdenados = [...avisos].sort((a, b) => {
    if (a.fixado && !b.fixado) return -1;
    if (!a.fixado && b.fixado) return 1;
    return new Date(b.data).getTime() - new Date(a.data).getTime();
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#DC2626', '#EF4444']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Avisos Paroquiais</Text>
          <Text style={styles.headerSubtitle}>Comunicados e notícias</Text>
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
          <Bell size={20} color="#DC2626" />
          <Text style={styles.statNumber}>{avisos.length}</Text>
          <Text style={styles.statLabel}>Total de Avisos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Pin size={20} color="#F59E0B" />
          <Text style={styles.statNumber}>
            {avisos.filter(a => a.fixado).length}
          </Text>
          <Text style={styles.statLabel}>Fixados</Text>
        </View>
        
        <View style={styles.statCard}>
          <Eye size={20} color="#059669" />
          <Text style={styles.statNumber}>
            {avisos.reduce((acc, aviso) => acc + aviso.visualizacoes, 0)}
          </Text>
          <Text style={styles.statLabel}>Visualizações</Text>
        </View>
      </View>

      {/* Lista de Avisos */}
      <ScrollView style={styles.avisosContainer} showsVerticalScrollIndicator={false}>
        {avisosOrdenados.map((aviso) => {
          const IconComponent = tipoIcons[aviso.tipo];
          const colors = tipoColors[aviso.tipo];
          
          return (
            <View key={aviso.id} style={styles.avisoCard}>
              {aviso.fixado && (
                <View style={styles.fixadoHeader}>
                  <Pin size={14} color="#F59E0B" />
                  <Text style={styles.fixadoText}>FIXADO</Text>
                </View>
              )}
              
              {aviso.imagem && (
                <Image source={{ uri: aviso.imagem }} style={styles.avisoImagem} />
              )}
              
              <View style={styles.avisoContent}>
                <View style={styles.avisoHeader}>
                  <View style={[
                    styles.tipoTag,
                    { 
                      backgroundColor: colors.bg,
                      borderColor: colors.border
                    }
                  ]}>
                    <IconComponent size={12} color={colors.text} />
                    <Text style={[styles.tipoText, { color: colors.text }]}>
                      {aviso.tipo.toUpperCase()}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.fixarButton}
                    onPress={() => toggleFixar(aviso.id)}
                  >
                    <Pin 
                      size={16} 
                      color={aviso.fixado ? '#F59E0B' : '#6B7280'} 
                    />
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.avisoTitulo}>{aviso.titulo}</Text>
                <Text style={styles.avisoConteudo}>{aviso.conteudo}</Text>
                
                <View style={styles.avisoFooter}>
                  <View style={styles.autorInfo}>
                    <Text style={styles.autorText}>Por {aviso.autor}</Text>
                    <View style={styles.dataInfo}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.dataText}>
                        {new Date(aviso.data).toLocaleDateString('pt-BR')}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.visualizacoesInfo}>
                    <Eye size={14} color="#6B7280" />
                    <Text style={styles.visualizacoesText}>
                      {aviso.visualizacoes}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal Novo Aviso */}
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
            
            <Text style={styles.modalTitle}>Novo Aviso</Text>
            
            <TouchableOpacity onPress={adicionarAviso}>
              <Text style={styles.salvarText}>Publicar</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título *</Text>
              <TextInput
                style={styles.input}
                value={novoAviso.titulo}
                onChangeText={(text) => setNovoAviso({...novoAviso, titulo: text})}
                placeholder="Título do aviso"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo</Text>
              <View style={styles.tipoSelector}>
                {(['informativo', 'urgente', 'evento'] as const).map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoOption,
                      novoAviso.tipo === tipo && styles.tipoSelecionado
                    ]}
                    onPress={() => setNovoAviso({...novoAviso, tipo})}
                  >
                    <Text style={[
                      styles.tipoOptionText,
                      novoAviso.tipo === tipo && styles.tipoSelecionadoText
                    ]}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Conteúdo *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoAviso.conteudo}
                onChangeText={(text) => setNovoAviso({...novoAviso, conteudo: text})}
                placeholder="Escreva o conteúdo do aviso..."
                multiline
                numberOfLines={6}
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
    color: '#FECACA',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  avisosContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avisoCard: {
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
  fixadoHeader: {
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  fixadoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  avisoImagem: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  avisoContent: {
    padding: 16,
  },
  avisoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  tipoText: {
    fontSize: 10,
    fontWeight: '600',
  },
  fixarButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  avisoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  avisoConteudo: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  avisoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  autorInfo: {
    flex: 1,
  },
  autorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  dataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dataText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  visualizacoesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  visualizacoesText: {
    fontSize: 12,
    color: '#6B7280',
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
    color: '#DC2626',
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
    height: 120,
    textAlignVertical: 'top',
  },
  tipoSelector: {
    flexDirection: 'row',
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
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
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