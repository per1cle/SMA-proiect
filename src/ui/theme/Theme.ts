import { Status } from '../../domain/model/Models';

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

export function statusColor(status: Status): string {
  switch (status) {
    case 'SAFE':
      return '#2E7D32';
    case 'SUSPICIOUS':
      return '#EF6C00';
    case 'DANGER':
      return '#C62828';
    case 'UNKNOWN':
    default:
      return '#616161';
  }
}

export function statusBackgroundColor(status: Status): string {
  switch (status) {
    case 'SAFE':
      return '#E8F5E9';
    case 'SUSPICIOUS':
      return '#FFF3E0';
    case 'DANGER':
      return '#FFEBEE';
    case 'UNKNOWN':
    default:
      return '#F5F5F5';
  }
}

export const Colors = {
  primary: '#1565C0',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  textPrimary: '#1C1B1F',
  textSecondary: '#49454F',
  border: '#CAC4D0',
  error: '#B3261E',
  chipSelectedBg: '#D3E3FD',
  chipSelectedText: '#041E49',
};
