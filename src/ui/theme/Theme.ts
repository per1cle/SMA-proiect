import { Status } from '../../domain/model/Models';

export interface ThemePalette {
  isDark: boolean;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  error: string;
  chipSelectedBg: string;
  chipSelectedText: string;
  buttonDisabledBg: string;
  buttonDisabledText: string;
  switchTrackOff: string;
  switchTrackOn: string;
  switchThumbOn: string;
  switchThumbOff: string;
}

export const LightPalette: ThemePalette = {
  isDark: false,
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primarySoft: '#EEF2FF',
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  error: '#DC2626',
  chipSelectedBg: '#EEF2FF',
  chipSelectedText: '#4F46E5',
  buttonDisabledBg: '#CBD5E1',
  buttonDisabledText: '#64748B',
  switchTrackOff: '#CBD5E1',
  switchTrackOn: '#A5B4FC',
  switchThumbOn: '#4F46E5',
  switchThumbOff: '#F8FAFC',
};

export const DarkPalette: ThemePalette = {
  isDark: true,
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  primarySoft: '#1E1B4B',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceSubtle: '#0F172A',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  error: '#F87171',
  chipSelectedBg: '#312E81',
  chipSelectedText: '#E0E7FF',
  buttonDisabledBg: '#1E293B',
  buttonDisabledText: '#64748B',
  switchTrackOff: '#334155',
  switchTrackOn: '#4338CA',
  switchThumbOn: '#818CF8',
  switchThumbOff: '#94A3B8',
};

export function getPalette(isDark: boolean): ThemePalette {
  return isDark ? DarkPalette : LightPalette;
}

export function statusLabel(status: Status): string {
  switch (status) {
    case 'SAFE':
      return 'SIGUR';
    case 'SUSPICIOUS':
      return 'SUSPECT';
    case 'DANGER':
      return 'PERICOL';
    case 'UNKNOWN':
    default:
      return 'NECUNOSCUT';
  }
}

export function statusColor(status: Status, isDark = false): string {
  if (isDark) {
    switch (status) {
      case 'SAFE':
        return '#22C55E';
      case 'SUSPICIOUS':
        return '#F59E0B';
      case 'DANGER':
        return '#EF4444';
      case 'UNKNOWN':
      default:
        return '#94A3B8';
    }
  }
  switch (status) {
    case 'SAFE':
      return '#15803D';
    case 'SUSPICIOUS':
      return '#D97706';
    case 'DANGER':
      return '#DC2626';
    case 'UNKNOWN':
    default:
      return '#475569';
  }
}

export function statusBackgroundColor(status: Status, isDark = false): string {
  if (isDark) {
    switch (status) {
      case 'SAFE':
        return '#052E16';
      case 'SUSPICIOUS':
        return '#451A03';
      case 'DANGER':
        return '#450A0A';
      case 'UNKNOWN':
      default:
        return '#1E293B';
    }
  }
  switch (status) {
    case 'SAFE':
      return '#F0FDF4';
    case 'SUSPICIOUS':
      return '#FFFBEB';
    case 'DANGER':
      return '#FEF2F2';
    case 'UNKNOWN':
    default:
      return '#F8FAFC';
  }
}

export const Colors = LightPalette;
