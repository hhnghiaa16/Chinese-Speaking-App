import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/home/HomeHeader';

import { apiGet, apiPut } from '../services/api/apiClient';
import { useAuth } from '../services/auth/AuthContext';
import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const HSK_LEVELS = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'];
const TTS_VOICES = [
  { value: 'alloy', label: 'Alloy (Nam/Nữ - Đa dụng)' },
  { value: 'echo', label: 'Echo (Nam - Trầm ấm)' },
  { value: 'fable', label: 'Fable (Nam - Biểu cảm)' },
  { value: 'onyx', label: 'Onyx (Nam - Uy lực)' },
  { value: 'nova', label: 'Nova (Nữ - Năng động)' },
  { value: 'shimmer', label: 'Shimmer (Nữ - Rõ ràng)' },
];

export function ProfileScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [hskGoal, setHskGoal] = useState('HSK1');
  const [ttsVoice, setTtsVoice] = useState('alloy');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await apiGet<any>('/api/profile');
      if (data) {
        setDisplayName(data.displayName || '');
        setHskGoal(data.hskGoal || 'HSK1');
        setTtsVoice(data.ttsVoice || 'alloy');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      await apiPut('/api/profile', {
        displayName,
        hskGoal,
        ttsVoice,
      });
      Alert.alert('Thành công', 'Đã lưu thông tin của bạn!');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu thông tin');
    } finally {
      setSaving(false);
    }
  }

  function renderChips(
    options: { value: string; label: string }[] | string[],
    selectedValue: string,
    onSelect: (val: string) => void
  ) {
    return (
      <View style={styles.chipContainer}>
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          const isSelected = selectedValue === val;
          
          return (
            <Pressable
              key={val}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(val)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  if (loading) {
    return (
      <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator color={COLORS.yellow} size="large" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />
        
        <HomeHeader activeTab="profile" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {displayName ? displayName.charAt(0).toUpperCase() : '我'}
              </Text>
            </View>
            <Text style={styles.title}>Quản lý Hồ sơ</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Tên hiển thị</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Nhập tên của bạn"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Mục tiêu HSK</Text>
            {renderChips(HSK_LEVELS, hskGoal, setHskGoal)}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Giọng đọc AI (TTS Voice)</Text>
            {renderChips(TTS_VOICES, ttsVoice, setTtsVoice)}
            <Text style={styles.helpText}>
              Giọng này sẽ được dùng trong các bài hội thoại với AI.
            </Text>
          </View>

          <Pressable
            style={[styles.saveButton, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#1A1233" />
            ) : (
              <Text style={styles.saveButtonText}>Lưu Thay Đổi</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: signOut },
              ]);
            }}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất khỏi tài khoản</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.yellow,
    backgroundColor: 'rgba(245, 200, 75, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: COLORS.yellow,
    fontSize: 36,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: serifFont,
    fontSize: 28,
    fontWeight: '700',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chipSelected: {
    backgroundColor: 'rgba(245, 200, 75, 0.15)',
    borderColor: COLORS.yellow,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.yellow,
    fontWeight: '700',
  },
  helpText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  saveButton: {
    height: 54,
    backgroundColor: COLORS.yellow,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#1A1233',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: 24,
    alignItems: 'center',
    padding: 12,
  },
  logoutButtonText: {
    color: '#FF4B4B',
    fontSize: 15,
    fontWeight: '600',
  },
  glowOne: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(76, 29, 149, 0.26)',
    top: 100,
    left: -120,
  },
  glowTwo: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(37, 16, 100, 0.28)',
    top: 400,
    right: -110,
  },
});
