import { styles } from "@/assets/styles/auth.styles.js";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../constants/api";
import { COLORS } from "../../constants/colors";

const DEFAULT_AVATAR ="https://res.cloudinary.com/dprqatuel/image/upload/v1767608216/customer_avatars/acf4wplrbnvg3x2rumsj.jpg";

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

  // Chỉ gửi đúng 6 trường theo cấu trúc bảng customer
  const syncCustomerProfile = async (userId) => {
    if (!userId) return;

    const formPayload = new FormData();
    formPayload.append("id", userId);
    formPayload.append("first_name", firstName.trim());
    formPayload.append("last_name", lastName.trim());
    formPayload.append("phone_number", phoneNumber.trim());
    formPayload.append("avatar", DEFAULT_AVATAR);
    formPayload.append("role", role);

    const postCustomer = async () => {
      return fetch(`${API_BASE}/customers`, {
        method: "POST",
        body: formPayload,
        // Không cần set header Content-Type khi dùng FormData trên React Native
        // Browser/Fetch sẽ tự set đúng với boundary
      });
    };

    const putCustomer = async () => {
      return fetch(`${API_BASE}/customers/${userId}`, {
        method: "PUT",
        body: formPayload,
      });
    };

    try {
      let response = await postCustomer();
      if (response.status === 409) {
        // Đã tồn tại → cập nhật
        response = await putCustomer();
      }

      if (!response.ok) {
        const message = await response.text();
        console.warn("Không thể đồng bộ hồ sơ khách hàng:", message);
        // Có thể thêm thông báo lỗi cho user nếu cần
      }
    } catch (err) {
      console.warn("Sync profile failed:", err);
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!firstName || !lastName || !phoneNumber || !emailAddress || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      setError("");
    } catch (err) {
      console.error("Sign up error:", err);
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("Email này đã được sử dụng. Vui lòng thử email khác.");
      } else {
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        // Đồng bộ profile về backend chỉ sau khi verify thành công
        await syncCustomerProfile(signUpAttempt.createdUserId);

        router.replace("/");
      } else {
        setError("Mã xác thực không đúng. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Mã xác thực không hợp lệ. Vui lòng kiểm tra lại.");
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Xác minh email</Text>

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
          placeholder="Nhập mã xác thực"
          placeholderTextColor="#9A8478"
          keyboardType="number-pad"
          onChangeText={setCode}
        />

        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Xác minh</Text>
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
        <Image
          source={{ uri: "https://res.cloudinary.com/dprqatuel/image/upload/v1767707067/Logo_welcome_ox6sil.svg" }}
          style={styles.illustration}
          contentFit="contain"
        />

        <Text style={styles.title}>Tạo tài khoản</Text>

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
          placeholder="Họ"
          placeholderTextColor="#9A8478"
          onChangeText={setLastName}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="words"
          value={firstName}
          placeholder="Tên"
          placeholderTextColor="#9A8478"
          onChangeText={setFirstName}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={phoneNumber}
          placeholder="Số điện thoại"
          placeholderTextColor="#9A8478"
          keyboardType="phone-pad"
          onChangeText={setPhoneNumber}
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          {["buyer", "seller", "shipper"].map((option) => {
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
                  alignItems: "center",
                  marginHorizontal: 4,
                }}
                onPress={() => setRole(option)}
              >
                <Text style={{ color: isSelected ? COLORS.white : COLORS.text, fontWeight: "700" }}>
                  {option === "buyer" ? "Người mua" : option === "seller" ? "Người bán" : "Shipper"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email"
          placeholderTextColor="#9A8478"
          keyboardType="email-address"
          onChangeText={setEmailAddress}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Mật khẩu"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
