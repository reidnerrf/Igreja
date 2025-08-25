import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  DollarSign, 
  CreditCard, 
  Smartphone,
  Heart,
  Target,
  TrendingUp,
  Gift
} from 'lucide-react-native';

interface Campanha {
  id: string;
  titulo: string;
  descricao: string;
  meta: number;
  arrecadado: number;
  imagem: string;
  prazo: string;
}

const campanhasExemplo: Campanha[] = [
  {
    id: '1',
    titulo: 'Reforma do Telhado da Igreja',
    descricao: 'Ajude-nos a reformar o telhado da nossa igreja que precisa de reparos urgentes',
    meta: 25000,
    arrecadado: 18500,
    imagem: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=400',
    prazo: '2025-03-15'
  },
  {
    id: '2',
    titulo: 'Cesta Básica para Famílias',
    descricao: 'Campanha mensal para distribuição de cestas básicas às famílias necessitadas',
    meta: 8000,
    arrecadado: 6200,
    imagem: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=400',
    prazo: '2025-01-31'
  }
];

export default function DoacoesScreen() {
  const [campanhas, setCampanhas] = useState<Campanha[]>(campanhasExemplo);
  const [valorDoacao, setValorDoacao] = useState('');
  const [metodoSelecionado, setMetodoSelecionado] = useState<'pix' | 'cartao'>('pix');
  const [campanhaAtiva, setCampanhaAtiva] = useState<string | null>(null);

  const valoresRapidos = [10, 25, 50, 100, 200];

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const calcularProgresso = (arrecadado: number, meta: number) => {
    return Math.min((arrecadado / meta) * 100, 100);
  };

  const realizarDoacao = () => {
    const valor = parseFloat(valorDoacao);
    if (!valor || valor <= 0) {
      Alert.alert('Erro', 'Insira um valor válido para doação');
      return;
    }

    Alert.alert(
      'Doação',
      `Confirma a doação de ${formatarMoeda(valor)} via ${metodoSelecionado.toUpperCase()}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert('Sucesso', 'Doação realizada com sucesso! Obrigado pela generosidade.');
            setValorDoacao('');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F59E0B', '#FBBF24']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Doações</Text>
          <Text style={styles.headerSubtitle}>Apoie nossa missão</Text>
        </View>
        
        <View style={styles.totalContainer}>
          <Text style={styles.headerTotalLabel}>Este mês</Text>
          <Text style={styles.totalValue}>R$ 12.450</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Doação Rápida */}
        <View style={styles.doacaoRapidaContainer}>
          <Text style={styles.sectionTitle}>Doação Rápida</Text>
          
          <View style={styles.metodosContainer}>
            <TouchableOpacity
              style={[
                styles.metodoButton,
                metodoSelecionado === 'pix' && styles.metodoAtivo
              ]}
              onPress={() => setMetodoSelecionado('pix')}
            >
              <Smartphone size={20} color={metodoSelecionado === 'pix' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[
                styles.metodoText,
                metodoSelecionado === 'pix' && styles.metodoTextoAtivo
              ]}>PIX</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.metodoButton,
                metodoSelecionado === 'cartao' && styles.metodoAtivo
              ]}
              onPress={() => setMetodoSelecionado('cartao')}
            >
              <CreditCard size={20} color={metodoSelecionado === 'cartao' ? '#FFFFFF' : '#6B7280'} />
              <Text style={[
                styles.metodoText,
                metodoSelecionado === 'cartao' && styles.metodoTextoAtivo
              ]}>Cartão</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.valoresContainer}>
            {valoresRapidos.map((valor) => (
              <TouchableOpacity
                key={valor}
                style={styles.valorButton}
                onPress={() => setValorDoacao(valor.toString())}
              >
                <Text style={styles.valorText}>R$ {valor}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ou insira outro valor:</Text>
            <TextInput
              style={styles.valorInput}
              value={valorDoacao}
              onChangeText={setValorDoacao}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </View>
          
          <TouchableOpacity style={styles.doarButton} onPress={realizarDoacao}>
            <Heart size={20} color="#FFFFFF" />
            <Text style={styles.doarText}>Fazer Doação</Text>
          </TouchableOpacity>
        </View>

        {/* Campanhas Especiais */}
        <View style={styles.campanhasContainer}>
          <Text style={styles.sectionTitle}>Campanhas Especiais</Text>
          
          {campanhas.map((campanha) => (
            <View key={campanha.id} style={styles.campanhaCard}>
              <Image source={{ uri: campanha.imagem }} style={styles.campanhaImagem} />
              
              <View style={styles.campanhaContent}>
                <Text style={styles.campanhaTitulo}>{campanha.titulo}</Text>
                <Text style={styles.campanhaDescricao}>{campanha.descricao}</Text>
                
                <View style={styles.progressoContainer}>
                  <View style={styles.progressoInfo}>
                    <Text style={styles.progressoArrecadado}>
                      {formatarMoeda(campanha.arrecadado)}
                    </Text>
                    <Text style={styles.progressoMeta}>
                      de {formatarMoeda(campanha.meta)}
                    </Text>
                  </View>
                  
                  <View style={styles.progressoBar}>
                    <View 
                      style={[
                        styles.progressoFill,
                        { width: `${calcularProgresso(campanha.arrecadado, campanha.meta)}%` }
                      ]}
                    />
                  </View>
                  
                  <Text style={styles.progressoPorcentagem}>
                    {Math.round(calcularProgresso(campanha.arrecadado, campanha.meta))}%
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.contribuirButton}
                  onPress={() => setCampanhaAtiva(campanha.id)}
                >
                  <Gift size={16} color="#FFFFFF" />
                  <Text style={styles.contribuirText}>Contribuir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Histórico de Doações */}
        <View style={styles.historicoContainer}>
          <Text style={styles.sectionTitle}>Transparência</Text>
          
          <View style={styles.transparenciaCard}>
            <View style={styles.transparenciaHeader}>
              <TrendingUp size={24} color="#059669" />
              <Text style={styles.transparenciaTitulo}>
                Relatório de Doações - Janeiro 2025
              </Text>
            </View>
            
            <View style={styles.transparenciaItems}>
              <View style={styles.transparenciaItem}>
                <Text style={styles.transparenciaLabel}>Dízimos:</Text>
                <Text style={styles.transparenciaValor}>R$ 8.750,00</Text>
              </View>
              
              <View style={styles.transparenciaItem}>
                <Text style={styles.transparenciaLabel}>Ofertas:</Text>
                <Text style={styles.transparenciaValor}>R$ 3.700,00</Text>
              </View>
              
              <View style={styles.transparenciaItem}>
                <Text style={styles.transparenciaLabel}>Campanhas:</Text>
                <Text style={styles.transparenciaValor}>R$ 24.700,00</Text>
              </View>
              
              <View style={[styles.transparenciaItem, styles.totalItem]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValor}>R$ 37.150,00</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    color: '#FDE68A',
    fontWeight: '400',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  headerTotalLabel: {
    fontSize: 12,
    color: '#FDE68A',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  doacaoRapidaContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  metodosContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metodoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  metodoAtivo: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  metodoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  metodoTextoAtivo: {
    color: '#FFFFFF',
  },
  valoresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  valorButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  valorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  valorInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  doarButton: {
    backgroundColor: '#F59E0B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  doarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  campanhasContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  campanhaCard: {
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
  campanhaImagem: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  campanhaContent: {
    padding: 16,
  },
  campanhaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  campanhaDescricao: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressoContainer: {
    marginBottom: 16,
  },
  progressoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressoArrecadado: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  progressoMeta: {
    fontSize: 14,
    color: '#6B7280',
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
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  progressoPorcentagem: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  contribuirButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  contribuirText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  historicoContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  transparenciaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  transparenciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  transparenciaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  transparenciaItems: {
    gap: 12,
  },
  transparenciaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  transparenciaLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  transparenciaValor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValor: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
});