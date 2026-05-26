import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../theme/colors';
import { serifFont } from '../../theme/typography';
import { RootStackParamList } from '../../types/navigation';

type HeaderTab = 'practice' | 'progress' | 'profile';

type HomeHeaderProps = {
  activeTab?: HeaderTab;
  showBackButton?: boolean;
  onPracticePress?: () => void;
  onProgressPress?: () => void;
  onProfilePress?: () => void;
};

export function HomeHeader({
  activeTab,
  showBackButton = true,
  onPracticePress,
  onProgressPress,
  onProfilePress,
}: HomeHeaderProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const canGoBack = navigation.canGoBack();

  const handlePracticePress = onPracticePress ?? (() => navigation.navigate('Level'));
  const handleProgressPress = onProgressPress ?? (() => navigation.navigate('Progress'));
  const handleProfilePress = onProfilePress ?? (() => navigation.navigate('Profile'));
  const handleBackPress = () => {
    if (canGoBack) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Home');
  };

  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        {showBackButton && canGoBack ? (
          <Pressable
            accessibilityLabel="Quay lại"
            hitSlop={8}
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <ChevronLeft color={COLORS.textPrimary} size={18} strokeWidth={1.8} />
          </Pressable>
        ) : null}

        <Pressable hitSlop={10} style={styles.logoBox} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.logoText}>華</Text>
        </Pressable>

        <View style={styles.brandText}>
          <Text style={styles.brandName}>華語 Lab</Text>
          <Text style={styles.subtitle}>SPEAK CHINESE</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <View style={styles.nav}>
          <Pressable
            hitSlop={8}
            style={[styles.navButton, activeTab === 'practice' && styles.navButtonActive]}
            onPress={handlePracticePress}
          >
            <Text
              style={[styles.navItem, activeTab === 'practice' && styles.navItemActive]}
            >
              Luyện tập
            </Text>
          </Pressable>

          <Pressable
            hitSlop={8}
            style={[styles.navButton, activeTab === 'progress' && styles.navButtonActive]}
            onPress={handleProgressPress}
          >
            <Text
              style={[styles.navItem, activeTab === 'progress' && styles.navItemActive]}
            >
              Tiến độ
            </Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityLabel="Quản lý cá nhân"
          hitSlop={8}
          style={[
            styles.profileButton,
            activeTab === 'profile' && styles.profileButtonActive,
          ]}
          onPress={handleProfilePress}
        >
          <Text style={styles.profileText}>我</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(8, 5, 31, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1A3D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flexShrink: 0,
  },
  brandText: {
    maxWidth: 66,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(5, 3, 22, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  brandName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: serifFont,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 8,
    letterSpacing: 1.2,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  navButton: {
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  navButtonActive: {
    backgroundColor: 'rgba(45, 10, 145, 0.88)',
  },
  navItem: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  navItemActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  profileButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: 'rgba(45, 10, 145, 0.36)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonActive: {
    borderColor: COLORS.purpleLight,
    backgroundColor: COLORS.purple,
  },
  profileText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
