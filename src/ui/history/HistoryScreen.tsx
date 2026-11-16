import React, { useLayoutEffect } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../context/AppContext';
import { Status } from '../../domain/model/Models';
import { RootStackParamList } from '../navigation/AppNavigation';
import { statusColor, statusLabel } from '../theme/Theme';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const FILTER_STATUSES: Status[] = ['SAFE', 'SUSPICIOUS', 'DANGER'];

export const HistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { palette, entries, statusFilter, setStatusFilter, query, setQuery, clearHistory } =
    useApp();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={clearHistory}
          disabled={entries.length === 0}
          style={styles.clearBtn}
        >
          <Text
            style={[
              styles.clearBtnText,
              {
                color: entries.length === 0 ? palette.buttonDisabledText : palette.error,
              },
            ]}
          >
            Sterge tot
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, clearHistory, entries.length, palette]);

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      {/* Bara de cautare */}
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            color: palette.textPrimary,
          },
        ]}
        value={query}
        onChangeText={setQuery}
        placeholder="Cauta dupa mesaj sau expeditor..."
        placeholderTextColor={palette.textSecondary}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
      />

      {/* Filtre dupa status */}
      <View style={styles.chipRow}>
        <Pressable
          onPress={() => setStatusFilter(null)}
          style={[
            styles.chip,
            {
              backgroundColor:
                statusFilter === null ? palette.chipSelectedBg : palette.surface,
              borderColor: statusFilter === null ? palette.primary : palette.border,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              {
                color:
                  statusFilter === null ? palette.chipSelectedText : palette.textSecondary,
              },
            ]}
          >
            Toate
          </Text>
        </Pressable>

        {FILTER_STATUSES.map((st) => {
          const selected = statusFilter === st;
          return (
            <Pressable
              key={st}
              onPress={() => setStatusFilter(st)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? palette.chipSelectedBg : palette.surface,
                  borderColor: selected ? palette.primary : palette.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: selected ? palette.chipSelectedText : palette.textSecondary,
                  },
                ]}
              >
                {statusLabel(st)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {entries.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          <Text style={[styles.emptyText, { color: palette.textSecondary }]}>
            Nu exista analize salvate in istoric.
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => {
            const snippet = item.text ? item.text.slice(0, 90) : '(text nepastrat)';
            const dateStr = new Date(item.createdAt).toLocaleString('ro-RO');
            const meta = item.sender ? `${dateStr} • ${item.sender}` : dateStr;
            const stColor = statusColor(item.result.status, palette.isDark);

            return (
              <Pressable
                style={[
                  styles.card,
                  {
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                  },
                ]}
                onPress={() => navigation.navigate('Detail', { id: item.id })}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: stColor }]}>
                    <Text style={styles.badgeText}>{statusLabel(item.result.status)}</Text>
                  </View>
                  <Text style={[styles.typeTag, { color: palette.textSecondary }]}>
                    {item.type}
                  </Text>
                </View>

                <Text style={[styles.cardBody, { color: palette.textPrimary }]}>{snippet}</Text>

                {item.note.trim().length > 0 && (
                  <View
                    style={[
                      styles.noteBox,
                      {
                        backgroundColor: palette.primarySoft,
                      },
                    ]}
                  >
                    <Text style={[styles.cardNote, { color: palette.chipSelectedText }]}>
                      Notita: {item.note}
                    </Text>
                  </View>
                )}

                <Text style={[styles.cardDate, { color: palette.textSecondary }]}>{meta}</Text>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContent: {
    gap: 12,
    paddingBottom: 28,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  typeTag: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 22,
  },
  noteBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  cardNote: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardDate: {
    fontSize: 13,
    marginTop: 2,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
