import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_VIBRATION = 'smish_settings_vibration_enabled';

export interface SettingsRepository {
  getVibrationEnabled(): Promise<boolean>;
  setVibrationEnabled(enabled: boolean): Promise<void>;
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
}
