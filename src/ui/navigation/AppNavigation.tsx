import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../context/AppContext';
import { DetailScreen } from '../history/DetailScreen';
import { HistoryScreen } from '../history/HistoryScreen';
import { HomeScreen } from '../home/HomeScreen';

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
  Detail: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigation: React.FC = () => {
  const { palette } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          header: ({ navigation, route, options, back }) => (
            <CustomHeader
              title={options.title ?? route.name}
              canGoBack={Boolean(back)}
              onBack={navigation.goBack}
              headerRight={options.headerRight}
            />
          ),
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'SmishSmashSmosh' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Istoric' }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{ title: 'Detalii' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

interface CustomHeaderProps {
  title: string;
  canGoBack: boolean;
  onBack: () => void;
  headerRight?: (props: { tintColor?: string; canGoBack: boolean }) => React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  canGoBack,
  onBack,
  headerRight,
}) => {
  const insets = useSafeAreaInsets();
  const { palette, darkMode, toggleDarkMode } = useApp();

  return (
    <View
      style={[
        styles.headerWrapper,
        {
          backgroundColor: palette.surface,
          borderBottomColor: palette.border,
          paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 12),
        },
      ]}
    >
      <View style={styles.headerBar}>
        <View style={styles.sideSlot}>
          {canGoBack ? (
            <Pressable onPress={onBack} style={styles.backButton} hitSlop={10}>
              <Text style={[styles.backText, { color: palette.chipSelectedText }]}>
                {'< Inapoi'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={toggleDarkMode}
              style={[
                styles.themePill,
                {
                  backgroundColor: palette.primarySoft,
                  borderColor: palette.border,
                },
              ]}
              hitSlop={8}
            >
              <Text style={[styles.themePillText, { color: palette.chipSelectedText }]}>
                {darkMode ? 'Light' : 'Dark'}
              </Text>
            </Pressable>
          )}
        </View>
        <Text
          style={[styles.headerTitle, { color: palette.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={[styles.sideSlot, styles.rightSlot]}>
          {headerRight ? headerRight({ canGoBack }) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    borderBottomWidth: 1,
  },
  headerBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  sideSlot: {
    minWidth: 80,
    justifyContent: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
  },
  themePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  themePillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '800',
  },
});
