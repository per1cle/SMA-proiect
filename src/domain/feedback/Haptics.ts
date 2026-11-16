import { Vibration } from 'react-native';
import * as ExpoHaptics from 'expo-haptics';
import { Status } from '../model/Models';

/** Pattern-uri (pauza, vibratie, pauza, vibratie...) in ms. Mai lung inseamna mai periculos. */
export const VibrationPatterns = {
  forStatus(status: Status): number[] | null {
    switch (status) {
      case 'SAFE':
        return [0, 100];
      case 'SUSPICIOUS':
        return [0, 250, 150, 250];
      case 'DANGER':
        return [0, 600, 150, 600, 150, 600];
      case 'UNKNOWN':
      default:
        return null;
    }
  },
};

export interface Haptics {
  signal(status: Status): void;
}

export class DeviceHaptics implements Haptics {
  signal(status: Status): void {
    const pattern = VibrationPatterns.forStatus(status);
    if (!pattern) return;

    try {
      Vibration.vibrate(pattern);
      if (status === 'DANGER') {
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error).catch(() => { });
      } else if (status === 'SUSPICIOUS') {
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning).catch(() => { });
      } else if (status === 'SAFE') {
        ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success).catch(() => { });
      }
    } catch {
      // Ignora daca dispozitivul nu suporta vibratii
    }
  }
}
