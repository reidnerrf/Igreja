import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CirclePlay as PlayCircle, Radio, Upload, Eye, Calendar, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Transmissao {
  id: string;
  titulo: string;
  tipo: 'ao-vivo' | 'gravada';
  thumbnail: string;
  visualizacoes: number;
  data: string;
  duracao?: string;
  url: string;
}

const transmissoesExemplo: Transmissao[] = [
  {
    id: '1',
    titulo: 'Santa Missa Dominical - 3º Domingo do Tempo Comum',
    tipo: 'ao-vivo',
    thumbnail: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=400',
    visualizacoes: 142,
    data: '2025-01-19',
    url: 'https://youtube.com/watch?v=example'
  },
  {
    id: '2',
    titulo: 'Novena Nossa Senhora Aparecida - Dia 7',
    tipo: 'gravada',
    thumbnail: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=400',
    visualizacoes: 89,
    data: '2025-01-18',
    duracao: '42:15',
    url: 'https://youtube.com/watch?v=example2'
  },
  {
    id: '3',
    titulo: 'Adoração ao Santíssimo Sacramento',
    tipo: 'gravada',
    thumbnail: 'https://images.pexels.com/photos/161154/chapel-church-architecture-building-161154.jpeg?auto=compress&cs=tinysrgb&w=400',
    visualizacoes: 67,
    data: '2025-01-17',
    duracao: '1:15:30',
    url: 'https://youtube.com/watch?v=example3'
  }
];

export default function TransmissoesScreen() {
  const [transmissoes, setTransmissoes] = useState<Transmissao[]>(transmissoesExemplo);
  const [filtro, setFiltro] = useState<'todas' | 'ao-vivo' | 'gravadas'>('todas');

  const transmissoesFiltradas = transmissoes.filter(t => 
    filtro === 'todas' || t.tipo === filtro.replace('ao-vivo', 'ao-vivo').replace('gravadas', 'gravada')
  );

  const formatarVisualizacoes = (num: number) => {
    if (num < 1000) return num.toString();
    return `${(num / 1000).toFixed(1)}k`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#A855F7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Transmissões</Text>
          <Text style={styles.headerSubtitle}>Missas e eventos ao vivo</Text>
        </View>
        
        <TouchableOpacity style={styles.uploadButton}>
          <Upload size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {(['todas', 'ao-vivo', 'gravadas'] as const).map((opcao) => (
          <TouchableOpacity
            key={opcao}
            style={[
              styles.filtroButton,
              filtro === opcao && styles.filtroAtivo
            ]}
            onPress={() => setFiltro(opcao)}
          >
            <Text style={[
              styles.filtroText,
              filtro === opcao && styles.filtroTextoAtivo
            ]}>
              {opcao === 'todas' ? 'Todas' : 
               opcao === 'ao-vivo' ? 'Ao Vivo' : 'Gravadas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transmissão em Destaque */}
      <View style={styles.destaqueContainer}>
        <Text style={styles.sectionTitle}>Em Destaque</Text>
        <TouchableOpacity style={styles.destaqueCard}>
          <Image 
            source={{ uri: transmissoes[0]?.thumbnail }}
            style={styles.destaqueThumbnail}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.destaqueOverlay}
          >
            <View style={styles.destaqueInfo}>
              {transmissoes[0]?.tipo === 'ao-vivo' && (
                <View style={styles.aoVivoTag}>
                  <Radio size={12} color="#FFFFFF" />
                  <Text style={styles.aoVivoText}>AO VIVO</Text>
                </View>
              )}
              <Text style={styles.destaqueTitulo}>
                {transmissoes[0]?.titulo}
              </Text>
            </View>
            <View style={styles.playButtonContainer}>
              <PlayCircle size={64} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Lista de Transmissões */}
      <FlatList
        style={styles.listaContainer}
        data={transmissoesFiltradas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            Todas as Transmissões ({transmissoesFiltradas.length})
          </Text>
        }
        renderItem={({ item: transmissao }) => (
          <TouchableOpacity style={styles.transmissaoCard}>
            <Image 
              source={{ uri: transmissao.thumbnail }}
              style={styles.thumbnail}
            />
            
            <View style={styles.transmissaoInfo}>
              <View style={styles.transmissaoHeader}>
                {transmissao.tipo === 'ao-vivo' ? (
                  <View style={styles.aoVivoTagSmall}>
                    <Radio size={10} color="#DC2626" />
                    <Text style={styles.aoVivoTextSmall}>AO VIVO</Text>
                  </View>
                ) : (
                  <View style={styles.duracaoTag}>
                    <Text style={styles.duracaoText}>{transmissao.duracao}</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.transmissaoTitulo} numberOfLines={2}>
                {transmissao.titulo}
              </Text>
              
              <View style={styles.transmissaoMeta}>
                <View style={styles.metaItem}>
                  <Eye size={14} color="#6B7280" />
                  <Text style={styles.metaText}>
                    {formatarVisualizacoes(transmissao.visualizacoes)}
                  </Text>
                </View>
                
                <View style={styles.metaItem}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.metaText}>
                    {new Date(transmissao.data).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  uploadButton: {
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
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
  },
  destaqueContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  destaqueCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  destaqueThumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  destaqueOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'space-between',
    padding: 16,
  },
  destaqueInfo: {
    alignItems: 'flex-start',
  },
  aoVivoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  aoVivoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  destaqueTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 24,
  },
  playButtonContainer: {
    alignSelf: 'center',
    opacity: 0.9,
  },
  listaContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transmissaoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnail: {
    width: 120,
    height: 90,
    resizeMode: 'cover',
  },
  transmissaoInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  transmissaoHeader: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  aoVivoTagSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aoVivoTextSmall: {
    color: '#DC2626',
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 3,
  },
  duracaoTag: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  duracaoText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
  },
  transmissaoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 18,
  },
  transmissaoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
});