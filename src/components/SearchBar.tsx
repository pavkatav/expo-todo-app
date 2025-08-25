import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

const BORDER_RADIUS = 12;

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search todos...',
}: SearchBarProps) {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={styles.searchbar}
      inputStyle={styles.input}
      accessibilityLabel="Search todos"
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    margin: 16,
    borderRadius: BORDER_RADIUS,
  },
  input: {
    minHeight: 40,
  },
});
