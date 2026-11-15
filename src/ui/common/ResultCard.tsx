import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnalysisResult } from '../../domain/model/Models';
import { Colors, statusBackgroundColor, statusColor, statusLabel } from '../theme/Theme';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const color = statusColor(result.status);
  const bgColor = statusBackgroundColor(result.status);

  return (
    <View style={[styles.card, { backgroundColor: bgColor, borderColor: color }]}>
      <Text style={[styles.statusText, { color }]}>{statusLabel(result.status)}</Text>
      <Text style={styles.riskText}>Risc: {Math.round(result.riskScore * 100)}%</Text>
      {result.advice.trim().length > 0 && (
        <Text style={styles.adviceText}>{result.advice}</Text>
      )}
      {result.reasons.map((reason, idx) => (
        <Text key={`${reason.code}-${idx}`} style={styles.reasonText}>
          • {reason.message}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  statusText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  riskText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  adviceText: {
    fontSize: 20,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  reasonText: {
    fontSize: 18,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
});
