import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { PremiumModal } from '../../components/modals/PremiumModal';
import { useNavigation } from '@react-navigation/native';

interface UserMoreScreenProps {
  onLogout: () => void;
}

export function UserMoreScreen({ onLogout }: UserMoreScreenProps) {
  const { colors, theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const menuSections = [
    {
      title: 'Minha Fé',
      items: [
        { id: 'prayers', title: 'Meus Pedidos de Oração', icon: 'heart', premium: false },
        { id: 'donations', title: 'Histórico de Doações', icon: 'card', premium: false },
        { id: 'raffles', title: 'Minhas Rifas', icon: 'gift', premium: true },
        { id: 'feed', title: 'Minhas Postagens', icon: 'camera', premium: false },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { id: 'profile', title: 'Meu Perfil', icon: 'person', premium: false },
        { id: 'notifications', title: 'Notificações', icon: 'notifications', premium: false },
        { id: 'theme', title: 'Tema', icon: 'color-palette', premium: false },
        { id: 'privacy', title: 'Privacidade', icon: 'shield-checkmark', premium: false },
      ]
    },
    {
      title: 'Suporte',
      items: [
        { id: 'help', title: 'Central de Ajuda', icon: 'help-circle', premium: false },
        { id: 'contact', title: 'Fale Conosco', icon: 'mail', premium: false },
        { id: 'about', title: 'Sobre o App', icon: 'information-circle', premium: false },
      ]
    }
  ];

  const handleMenuPress = (itemId: string, isPremium: boolean) => {
    if (isPremium && !user?.isPremium) {
      setShowPremiumModal(true);
      return;
    }

    switch (itemId) {
      case 'theme':
        // Toggle theme será tratado no componente
        break;
      case 'notifications':
        setNotifications(!notifications);
        break;
      case 'prayers':
        navigation.navigate('MyPrayers');
        break;
      case 'donations':
        navigation.navigate('DonationHistory');
        break;
      case 'raffles':
        navigation.navigate('MyRaffles');
        break;
      case 'feed':
        navigation.navigate('MyPosts');
        break;
      case 'profile':
        navigation.navigate('UserProfile');
        break;
      case 'privacy':
        navigation.navigate('PrivacySettings');
        break;
      default:
        Alert.alert('Em Desenvolvimento', `Funcionalidade "${itemId}" será implementada em breve`);
    }
  };

  const handlePremiumUpgrade = () => {
    setShowPremiumModal(false);
    Alert.alert(
      'Upgrade Premium',
      'Redirecionando para pagamento...',
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    profileIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 4,
    },
    profileType: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 12,
    },
    premiumButton: {
      backgroundColor: colors.gold,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    premiumButtonText: {
      color: 'white',
      fontWeight: 'bold',
      marginLeft: 8,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    menuItemPremium: {
      opacity: 0.6,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.foreground,
    },
    premiumIndicator: {
      backgroundColor: colors.gold + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    premiumIndicatorText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: colors.gold,
    },
    logoutButton: {
      backgroundColor: colors.destructive + '20',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    logoutText: {
      color: colors.destructive,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons name="person" size={40} color={colors.primaryForeground} />
          </View>
          <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
          <Text style={styles.profileType}>Membro da Comunidade</Text>
          
          {!user?.isPremium && (
            <TouchableOpacity 
              style={styles.premiumButton}
              onPress={() => setShowPremiumModal(true)}
            >
              <Ionicons name="diamond" size={16} color="white" />
              <Text style={styles.premiumButtonText}>Upgrade Premium</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  item.premium && !user?.isPremium && styles.menuItemPremium
                ]}
                onPress={() => handleMenuPress(item.id, item.premium)}
              >
                <View style={styles.menuIcon}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={20} 
                    color={colors.primary} 
                  />
                </View>
                
                <View style={styles.menuContent}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.premium && (
                      <View style={styles.premiumIndicator}>
                        <Text style={styles.premiumIndicatorText}>PRO</Text>
                      </View>
                    )}
                  </View>
                </View>

                {item.id === 'theme' ? (
                  <Switch
                    value={theme === 'dark'}
                    onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    trackColor={{ false: colors.muted, true: colors.primary }}
                    thumbColor={colors.card}
                  />
                ) : item.id === 'notifications' ? (
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: colors.muted, true: colors.primary }}
                    thumbColor={colors.card}
                  />
                ) : (
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.mutedForeground}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out" size={20} color={colors.destructive} />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        userType="user"
        onUpgrade={handlePremiumUpgrade}
      />
    </SafeAreaView>
  );
}