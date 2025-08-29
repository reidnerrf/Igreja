import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface VideoPlayerProps {
  url: string;
  onClose: () => void;
}

export function VideoPlayer({ url, onClose }: VideoPlayerProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      width: '90%',
      height: '60%',
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.foreground,
    },
    closeButton: {
      padding: 8,
    },
    videoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    },
    placeholder: {
      color: 'white',
      fontSize: 16,
    },
  });

  return (
    <Modal visible={true} animationType="fade" transparent>
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Reproduzindo Vídeo</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>
          <View style={styles.videoContainer}>
            <Text style={styles.placeholder}>Player de vídeo será implementado aqui</Text>
            <Text style={styles.placeholder}>URL: {url}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}