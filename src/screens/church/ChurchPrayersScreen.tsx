import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { PremiumBadge } from '../../components/PremiumBadge';
import { CreatePrayerModal } from '../../components/modals/CreatePrayerModal';

export function ChurchPrayersScreen() {
  const { colors } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    content: { flex: 1, padding: 20 },
    actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
    actionText: { color: colors.primaryForeground, fontWeight: '600', marginLeft: 8 },
    item: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 12, marginBottom: 12 },
    itemTitle: { color: colors.foreground, fontWeight: '600', marginBottom: 6 },
    itemMeta: { color: colors.mutedForeground, fontSize: 12 },
    itemActions: { flexDirection: 'row', marginTop: 12, gap: 12 },
    smallButton: { backgroundColor: colors.input, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
    smallButtonText: { color: colors.foreground, fontSize: 12, fontWeight: '500' }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Pedidos de Oração</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add" size={18} color={colors.primaryForeground} />
            <Text style={styles.actionText}>Novo Pedido</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        {[{ id: '1', title: 'Saúde do Sr. José', status: 'Em oração' }, { id: '2', title: 'Emprego para Maria', status: 'Atendido' }].map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemMeta}>Status: {item.status}</Text>
            <View style={styles.itemActions}>
              <TouchableOpacity style={styles.smallButton} onPress={() => Alert.alert('Status', 'Marcado como Em oração')}>
                <Text style={styles.smallButtonText}>Em oração</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={() => Alert.alert('Status', 'Marcado como Atendido')}>
                <Text style={styles.smallButtonText}>Atendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <PremiumBadge />
      </ScrollView>
      <CreatePrayerModal visible={showCreateModal} onClose={() => setShowCreateModal(false)} onSubmit={() => setShowCreateModal(false)} />
    </SafeAreaView>
  );
}

