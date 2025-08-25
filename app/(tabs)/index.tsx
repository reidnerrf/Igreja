import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Search, Navigation, Clock, Calendar } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Igreja {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  proximaMissa: string;
  distancia: string;
  imagem: string;
}

const igrejasExemplo: Igreja[] = [
  {
    id: '1',
    nome: 'Paróquia Nossa Senhora Aparecida',
    endereco: 'Rua das Flores, 123 - Centro',
    cidade: 'São Paulo',
    proximaMissa: 'Hoje às 19:00',
    distancia: '2.1 km',
    imagem: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    nome: 'Igreja São José Operário',
    endereco: 'Av. Principal, 456 - Vila Nova',
    cidade: 'São Paulo',
    proximaMissa: 'Amanhã às 07:00',
    distancia: '3.8 km',
    imagem: 'https://images.pexels.com/photos/161154/chapel-church-architecture-building-161154.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    nome: 'Santuário do Sagrado Coração',
    endereco: 'Rua da Paz, 789 - Jardim Esperança',
    cidade: 'São Paulo',
    proximaMissa: 'Domingo às 10:00',
    distancia: '5.2 km',
    imagem: 'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

export default function MapaScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIgreja, setSelectedIgreja] = useState<Igreja | null>(null);

  const filteredIgrejas = igrejasExemplo.filter(igreja =>
    igreja.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    igreja.cidade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Igrejas Católicas</Text>
          <Text style={styles.headerSubtitle}>Encontre sua paróquia</Text>
        </View>
      </LinearGradient>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou cidade..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Mapa Placeholder */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={['#EFF6FF', '#DBEAFE']}
          style={styles.mapPlaceholder}
        >
          <MapPin size={48} color="#1E40AF" />
          <Text style={styles.mapText}>Mapa Interativo</Text>
          <Text style={styles.mapSubText}>
            Visualize as igrejas ao seu redor
          </Text>
        </LinearGradient>
      </View>

      {/* Lista de Igrejas */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          Igrejas próximas ({filteredIgrejas.length})
        </Text>
        
        {filteredIgrejas.map((igreja) => (
          <TouchableOpacity
            key={igreja.id}
            style={styles.igrejaCard}
            onPress={() => setSelectedIgreja(igreja)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: igreja.imagem }} style={styles.igrejaImagem} />
            <View style={styles.igrejaInfo}>
              <Text style={styles.igrejaNome}>{igreja.nome}</Text>
              <Text style={styles.igrejaEndereco}>{igreja.endereco}</Text>
              <Text style={styles.igrejaCidade}>{igreja.cidade}</Text>
              
              <View style={styles.igrejaFooter}>
                <View style={styles.proximaMissa}>
                  <Clock size={14} color="#059669" />
                  <Text style={styles.proximaMissaText}>
                    {igreja.proximaMissa}
                  </Text>
                </View>
                <View style={styles.distanciaContainer}>
                  <Navigation size={14} color="#6B7280" />
                  <Text style={styles.distanciaText}>{igreja.distancia}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de Igreja Selecionada */}
      {selectedIgreja && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedIgreja(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            
            <Image 
              source={{ uri: selectedIgreja.imagem }} 
              style={styles.modalImagem} 
            />
            <Text style={styles.modalNome}>{selectedIgreja.nome}</Text>
            <Text style={styles.modalEndereco}>{selectedIgreja.endereco}</Text>
            
            <TouchableOpacity style={styles.comoIrButton}>
              <Navigation size={20} color="#FFFFFF" />
              <Text style={styles.comoIrText}>Como chegar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.agendaButton}>
              <Calendar size={20} color="#1E40AF" />
              <Text style={styles.agendaText}>Ver agenda</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingBottom: 30,
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
    color: '#BFDBFE',
    fontWeight: '400',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -15,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  mapContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    height: height * 0.25,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginTop: 8,
  },
  mapSubText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  igrejaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  igrejaImagem: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  igrejaInfo: {
    padding: 16,
  },
  igrejaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  igrejaEndereco: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  igrejaCidade: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  igrejaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  proximaMissa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proximaMissaText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginLeft: 4,
  },
  distanciaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanciaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    margin: 20,
    width: width - 40,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalImagem: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalNome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalEndereco: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  comoIrButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  comoIrText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  agendaButton: {
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  agendaText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});