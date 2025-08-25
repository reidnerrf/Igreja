import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Heart, 
  BookOpen, 
  Star,
  Calendar,
  Volume2
} from 'lucide-react-native';

interface Devocional {
  id: string;
  tipo: 'evangelho' | 'reflexao' | 'oracao' | 'santo';
  titulo: string;
  conteudo: string;
  data: string;
  imagem?: string;
}

const devocionaisExemplo: Devocional[] = [
  {
    id: '1',
    tipo: 'evangelho',
    titulo: 'Evangelho do Dia - João 1,35-42',
    conteudo: 'No dia seguinte, João estava outra vez ali, com dois dos seus discípulos. Vendo Jesus que passava, disse: "Eis o Cordeiro de Deus!" Os dois discípulos ouviram-no falar e seguiram Jesus...',
    data: '2025-01-19',
    imagem: 'https://images.pexels.com/photos/8171199/pexels-photo-8171199.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    tipo: 'santo',
    titulo: 'Santo do Dia - São Sebastião',
    conteudo: 'São Sebastião foi um soldado romano e mártir cristão. Nasceu em Narbona, na França, e morreu em Roma no ano 288. É padroeiro do Rio de Janeiro e protetor contra as epidemias...',
    data: '2025-01-20',
    imagem: 'https://images.pexels.com/photos/6629766/pexels-photo-6629766.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    tipo: 'reflexao',
    titulo: 'Reflexão Diária - O Chamado',
    conteudo: 'Como os discípulos de João seguiram Jesus ao ouvir "Eis o Cordeiro de Deus", também nós somos chamados a segui-Lo em nossa vida diária...',
    data: '2025-01-19'
  }
];

const tipoIcons = {
  evangelho: BookOpen,
  reflexao: Heart,
  oracao: Star,
  santo: Calendar
};

const tipoColors = {
  evangelho: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  reflexao: { bg: '#FECACA', text: '#B91C1C', border: '#FCA5A5' },
  oracao: { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
  santo: { bg: '#F3E8FF', text: '#7C3AED', border: '#C4B5FD' }
};

export default function DevocionaisScreen() {
  const [devocionais, setDevocionais] = useState<Devocional[]>(devocionaisExemplo);
  const [selectedDevocional, setSelectedDevocional] = useState<Devocional | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#B91C1C', '#DC2626']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Vida Devocional</Text>
          <Text style={styles.headerSubtitle}>Evangelho e reflexões diárias</Text>
        </View>
        
        <TouchableOpacity style={styles.audioButton}>
          <Volume2 size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Cartão do Dia */}
      <View style={styles.cartaoDiaContainer}>
        <LinearGradient
          colors={['#FEF3C7', '#FEF9C3']}
          style={styles.cartaoDia}
        >
          <View style={styles.cartaoHeader}>
            <BookOpen size={24} color="#92400E" />
            <Text style={styles.cartaoData}>
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long',
                day: '2-digit',
                month: 'long'
              })}
            </Text>
          </View>
          
          <Text style={styles.cartaoTitulo}>
            {devocionais.find(d => d.tipo === 'evangelho')?.titulo}
          </Text>
          
          <TouchableOpacity
            style={styles.lerMaisButton}
            onPress={() => setSelectedDevocional(devocionais[0])}
          >
            <Text style={styles.lerMaisText}>Ler Evangelho</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Grid de Devocionais */}
      <ScrollView style={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Conteúdo Espiritual</Text>
        
        <View style={styles.grid}>
          {devocionais.map((devocional) => {
            const IconComponent = tipoIcons[devocional.tipo];
            const colors = tipoColors[devocional.tipo];
            
            return (
              <TouchableOpacity
                key={devocional.id}
                style={styles.devocionualCard}
                onPress={() => setSelectedDevocional(devocional)}
              >
                {devocional.imagem && (
                  <Image 
                    source={{ uri: devocional.imagem }}
                    style={styles.devocionualImagem}
                  />
                )}
                
                <View style={styles.devocionualContent}>
                  <View style={[
                    styles.tipoTag,
                    { 
                      backgroundColor: colors.bg,
                      borderColor: colors.border
                    }
                  ]}>
                    <IconComponent size={12} color={colors.text} />
                    <Text style={[styles.tipoText, { color: colors.text }]}>
                      {devocional.tipo.toUpperCase()}
                    </Text>
                  </View>
                  
                  <Text style={styles.devocionualTitulo} numberOfLines={2}>
                    {devocional.titulo}
                  </Text>
                  
                  <Text style={styles.devocionualResumo} numberOfLines={3}>
                    {devocional.conteudo}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal de Leitura */}
      {selectedDevocional && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedDevocional(null)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedDevocional.imagem && (
                <Image 
                  source={{ uri: selectedDevocional.imagem }}
                  style={styles.modalImagem}
                />
              )}
              
              <Text style={styles.modalTitulo}>
                {selectedDevocional.titulo}
              </Text>
              
              <Text style={styles.modalConteudo}>
                {selectedDevocional.conteudo}
              </Text>
            </ScrollView>
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
  audioButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  cartaoDiaContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cartaoDia: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cartaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartaoData: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  cartaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 16,
  },
  lerMaisButton: {
    backgroundColor: '#92400E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  lerMaisText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  grid: {
    gap: 16,
  },
  devocionualCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  devocionualImagem: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  devocionualContent: {
    padding: 16,
  },
  tipoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tipoText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  devocionualTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  devocionualResumo: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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
    maxHeight: '80%',
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
  modalTitulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 26,
  },
  modalConteudo: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
});