import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function EmptyState({
  title,
  subtitle,
  icon,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <IconButton icon={icon} size={64} style={styles.icon} />
      <Text variant="headlineSmall" style={styles.title}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        {subtitle}
      </Text>
      {actionLabel && onActionPress && (
        <IconButton
          icon="plus"
          mode="contained"
          onPress={onActionPress}
          style={styles.actionButton}
          accessibilityLabel={actionLabel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  actionButton: {
    marginTop: 16,
  },
});
