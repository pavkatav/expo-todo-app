import { Todo } from '@/types/todo';
import { createDateString } from '@/utils/date';
import { validateTodoNotes, validateTodoTitle } from '@/utils/validators';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput, useTheme } from 'react-native-paper';

const BORDER_RADIUS = 12;

interface TodoEditorProps {
  todo?: Todo;
  onSave: (todoData: {
    title: string;
    notes?: string;
    dueDate?: string;
  }) => void;
  onCancel: () => void;
}

export default function TodoEditor({
  todo,
  onSave,
  onCancel,
}: TodoEditorProps) {
  const theme = useTheme();
  const [title, setTitle] = useState(todo?.title || '');
  const [notes, setNotes] = useState(todo?.notes || '');
  const [dueDate, setDueDate] = useState<Date | null>(() => {
    if (todo?.dueDate) {
      const date = new Date(todo.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today ? date : null;
    }
    return null;
  });
  const [titleError, setTitleError] = useState<string | null>(null);
  const [notesError, setNotesError] = useState<string | null>(null);

  useEffect(() => {
    const titleValidation = validateTodoTitle(title);
    setTitleError(titleValidation);
  }, [title]);

  useEffect(() => {
    const notesValidation = validateTodoNotes(notes);
    setNotesError(notesValidation);
  }, [notes]);

  const handleSave = () => {
    const titleValidation = validateTodoTitle(title);
    const notesValidation = validateTodoNotes(notes);

    if (titleValidation || notesValidation) {
      Alert.alert('Validation Error', titleValidation || notesValidation || '');
      return;
    }

    onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate ? createDateString(dueDate) : undefined,
    });
  };

  const handleDateConfirm = (selectedDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      setDueDate(selectedDate);
    } else {
      // If somehow a past date is selected, set to today
      setDueDate(new Date());
    }
  };

  const canSave = title.trim().length > 0 && !titleError && !notesError;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          error={!!titleError}
          accessibilityLabel="Todo title"
          maxLength={120}
        />
        {titleError && (
          <Text
            variant="bodySmall"
            style={[styles.error, { color: theme.colors.error }]}
          >
            {titleError}
          </Text>
        )}

        <TextInput
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={[styles.input, styles.notesInput]}
          error={!!notesError}
          accessibilityLabel="Todo notes"
          maxLength={500}
        />
        {notesError && (
          <Text
            variant="bodySmall"
            style={[styles.error, { color: theme.colors.error }]}
          >
            {notesError}
          </Text>
        )}

        <Surface style={styles.dueDateSection} elevation={1}>
          <View style={styles.dueDateHeader}>
            <Text variant="titleMedium">Due Date</Text>
          </View>

          <View style={[styles.datePickerContainer]}>
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="spinner"
              minimumDate={new Date()}
              onChange={(_, selectedDate) => {
                if (selectedDate) {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (selectedDate >= today) {
                    handleDateConfirm(selectedDate);
                  }
                }
              }}
              textColor={theme.colors.onSurface}
              accentColor={theme.colors.primary}
            />
          </View>
        </Surface>
      </ScrollView>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.actionButton}
          accessibilityLabel="Cancel"
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!canSave}
          style={styles.actionButton}
          accessibilityLabel="Save todo"
        >
          {todo ? 'Update' : 'Save'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 100,
  },
  error: {
    marginBottom: 16,
    marginLeft: 12,
  },
  dueDateSection: {
    padding: 16,
    marginVertical: 16,
    borderRadius: BORDER_RADIUS,
  },
  dueDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedDate: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  datePickerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    borderRadius: BORDER_RADIUS,
  },
  dateSpinner: {
    width: '100%',
    height: 140,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS,
  },
});
