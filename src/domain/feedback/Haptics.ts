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

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Haptics {
  signal(status: Status): void;
}

export class DeviceHaptics implements Haptics {
  signal(status: Status): void {
    const pattern = VibrationPatterns.forStatus(status);
    if (!pattern) return;

    try {
      // Vibratia puternica de motor (functioneaza cand iPhone-ul NU este pe Silent / DND)
      Vibration.vibrate(pattern);
      // Fallback Taptic Engine (functioneaza chiar si cand iPhone-ul ESTE pe Silent)
      void this.playHapticSequence(status);
    } catch {
      // Ignora daca dispozitivul nu suporta vibratii
    }
  }

  private async playHapticSequence(status: Status): Promise<void> {
    try {
      if (status === 'SAFE') {
        await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
      } else if (status === 'SUSPICIOUS') {
        await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
        await delay(250);
        await ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);
      } else if (status === 'DANGER') {
        await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
        await delay(300);
        await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
        await delay(300);
        await ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
      }
    } catch {
      // Ignora daca dispozitivul nu suporta vibratii
    }
  }
}



