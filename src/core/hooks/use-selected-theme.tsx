import { colorScheme, useColorScheme } from 'nativewind';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';

/**
 * This hook should only be used while selecting the theme.
 * It returns the selected theme which is stored in AsyncStorage.
 * selectedTheme should be one of the following values: 'light', 'dark', or 'system'.
 * Don't use this hook if you want to style your component based on the theme.
 * Use `useColorScheme` from nativewind instead.
 */
export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  const [theme, setTheme] = React.useState<ColorSchemeType>('system');

  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(SELECTED_THEME);
        if (savedTheme) {
          setTheme(savedTheme as ColorSchemeType);
          setColorScheme(savedTheme as ColorSchemeType);
        }
      } catch (error) {
        console.error('Error loading theme from AsyncStorage:', error);
      }
    };

    loadTheme();
  }, [setColorScheme]);

  const setSelectedTheme = React.useCallback(
    async (t: ColorSchemeType) => {
      try {
        await AsyncStorage.setItem(SELECTED_THEME, t);
        setTheme(t);
        setColorScheme(t);
      } catch (error) {
        console.error('Error saving theme to AsyncStorage:', error);
      }
    },
    [setColorScheme]
  );

  const selectedTheme = theme as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
};

// To be used in the root file to load the selected theme from AsyncStorage
export const loadSelectedTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(SELECTED_THEME);
    if (theme) {
      // console.log('Theme loaded:', theme);
      colorScheme.set(theme as ColorSchemeType);
    }
  } catch (error) {
    console.error('Error loading theme from AsyncStorage:', error);
  }
};
