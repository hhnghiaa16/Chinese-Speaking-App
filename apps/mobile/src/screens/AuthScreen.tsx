import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '../services/auth/supabaseClient';
import { COLORS } from '../theme/colors';
import { serifFont } from '../theme/typography';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Đăng nhập thất bại', error.message);
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Đăng ký thất bại', error.message);
    } else if (!session) {
      Alert.alert('Đăng ký thành công', 'Vui lòng kiểm tra email để xác thực tài khoản!');
    }
    setLoading(false);
  }

  return (
    <LinearGradient colors={['#050316', '#08051F', '#050316']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <Text style={styles.title}>LanApp</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Đăng nhập để tiếp tục' : 'Tạo tài khoản mới'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@example.com"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
              />
            </View>

            <Pressable
              style={[styles.mainButton, loading && styles.mainButtonDisabled]}
              disabled={loading}
              onPress={isLogin ? signInWithEmail : signUpWithEmail}
            >
              {loading ? (
                <ActivityIndicator color="#1A1233" />
              ) : (
                <Text style={styles.mainButtonText}>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.switchButton}
              disabled={loading}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    padding: 24,
    borderRadius: 24,
    backgroundColor: 'rgba(11, 8, 36, 0.8)',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  title: {
    fontSize: 36,
    fontFamily: serifFont,
    color: COLORS.yellow,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: COLORS.textPrimary,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainButton: {
    height: 52,
    backgroundColor: COLORS.yellow,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  mainButtonDisabled: {
    opacity: 0.7,
  },
  mainButtonText: {
    color: '#1A1233',
    fontSize: 16,
    fontWeight: '700',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
    padding: 8,
  },
  switchText: {
    color: COLORS.purpleLight,
    fontSize: 14,
  },
});
