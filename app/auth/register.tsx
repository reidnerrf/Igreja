import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Church, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Lock,
  ArrowLeft,
  Check
} from 'lucide-react-native';

export default function RegisterScreen() {
  const [dadosIgreja, setDadosIgreja] = useState({
    nomeParoquia: '',
    enderecoCompleto: '',
    responsavel: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [carregando, setCarregando] = useState(false);

  const cadastrarIgreja = async () => {
    const { nomeParoquia, responsavel, telefone, email, senha, confirmarSenha } = dadosIgreja;
    
    if (!nomeParoquia || !responsavel || !telefone || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCarregando(true);
    
    // Simular cadastro
    setTimeout(() => {
      setCarregando(false);
      Alert.alert(
        'Sucesso', 
        'Igreja cadastrada com sucesso! Você pode agora fazer login.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Church size={48} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Cadastrar Igreja</Text>
          <Text style={styles.headerSubtitle}>
            Registre sua paróquia na plataforma
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Informações da Igreja */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da Igreja</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Paróquia/Igreja *</Text>
              <View style={styles.inputContainer}>
                <Church size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={dadosIgreja.nomeParoquia}
                  onChangeText={(text) => setDadosIgreja({...dadosIgreja, nomeParoquia: text})}
                  placeholder="Ex: Paróquia São José"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Endereço Completo</Text>
              <View style={styles.inputContainer}>
                <MapPin size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={dadosIgreja.enderecoCompleto}
                  onChangeText={(text) => setDadosIgreja({...dadosIgreja, enderecoCompleto: text})}
                  placeholder="Rua, número, bairro, cidade"
                  multiline
                />
              </View>
            </View>
          </View>

          {/* Dados do Responsável */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsável</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Responsável *</Text>
              <View style={styles.inputContainer}>
                <User size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={dadosIgreja.responsavel}
                  onChangeText={(text) => setDadosIgreja({...dadosIgreja, responsavel: text})}
                  placeholder="Ex: Padre João Santos"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone *</Text>
              <View style={styles.inputContainer}>
                <Phone size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={dadosIgreja.telefone}
                  onChangeText={(text) => setDadosIgreja({...dadosIgreja, telefone: text})}
                  placeholder="(11) 99999-9999"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={dadosIgreja.email}
                  onChangeText={(text) => setDadosIgreja({...dadosIgreja, email: text})}
                  placeholder="contato@igreja.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>

          {/* Segurança */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Segurança</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha *</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={dadosIgreja.senha}
                  onChangeText={(text) => setDadosIgreja({...dadosIgreja, senha: text})}
                  placeholder="Mínimo 6 caracteres"
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Senha *</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={dadosIgreja.confirmarSenha}
                  onChangeText={(text) => setDadosIgreja({...dadosIgreja, confirmarSenha: text})}
                  placeholder="Digite a senha novamente"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Botão Cadastrar */}
          <TouchableOpacity
            style={[styles.registerButton, carregando && styles.registerButtonDisabled]}
            onPress={cadastrarIgreja}
            disabled={carregando}
          >
            <Check size={20} color="#FFFFFF" />
            <Text style={styles.registerButtonText}>
              {carregando ? 'Cadastrando...' : 'Cadastrar Igreja'}
            </Text>
          </TouchableOpacity>

          {/* Termos */}
          <Text style={styles.termos}>
            Ao cadastrar, você concorda com nossos{' '}
            <Text style={styles.termosLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.termosLink}>Política de Privacidade</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A7F3D0',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  registerButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termos: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
  termosLink: {
    color: '#059669',
    fontWeight: '500',
  },
});