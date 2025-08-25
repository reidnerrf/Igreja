import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  LogIn
} from 'lucide-react-native';
import { useTheme, tokens } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [focus, setFocus] = useState<'email' | 'senha' | null>(null);

  const fazerLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setCarregando(true);
    
    // Simular login
    setTimeout(() => {
      setCarregando(false);
      Alert.alert('Sucesso', 'Login realizado com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }, 1500);
  };

  const loginGoogle = () => {
    Alert.alert('Login Google', 'Implementar autenticação do Google');
  };

  const loginApple = () => {
    Alert.alert('Login Apple', 'Implementar autenticação da Apple');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[tokens.blue[800], tokens.blue[600], tokens.blue[400]]}
        style={styles.background}
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=200' }}
            style={styles.logo}
          />
          <Text style={styles.title}>Igreja Católica</Text>
          <Text style={styles.subtitle}>
            Conecte-se com sua comunidade de fé
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <BlurView
            intensity={60}
            tint={theme.colors.text === '#E2E8F0' ? 'dark' : 'light'}
            style={[
              styles.form,
              {
                backgroundColor: theme.colors.surfaceElevated + 'CC',
                borderTopLeftRadius: theme.radius.xl,
                borderTopRightRadius: theme.radius.xl,
                padding: theme.spacing.lg,
                paddingBottom: theme.spacing.xl,
              }
            ]}
          >
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>Entrar na sua conta</Text>
            
            {/* Campo Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Email</Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.colors.muted,
                  borderColor: focus === 'email' ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.md,
                  paddingHorizontal: theme.spacing.md,
                }
              ]}>
                <Mail size={20} color={theme.colors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  placeholderTextColor={theme.colors.mutedForeground}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setFocus('email')}
                  onBlur={() => setFocus(null)}
                />
              </View>
            </View>

            {/* Campo Senha */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.subtleText }]}>Senha</Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.colors.muted,
                  borderColor: focus === 'senha' ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.md,
                  paddingHorizontal: theme.spacing.md,
                }
              ]}>
                <Lock size={20} color={theme.colors.mutedForeground} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Sua senha"
                  placeholderTextColor={theme.colors.mutedForeground}
                  secureTextEntry={!mostrarSenha}
                  onFocus={() => setFocus('senha')}
                  onBlur={() => setFocus(null)}
                />
                <TouchableOpacity
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                  style={styles.eyeButton}
                >
                  {mostrarSenha ? (
                    <EyeOff size={20} color={theme.colors.mutedForeground} />
                  ) : (
                    <Eye size={20} color={theme.colors.mutedForeground} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                carregando && styles.loginButtonDisabled,
                { backgroundColor: theme.colors.primary, borderRadius: theme.radius.md }
              ]}
              onPress={fazerLogin}
              disabled={carregando}
            >
              <LogIn size={20} color={theme.colors.primaryContrast} />
              <Text style={[styles.loginButtonText, { color: theme.colors.primaryContrast }]}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.dividerText, { color: theme.colors.subtleText }]}>ou continue com</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
            </View>

            {/* Botões Sociais */}
            <View style={styles.socialButtons}>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.muted, borderColor: theme.colors.border }] } onPress={loginGoogle}>
                <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.muted, borderColor: theme.colors.border }]} onPress={loginApple}>
                <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Links */}
            <View style={styles.linksContainer}>
              <TouchableOpacity>
                <Text style={[styles.linkText, { color: theme.colors.primary }]}>Esqueci minha senha</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={[styles.linkText, { color: theme.colors.primary }]}>Cadastrar igreja</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 32,
    textAlign: 'center',
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
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '500',
  },
});