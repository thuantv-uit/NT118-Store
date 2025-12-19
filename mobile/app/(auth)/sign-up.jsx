import { styles } from "@/assets/styles/auth.styles.js";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../../constants/colors";
import { API_URL } from "../../constants/api";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("buyer");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const API_BASE = API_URL;

  const syncCustomerProfile = async (userId) => {
    if (!userId) return;
    const formPayload = new FormData();
    formPayload.append("id", userId);
    formPayload.append("first_name", firstName);
    formPayload.append("last_name", lastName);
    formPayload.append("phone_number", phoneNumber);
    formPayload.append("role", role);
    formPayload.append("email", emailAddress);
    formPayload.append("password", "default");
    formPayload.append("address", "");
    formPayload.append("avatar", "https://res.cloudinary.com/demo/image/upload/v1699999999/default-avatar.png");
    formPayload.append("emaiil", emailAddress); // backend typo-safe

    const postCustomer = async () => {
      return fetch(`${API_BASE}/customers`, {
        method: "POST",
        body: formPayload,
        headers: { "Content-Type": "multipart/form-data" },
      });
    };

    const putCustomer = async () => {
      return fetch(`${API_BASE}/customers/${userId}`, {
        method: "PUT",
        body: formPayload,
        headers: { "Content-Type": "multipart/form-data" },
      });
    };

    try {
      let response = await postCustomer();
      if (response.status === 409) {
        // hồ sơ đã tồn tại → cập nhật thay vì tạo
        response = await putCustomer();
      }
      if (!response.ok) {
        const message = await response.text();
        console.warn("Không thể đồng bộ hồ sơ khách hàng:", message);
      }
    } catch (syncErr) {
      console.warn("Sync profile failed", syncErr);
    }
  };

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!firstName || !lastName || !phoneNumber || !role || !emailAddress || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
        unsafeMetadata: {
          phone_number: phoneNumber,
          role,
        },
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.log(err);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        await syncCustomerProfile(signUpAttempt.createdUserId);
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.verificationInput, error && styles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={(code) => setCode(code)}
        />

        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image source={require("../../assets/images/welcome/Logo_welcome.svg")} style={styles.illustration} contentFit="contain" />

        <Text style={styles.title}>Create Account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="words"
          value={lastName}
          placeholderTextColor="#9A8478"
          placeholder="Họ"
          onChangeText={(text) => setLastName(text)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="words"
          value={firstName}
          placeholderTextColor="#9A8478"
          placeholder="Tên"
          onChangeText={(text) => setFirstName(text)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={phoneNumber}
          placeholder="Số điện thoại"
          placeholderTextColor="#9A8478"
          keyboardType="phone-pad"
          onChangeText={(text) => setPhoneNumber(text)}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          {['buyer', 'seller', 'shipper'].map((option) => {
            const isSelected = role === option;
            return (
              <TouchableOpacity
                key={option}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isSelected ? COLORS.primary : COLORS.border,
                  backgroundColor: isSelected ? COLORS.primary : COLORS.white,
                  alignItems: 'center',
                  marginHorizontal: 4,
                }}
                onPress={() => setRole(option)}
              >
                <Text style={{ color: isSelected ? COLORS.white : COLORS.text, fontWeight: '700' }}>
                  {option === 'buyer' ? 'Người mua' : option === 'seller' ? 'Người bán' : 'Shipper'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholderTextColor="#9A8478"
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />

        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
