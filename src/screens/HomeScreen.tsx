import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  NativeModules,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLanguageByCode, LANGUAGES } from '../constants/languages';
import { LanguageModal } from '../components/LanguageModal';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

const { SettingsBridge } = NativeModules;

export const HomeScreen: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [myLanguages, setMyLanguages] = useState<string[]>(['en', 'fr']);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showMyLangsModal, setShowMyLangsModal] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const langConfig = await SettingsBridge.getLanguages();
      setSourceLang(langConfig.sourceLang || 'en');
      setTargetLang(langConfig.targetLang || 'fr');
      const myLangsStr: string = await SettingsBridge.getMyLanguages();
      const codes = myLangsStr.split(',').filter((c: string) => c.length > 0);
      if (codes.length > 0) setMyLanguages(codes);
    } catch {}
  };

  const handleSave = useCallback(async () => {
    try {
      await SettingsBridge.saveLanguages(sourceLang, targetLang);
      await SettingsBridge.saveMyLanguages(myLanguages.join(','));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      Alert.alert('Error', 'Failed to save settings');
    }
  }, [sourceLang, targetLang, myLanguages]);

  const openInputSettings = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.INPUT_METHOD_SETTINGS');
    }
  };

  const openKeyboardChooser = () => {
    if (Platform.OS === 'android') {
      Linking.sendIntent('android.settings.INPUT_METHOD_SUBTYPE_SETTINGS');
    }
  };

  const sourceLangData = getLanguageByCode(sourceLang);
  const targetLangData = getLanguageByCode(targetLang);

  const myLangItems = myLanguages
    .map((code) => LANGUAGES.find((l) => l.code === code))
    .filter(Boolean);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>SmartType</Text>
            <Text style={styles.subtitle}>AI-Powered Keyboard</Text>
          </View>

          {/* Enable Keyboard Section */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Setup Keyboard</Text>
            <Text style={styles.cardDesc}>
              Enable SmartType as your keyboard, then select it as your active input method.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={openInputSettings}>
              <Text style={styles.primaryButtonText}>1. Enable in Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryButton, styles.secondaryButton]} onPress={openKeyboardChooser}>
              <Text style={styles.primaryButtonText}>2. Choose SmartType Keyboard</Text>
            </TouchableOpacity>
          </View>

          {/* My Languages */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>My Languages</Text>
            <Text style={styles.cardDesc}>
              Choose 2-5 languages to quickly switch between on the keyboard. Tap the globe key to cycle, swipe the spacebar to switch.
            </Text>
            <View style={styles.chipRow}>
              {myLangItems.map((lang) => (
                <View key={lang!.code} style={styles.chip}>
                  <Text style={styles.chipFlag}>{lang!.flag}</Text>
                  <Text style={styles.chipText}>{lang!.name}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: SPACING.md }]}
              onPress={() => setShowMyLangsModal(true)}
            >
              <Text style={styles.primaryButtonText}>Edit My Languages</Text>
            </TouchableOpacity>
          </View>

          {/* Default Translation Languages */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Translation Languages</Text>
            <Text style={styles.cardDesc}>
              Choose the default source and target languages for translation.
            </Text>
            <View style={styles.langRow}>
              <TouchableOpacity
                style={styles.langButton}
                onPress={() => setShowSourceModal(true)}
              >
                <Text style={styles.langFlag}>{sourceLangData?.flag}</Text>
                <View>
                  <Text style={styles.langLabel}>From</Text>
                  <Text style={styles.langName}>{sourceLangData?.name}</Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.arrow}>{'\u2192'}</Text>

              <TouchableOpacity
                style={styles.langButton}
                onPress={() => setShowTargetModal(true)}
              >
                <Text style={styles.langFlag}>{targetLangData?.flag}</Text>
                <View>
                  <Text style={styles.langLabel}>To</Text>
                  <Text style={styles.langName}>{targetLangData?.name}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, saved && styles.saveButtonSaved]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {saved ? 'Saved!' : 'Save Settings'}
            </Text>
          </TouchableOpacity>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              1. Type normally using SmartType in any app{'\n'}
              2. Tap the translate icon at the top-right of the keyboard{'\n'}
              3. The translation bar expands — tap Translate{'\n'}
              4. Tap the result to replace your text
            </Text>
          </View>

          <View style={styles.infoCard2}>
            <Text style={styles.infoTitle}>Keyboard Features</Text>
            <Text style={styles.infoText}>
              {'\u2022'} 20 languages with native keyboard layouts{'\n'}
              {'\u2022'} Tap globe to cycle your chosen languages{'\n'}
              {'\u2022'} Long-press globe for the full language list{'\n'}
              {'\u2022'} Swipe spacebar left/right to switch language{'\n'}
              {'\u2022'} Tap the emoji key for emojis{'\n'}
              {'\u2022'} Collapsible translation bar — clean by default
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>

      <LanguageModal
        visible={showSourceModal}
        onClose={() => setShowSourceModal(false)}
        onSelect={(lang) => { setSourceLang(lang.code); setShowSourceModal(false); }}
        selectedCode={sourceLang}
        title="Source Language"
      />
      <LanguageModal
        visible={showTargetModal}
        onClose={() => setShowTargetModal(false)}
        onSelect={(lang) => { setTargetLang(lang.code); setShowTargetModal(false); }}
        selectedCode={targetLang}
        title="Target Language"
      />
      <LanguageModal
        visible={showMyLangsModal}
        onClose={() => setShowMyLangsModal(false)}
        title="My Languages"
        multiSelect
        selectedCodes={myLanguages}
        onMultiSelect={setMyLanguages}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  scroll: { padding: SPACING.xl },
  header: { marginBottom: SPACING.xxl, paddingTop: SPACING.xl },
  title: {
    color: COLORS.textPrimary,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  cardDesc: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  secondaryButton: {
    backgroundColor: COLORS.surfaceLight,
    marginBottom: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.keySpecial,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  chipFlag: { fontSize: 18 },
  chipText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.keySpecial,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  langFlag: { fontSize: 28 },
  langLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
  langName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  arrow: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.xxl,
    marginHorizontal: SPACING.lg,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  saveButtonSaved: {
    backgroundColor: '#2ECC71',
  },
  saveButtonText: {
    color: '#000000',
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: COLORS.translationBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.translationBorder,
    marginBottom: SPACING.xl,
  },
  infoCard2: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoTitle: {
    color: COLORS.accent,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
});
