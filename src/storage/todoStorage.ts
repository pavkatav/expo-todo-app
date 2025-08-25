import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types/todo';

const TODOS_KEY = '@todos';
const THEME_KEY = '@theme';

let saveTimeout: NodeJS.Timeout | null = null;

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TODOS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading todos:', e);
    return [];
  }
};

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }

  saveTimeout = setTimeout(async () => {
    try {
      const jsonValue = JSON.stringify(todos);
      await AsyncStorage.setItem(TODOS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving todos:', e);
    }
  }, 300); // 300ms debounce
};

export const loadTheme = async (): Promise<'light' | 'dark' | 'system'> => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return (theme as 'light' | 'dark' | 'system') || 'system';
  } catch (e) {
    console.error('Error loading theme:', e);
    return 'system';
  }
};

export const saveTheme = async (
  theme: 'light' | 'dark' | 'system'
): Promise<void> => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Error saving theme:', e);
  }
};
