import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { loadTheme, saveTheme } from '@/storage/todoStorage';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(0, 122, 255)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(208, 237, 255)',
    onPrimaryContainer: 'rgb(0, 32, 66)',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'rgb(159, 216, 255)',
    onPrimary: 'rgb(0, 32, 66)',
    primaryContainer: 'rgb(0, 96, 183)',
    onPrimaryContainer: 'rgb(208, 237, 255)',
    surface: 'rgb(24, 24, 27)',
    surfaceVariant: 'rgb(68, 71, 78)',
    onSurface: 'rgb(227, 226, 230)',
    onSurfaceVariant: 'rgb(196, 199, 206)',
    outline: 'rgb(142, 145, 153)',
    outlineVariant: 'rgb(68, 71, 78)',
    background: 'rgb(16, 16, 20)',
    onBackground: 'rgb(227, 226, 230)',
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  initialize: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>(set => ({
  themeMode: 'system',
  setThemeMode: (mode: ThemeMode) => {
    set({ themeMode: mode });
    saveTheme(mode);
  },
  initialize: async () => {
    const savedTheme = await loadTheme();
    set({ themeMode: savedTheme });
  },
}));

export const useCurrentTheme = (): MD3Theme => {
  const { themeMode } = useThemeStore();
  const systemColorScheme = useColorScheme();

  if (themeMode === 'system') {
    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }

  return themeMode === 'dark' ? darkTheme : lightTheme;
};
