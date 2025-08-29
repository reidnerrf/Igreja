import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/Card';

export function UserDashboardScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { 
      id: 1, 
      title: 'Culto Dominical', 
      church: 'Igreja Batista Central', 
      time: '19:00', 
      date: 'Hoje',
      image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop'
    },
    { 
      id: 2, 
      title: 'Estudo Bíblico', 
      church: 'Igreja Assembleia', 
      time: '20:00', 
      date: 'Amanhã',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop'
    },
    { 
      id: 3, 
      title: 'Reunião de Jovens', 
      church: 'Igreja Batista Central', 
      time: '19:30', 
      date: 'Sex',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop'
    }
  ]);

  const [dailyVerse] = useState({
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.",
    reference: "Jeremias 29:11"
  });

  const [followedChurches] = useState([
    { id: 1, name: 'Igreja Batista Central', followers: 1234 },
    { id: 2, name: 'Igreja Assembleia', followers: 856 },
    { id: 3, name: 'Paróquia São José', followers: 2341 }
  ]);

  const quickActions = [
    { id: 'map', title: 'Encontrar Igrejas', icon: 'map', color: colors.primary },
    { id: 'live', title: 'Transmissões', icon: 'radio', color: colors.destructive },
    { id: 'prayers', title: 'Orações', icon: 'heart', color: colors.success },
    { id: 'donations', title: 'Doações', icon: 'card', color: colors.gold },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
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
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    appIcon: {
      width: 40,
      height: 40,
      backgroundColor: colors.primary,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    welcomeCard: {
      backgroundColor: `linear-gradient(135deg, ${colors.primary}, ${colors.gold})`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    welcomeContent: {
      flex: 1,
    },
    welcomeTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 8,
    },
    welcomeSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.9)',
    },
    welcomeIcon: {
      marginLeft: 16,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    quickActionButton: {
      flex: 1,
      minWidth: '45%',
      height: 80,
      backgroundColor: colors.card,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickActionIcon: {
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.foreground,
      textAlign: 'center',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    seeAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primary,
      borderRadius: 6,
    },
    seeAllText: {
      fontSize: 12,
      color: colors.primaryForeground,
      fontWeight: '500',
    },
    eventCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    eventImage: {
      width: '100%',
      height: 120,
      backgroundColor: colors.muted,
    },
    eventContent: {
      padding: 16,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    eventTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.foreground,
      flex: 1,
    },
    eventBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    eventBadgeText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '500',
    },
    eventChurch: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginBottom: 4,
    },
    eventTime: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    verseCard: {
      backgroundColor: `linear-gradient(135deg, ${colors.primary}20, ${colors.success}20)`,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
    },
    verseIcon: {
      marginBottom: 16,
    },
    verseText: {
      fontSize: 16,
      fontStyle: 'italic',
      color: colors.foreground,
      textAlign: 'center',
      marginBottom: 12,
      lineHeight: 24,
    },
    verseReference: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    churchItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    churchIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    churchContent: {
      flex: 1,
    },
    churchName: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginBottom: 4,
    },
    churchFollowers: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    followButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    followButtonText: {
      fontSize: 12,
      color: colors.primaryForeground,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.appIcon}>
              <Ionicons name="heart" size={24} color={colors.primaryForeground} />
            </View>
            <View>
              <Text style={styles.headerTitle}>ConnectFé</Text>
              <Text style={styles.headerSubtitle}>Sua comunidade de fé</Text>
            </View>
          </View>
          
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Bem-vindo! 🙏</Text>
            <Text style={styles.welcomeSubtitle}>
              Conecte-se com sua comunidade de fé
            </Text>
          </View>
          <Ionicons 
            name="heart" 
            size={48} 
            color="rgba(255,255,255,0.8)" 
            style={styles.welcomeIcon}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
            >
              <Ionicons 
                name={action.icon as any} 
                size={24} 
                color={action.color} 
                style={styles.quickActionIcon}
              />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Próximos Eventos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Eventos</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver Todos</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingEvents.slice(0, 2).map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventBadge}>
                    <Text style={styles.eventBadgeText}>{event.date}</Text>
                  </View>
                </View>
                <Text style={styles.eventChurch}>{event.church}</Text>
                <Text style={styles.eventTime}>{event.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Versículo do Dia */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Versículo do Dia</Text>
          </View>
          
          <View style={styles.verseCard}>
            <Ionicons 
              name="book" 
              size={32} 
              color={colors.primary} 
              style={styles.verseIcon}
            />
            <Text style={styles.verseText}>"{dailyVerse.text}"</Text>
            <Text style={styles.verseReference}>{dailyVerse.reference}</Text>
          </View>
        </View>

        {/* Igrejas Seguidas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Minhas Igrejas</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver Todas</Text>
            </TouchableOpacity>
          </View>
          
          {followedChurches.slice(0, 3).map((church) => (
            <View key={church.id} style={styles.churchItem}>
              <View style={styles.churchIcon}>
                <Ionicons name="business" size={20} color={colors.primary} />
              </View>
              <View style={styles.churchContent}>
                <Text style={styles.churchName}>{church.name}</Text>
                <Text style={styles.churchFollowers}>
                  {church.followers.toLocaleString()} seguidores
                </Text>
              </View>
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Seguindo</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}