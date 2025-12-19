import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(0); // 0: email only, 1: code + password
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false); // Track success để check redirect
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth(); // Thêm getToken để verify session
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn || resetSuccess) {
      // Delay 1s để session stable, rồi redirect
      const timer = setTimeout(() => {
        router.replace('/');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isSignedIn, resetSuccess, router]);

  if (!isLoaded) {
    return null;
  }

  // Step 1: Send the password reset code
  const sendCode = async () => {
    if (!email) {
      setError('Vui lòng nhập email.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setStep(1);
      setError('');
      console.log('📧 Code gửi thành công đến:', email);
    } catch (err) {
      console.error('❌ Lỗi gửi code - Safe details:', {
        message: err?.message || 'No message',
        code: err?.code || 'Unknown',
        errors: err?.errors?.[0]?.code || 'No errors',
      });
      setError(err?.errors?.[0]?.longMessage || 'Lỗi gửi code. Thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code
  const resendCode = async () => {
    if (!email) return;
    setCode('');
    await sendCode();
  };

  // Step 2: Verify + Reset
  const verifyAndReset = async () => {
    if (!code || !password || !confirmPassword) {
      setError('Điền đầy đủ mã và mật khẩu.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (password.length < 8) {
      setError('Mật khẩu phải ít nhất 8 ký tự.');
      return;
    }
    const trimmedCode = code.replace(/[^0-9]/g, ''); // Chỉ số, loại dash/space
    if (trimmedCode.length !== 6) {
      setError('Mã phải đúng 6 chữ số.');
      return;
    }
    console.log('🔍 Verify với code:', trimmedCode);
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: trimmedCode,
        password,
      });
      console.log('🔍 Result status:', result?.status);
      if (result?.status === 'complete') {
        // Set session
        await setActive({ session: result.createdSessionId });
        // Verify token để chắc session active
        const token = await getToken();
        console.log('🔍 Session token created:', !!token);
        setResetSuccess(true); // Trigger redirect
        setError('');
        console.log('🎉 Reset & login thành công!');
      } else {
        setError('Reset thất bại. Thử lại.');
      }
    } catch (err) {
      console.error('❌ Lỗi verify/reset - Safe details:', {
        message: err?.message || 'No message',
        code: err?.code || 'Unknown',
        errors: err?.errors?.[0]?.code || 'No errors',
      });
      const errCode = err?.errors?.[0]?.code;
      if (errCode === 'form_code_incorrect') {
        setError('Mã sai hoặc hết hạn. Gửi lại mã.');
      } else if (errCode === 'form_password_invalid_length') {
        setError('Mật khẩu quá ngắn (cần ≥8 ký tự).');
      } else {
        setError(err?.errors?.[0]?.longMessage || 'Lỗi không xác định. Kiểm tra mạng/email.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} enableOnAndroid={true} enableAutomaticScroll={true}>
      <View style={styles.container}>
        <View style={styles.illustration} />
        <Text style={styles.title}>{step === 0 ? 'Quên Mật Khẩu?' : 'Xác Thực & Reset'}</Text>
        <Text style={styles.footerText}>
          {step === 0 ? 'Nhập email để nhận mã.' : 'Nhập mã 6 số từ email và mật khẩu mới (≥8 ký tự).'}
        </Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}><Ionicons name="close" size={20} color={COLORS.textLight} /></TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={email}
          placeholder="Email (e.g. tranthuan04102004@gmail.com)"
          placeholderTextColor="#9A8478"
          onChangeText={setEmail}
          editable={step === 0}
        />

        {step === 1 && (
          <>
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={code}
              placeholder="Mã 6 số từ email"
              placeholderTextColor="#9A8478"
              keyboardType="numeric"
              maxLength={6}
              onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))}
            />
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={password}
              placeholder="Mật khẩu mới (≥8 ký tự)"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={confirmPassword}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={setConfirmPassword}
            />
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={step === 0 ? sendCode : verifyAndReset} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Đang xử lý...' : (step === 0 ? 'Gửi Mã' : 'Reset & Đăng Nhập')}</Text>
        </TouchableOpacity>

        {step === 1 && (
          <>
            <TouchableOpacity onPress={resendCode} disabled={isLoading} style={{ marginTop: 10, alignSelf: 'center' }}>
              <Text style={[styles.linkText, { color: COLORS.primary }]}>Gửi lại mã</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setStep(0); setCode(''); setPassword(''); setConfirmPassword(''); setError(''); }}>
              <Text style={styles.linkText}>Quay lại</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Nhớ mật khẩu?</Text>
          <Link href="/sign-in" asChild><TouchableOpacity><Text style={styles.linkText}>Đăng nhập</Text></TouchableOpacity></Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
