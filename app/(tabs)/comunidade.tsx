import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { Image } from 'expo-image';
import EmptyState from '@/components/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users, 
  MessageCircle, 
  Send,
  Heart,
  Clock,
  User,
  Shield
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface Mensagem {
  id: string;
  autor: string;
  conteudo: string;
  data: string;
  hora: string;
  curtidas: number;
  moderado: boolean;
  avatar?: string;
}

const mensagensExemplo: Mensagem[] = [
  {
    id: '1',
    autor: 'Maria Santos',
    conteudo: 'Que bela celebração tivemos hoje! A homilia do Padre João tocou muito o coração. Gratidão por fazer parte desta comunidade! 🙏',
    data: '2025-01-19',
    hora: '15:30',
    curtidas: 12,
    moderado: true,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    autor: 'João Silva',
    conteudo: 'Alguém sabe qual será o tema da novena desta semana? Gostaria de participar mas não encontrei a informação.',
    data: '2025-01-19',
    hora: '14:15',
    curtidas: 5,
    moderado: true
  },
  {
    id: '3',
    autor: 'Ana Costa',
    conteudo: 'Obrigada pelas orações! Minha mãe recebeu alta do hospital hoje. A fé e as orações da comunidade fizeram toda a diferença! ❤️',
    data: '2025-01-19',
    hora: '13:45',
    curtidas: 18,
    moderado: true,
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '4',
    autor: 'Carlos Oliveira',
    conteudo: 'Pessoal, conseguimos arrecadar R$ 2.500 na venda de doces da festa junina! Parabéns a todos os voluntários! 🎉',
    data: '2025-01-18',
    hora: '19:22',
    curtidas: 24,
    moderado: true
  }
];

export default function ComunidadeScreen() {
  const { t } = useTranslation();
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensExemplo);
  const [novaMensagem, setNovaMensagem] = useState('');

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) {
      Alert.alert(t('Erro', { defaultValue: 'Erro' }), t('Digite uma mensagem antes de enviar', { defaultValue: 'Digite uma mensagem antes de enviar' }));
      return;
    }

    const mensagem: Mensagem = {
      id: Date.now().toString(),
      autor: 'Você',
      conteudo: novaMensagem,
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      curtidas: 0,
      moderado: false
    };

    setMensagens([mensagem, ...mensagens]);
    setNovaMensagem('');
    Alert.alert(t('Enviado', { defaultValue: 'Enviado' }), t('Sua mensagem será revisada antes de ser publicada', { defaultValue: 'Sua mensagem será revisada antes de ser publicada' }));
  };

  const curtirMensagem = (id: string) => {
    setMensagens(mensagens.map(msg => 
      msg.id === id ? { ...msg, curtidas: msg.curtidas + 1 } : msg
    ));
  };

  const formatarTempo = (data: string, hora: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (data === hoje) return `Hoje às ${hora}`;
    if (data === ontem) return `Ontem às ${hora}`;
    return `${new Date(data).toLocaleDateString('pt-BR')} às ${hora}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mural da Comunidade</Text>
          <Text style={styles.headerSubtitle}>Compartilhe e participe</Text>
        </View>
        
        <View style={styles.membrosInfo}>
          <Users size={20} color="#FFFFFF" />
          <Text style={styles.membrosNumero}>247</Text>
        </View>
      </LinearGradient>

      {/* Estatísticas do Mural */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MessageCircle size={18} color="#059669" />
          <Text style={styles.statNumber}>{mensagens.length}</Text>
          <Text style={styles.statLabel}>Mensagens</Text>
        </View>
        
        <View style={styles.statCard}>
          <Heart size={18} color="#DC2626" />
          <Text style={styles.statNumber}>
            {mensagens.reduce((acc, msg) => acc + msg.curtidas, 0)}
          </Text>
          <Text style={styles.statLabel}>Curtidas</Text>
        </View>
        
        <View style={styles.statCard}>
          <Shield size={18} color="#7C3AED" />
          <Text style={styles.statNumber}>
            {mensagens.filter(m => m.moderado).length}
          </Text>
          <Text style={styles.statLabel}>Moderadas</Text>
        </View>
      </View>

      {/* Campo de Nova Mensagem */}
      <View style={styles.novaMensagemContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.mensagemInput}
            value={novaMensagem}
            onChangeText={setNovaMensagem}
            placeholder={t('Compartilhe com a comunidade...', { defaultValue: 'Compartilhe com a comunidade...' })}
            multiline
            maxLength={280}
          />
          <TouchableOpacity
            style={styles.enviarButton}
            onPress={enviarMensagem}
            accessibilityLabel="Enviar mensagem"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.caracteresInfo}>
          {novaMensagem.length}/280 {t('caracteres', { defaultValue: 'caracteres' })}
        </Text>
      </View>

      {/* Lista de Mensagens */}
      <FlatList
        style={styles.mensagensContainer}
        data={mensagens}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={<EmptyState title="Sem mensagens" subtitle="Seja o primeiro a publicar." />}
        renderItem={({ item: mensagem }) => (
          <View style={styles.mensagemCard}>
            <View style={styles.mensagemHeader}>
              <View style={styles.autorContainer}>
                {mensagem.avatar ? (
                  <Image source={{ uri: mensagem.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={16} color="#6B7280" />
                  </View>
                )}
                
                <View style={styles.autorInfo}>
                  <View style={styles.autorNomeContainer}>
                    <Text style={styles.autorNome}>{mensagem.autor}</Text>
                    {mensagem.moderado && (
                      <Shield size={12} color="#059669" />
                    )}
                  </View>
                  <Text style={styles.mensagemTempo}>
                    {formatarTempo(mensagem.data, mensagem.hora)}
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.mensagemConteudo}>{mensagem.conteudo}</Text>
            
            <View style={styles.mensagemFooter}>
              <TouchableOpacity
                style={styles.curtirButton}
                onPress={() => curtirMensagem(mensagem.id)}
                accessibilityLabel="Curtir"
                accessibilityRole="button"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Heart size={16} color="#DC2626" />
                <Text style={styles.curtidasText}>
                  {mensagem.curtidas > 0 ? mensagem.curtidas : 'Curtir'}
                </Text>
              </TouchableOpacity>
              
              {!mensagem.moderado && (
                <View style={styles.moderacaoTag}>
                  <Clock size={12} color="#F59E0B" />
                  <Text style={styles.moderacaoText}>Em análise</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={<View style={styles.footerSpace} />}
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
    color: '#A7F3D0',
    fontWeight: '400',
  },
  membrosInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membrosNumero: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  novaMensagemContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  mensagemInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  enviarButton: {
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caracteresInfo: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  mensagensContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mensagemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  mensagemHeader: {
    marginBottom: 12,
  },
  autorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  autorInfo: {
    flex: 1,
  },
  autorNomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  autorNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  mensagemTempo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  mensagemConteudo: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  mensagemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  curtirButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
  },
  curtidasText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  moderacaoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moderacaoText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '500',
  },
  footerSpace: {
    height: 20,
  },
});