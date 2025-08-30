import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

export function ChurchChatScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { backgroundColor: colors.card, paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.foreground },
    messageList: { flex: 1, padding: 16 },
    inputBar: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card },
    input: { flex: 1, backgroundColor: colors.input, color: colors.foreground, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
    send: { backgroundColor: colors.primary, borderRadius: 12, padding: 10 }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mural Comunitário</Text>
      </View>
      <FlatList
        style={styles.messageList}
        data={[{ id: '1', text: 'Sejam bem-vindos!' }, { id: '2', text: 'Paz e bem!' }]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ color: colors.foreground }}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputBar}>
        <TextInput placeholder="Escreva uma mensagem" placeholderTextColor={colors.mutedForeground} style={styles.input} />
        <TouchableOpacity style={styles.send}>
          <Ionicons name="send" size={18} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

