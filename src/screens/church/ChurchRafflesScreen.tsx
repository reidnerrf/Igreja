import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { RaffleCard } from '../../components/RaffleCard';
import { CreateRaffleModal } from '../../components/modals/CreateRaffleModal';
import { useAuth } from '../../contexts/AuthContext';

export function ChurchRafflesScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const openCreate = () => {
    if (!user?.isPremium) {
      Alert.alert('Recurso Premium', 'Faça upgrade para criar rifas.');
      return;
    }
    setShowModal(true);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
    actionText: { color: colors.primaryForeground, fontWeight: '600', marginLeft: 8 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Rifas e Campanhas</Text>
          <TouchableOpacity style={styles.actionButton} onPress={openCreate}>
            <Ionicons name="add" size={18} color={colors.primaryForeground} />
            <Text style={styles.actionText}>Nova Rifa</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {[1,2].map(i => (
          <RaffleCard key={i} raffle={{ id: String(i), title: `Rifa Beneficente ${i}`, price: 10*i, totalNumbers: 100, soldNumbers: 40*i }} />
        ))}
      </ScrollView>
      <CreateRaffleModal visible={showModal} onClose={() => setShowModal(false)} onSubmit={() => setShowModal(false)} />
    </SafeAreaView>
  );
}

