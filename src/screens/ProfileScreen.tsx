import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props) {
  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>我</Text>
          </View>

          <Text style={styles.eyebrow}>CÁ NHÂN</Text>
          <Text style={styles.title}>Khu quản lý người học</Text>
          <Text style={styles.description}>
            Đây là chỗ để sau này thêm hồ sơ, mục tiêu HSK, lịch sử luyện nói, cài đặt giọng
            đọc và tài khoản người dùng.
          </Text>

          <Pressable style={styles.button} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Về trang chủ</Text>
          </Pressable>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(45, 10, 145, 0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },
  eyebrow: {
    color: COLORS.yellow,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 14,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: serifFont,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 16,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.purple,
    borderRadius: 999,
    marginTop: 30,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
