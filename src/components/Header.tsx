import React from 'react';
import { Appbar, IconButton, Menu } from 'react-native-paper';
import { useThemeStore, ThemeMode } from '@/app/theme/theme';

interface HeaderProps {
  title: string;
  showAdd?: boolean;
  onAddPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  showThemeToggle?: boolean;
}

export default function Header({
  title,
  showAdd = false,
  onAddPress,
  showBack = false,
  onBackPress,
  showThemeToggle = false,
}: HeaderProps) {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { themeMode, setThemeMode } = useThemeStore();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    closeMenu();
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return 'weather-sunny';
      case 'dark':
        return 'weather-night';
      default:
        return 'theme-light-dark';
    }
  };

  return (
    <Appbar.Header>
      {showThemeToggle && (
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon={getThemeIcon(themeMode)}
              onPress={openMenu}
              accessibilityLabel="Theme settings"
            />
          }
        >
          <Menu.Item
            onPress={() => handleThemeChange('light')}
            title="Light"
            leadingIcon="weather-sunny"
            trailingIcon={themeMode === 'light' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => handleThemeChange('dark')}
            title="Dark"
            leadingIcon="weather-night"
            trailingIcon={themeMode === 'dark' ? 'check' : undefined}
          />
          <Menu.Item
            onPress={() => handleThemeChange('system')}
            title="System"
            leadingIcon="theme-light-dark"
            trailingIcon={themeMode === 'system' ? 'check' : undefined}
          />
        </Menu>
      )}
      {showBack && <Appbar.BackAction onPress={onBackPress} />}
      <Appbar.Content title={title} />
      {showAdd && (
        <IconButton
          icon="plus"
          onPress={onAddPress}
          accessibilityLabel="Add new todo"
        />
      )}
    </Appbar.Header>
  );
}
