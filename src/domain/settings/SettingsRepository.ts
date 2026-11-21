import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_VIBRATION = 'smish_settings_vibration_enabled';
const KEY_DARK_MODE = 'smish_settings_dark_mode';

export interface SettingsRepository {
  getVibrationEnabled(): Promise<boolean>;
  setVibrationEnabled(enabled: boolean): Promise<void>;
  getDarkMode(): Promise<boolean>;
  setDarkMode(dark: boolean): Promise<void>;
}

export class AsyncStorageSettings implements SettingsRepository {
  async getVibrationEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEY_VIBRATION);
      return value === null ? true : value === 'true';
    } catch {
      return true;
    }
  }

  async setVibrationEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEY_VIBRATION, String(enabled));
    } catch {
      // Ignora erorile de scriere locala
    }
  }

  async getDarkMode(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(KEY_DARK_MODE);
      return value === null ? false : value === 'true';
    } catch {
      return false;
    }
  }

  async setDarkMode(dark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(KEY_DARK_MODE, String(dark));
    } catch {
      // Ignora erorile de scriere locala
    }
  }
}
