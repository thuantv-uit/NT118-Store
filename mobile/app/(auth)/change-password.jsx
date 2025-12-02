import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';

export default function ChangePasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth(); // Thêm để check login status
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      // Nếu chưa login, redirect về sign-in
      router.replace('/sign-in');
    }
  }, [isSignedIn, router]);

  // Loading spinner nếu chưa load
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textLight }}>Đang tải...</Text>
      </View>
    );
  }

  if (!user || !isSignedIn) {
    return null; // Hoặc redirect, nhưng giờ đã handle ở useEffect
  }

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ mật khẩu.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải ít nhất 8 ký tự.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await user.update({ password: newPassword });
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.', [
        { text: 'OK', onPress: () => {
          // Optional: Logout sau khi thay đổi
          // import { useClerk } from '@clerk/clerk-expo'; const { signOut } = useClerk(); signOut();
          router.replace('/sign-in');
        } }
      ]);
      setNewPassword('');
      setConfirmPassword('');
      console.log('🔒 Mật khẩu cập nhật thành công cho user:', user.emailAddresses[0]?.emailAddress);
    } catch (err) {
      // Safe error logging, tránh cyclical JSON
      console.error('❌ Lỗi khi update password - Safe details:', {
        message: err?.message || 'No message',
        code: err?.code || 'Unknown',
        errors: err?.errors?.[0]?.code || 'No errors',
      });
      setError(err?.errors?.[0]?.longMessage || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <View style={styles.illustration} />
        <Text style={styles.title}>Thay Đổi Mật Khẩu</Text>
        <Text style={styles.footerText}>Nhập mật khẩu mới mạnh mẽ (ít nhất 8 ký tự).</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={newPassword}
          placeholder="Mật khẩu mới"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(text) => setNewPassword(text)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={confirmPassword}
          placeholder="Xác nhận mật khẩu mới"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={updatePassword} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Vấn đề? </Text>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.linkText}>Quên mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}