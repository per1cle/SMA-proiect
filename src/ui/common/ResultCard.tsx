import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { AnalysisResult } from '../../domain/model/Models';
import { statusBackgroundColor, statusColor, statusLabel } from '../theme/Theme';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { palette } = useApp();
  const color = statusColor(result.status, palette.isDark);
  const bgColor = statusBackgroundColor(result.status, palette.isDark);
  const percent = Math.round(result.riskScore * 100);

  return (
    <View style={[styles.card, { backgroundColor: bgColor, borderColor: color }]}>
      <View style={styles.headerRow}>
        <View style={[styles.statusBadge, { backgroundColor: color }]}>
          <Text style={styles.statusBadgeText}>{statusLabel(result.status)}</Text>
        </View>
        <Text style={[styles.riskText, { color }]}>Risc {percent}%</Text>
      </View>

      {/* Bara vizuala de progres pentru nivelul de risc */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: palette.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 23, 42, 0.08)' },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(percent, 6)}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {result.advice.trim().length > 0 && (
        <Text style={[styles.adviceText, { color: palette.textPrimary }]}>{result.advice}</Text>
      )}

      {result.reasons.length > 0 && (
        <View style={styles.reasonsList}>
          <Text style={[styles.reasonsTitle, { color: palette.textSecondary }]}>
            Motive identificate:
          </Text>
          {result.reasons.map((reason, idx) => (
            <View
              key={`${reason.code}-${idx}`}
              style={[
                styles.reasonPill,
                { backgroundColor: palette.isDark ? palette.surface : 'rgba(255, 255, 255, 0.85)' },
              ]}
            >
              <View style={[styles.reasonDot, { backgroundColor: color }]} />
              <Text style={[styles.reasonText, { color: palette.textPrimary }]}>
                {reason.message}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  riskText: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  adviceText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 25,
  },
  reasonsList: {
    gap: 8,
    marginTop: 2,
  },
  reasonsTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },
  reasonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reasonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
