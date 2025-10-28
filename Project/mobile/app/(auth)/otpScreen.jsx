import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Keyboard,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { theme } from "@/theme";
import { wpA, hpA } from "@/utils/scale";
import { colors } from "@/theme/colors";
import { useSignIn } from "@clerk/clerk-expo";

// const { isLoaded, signIn } = useSignIn();


//TRANG OTP có thể thay intro băng mail người dùng thật
export default function VerifyScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [filled, setFilled] = useState(false);

    // animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const hiddenInput = useRef(null);
    const [cursorIndex, setCursorIndex] = useState(0);

    const [resending, setResending] = useState(false);
    const [timer, setTimer] = useState(0);

    const { isLoaded, signIn, setActive } = useSignIn();


    //Fix lỗi Clerk chưa load kịp nè
    if (!isLoaded) return null; // 👈 Clerk chưa load, đợi tí

    // lắng nghe thay đổi OTP
    const handleTextChange = (text) => {
        // chỉ giữ ký tự số
        const clean = text.replace(/\D/g, "").slice(0, 6);
        const arr = clean.split("");
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) newOtp[i] = arr[i] || "";
        setOtp(newOtp);
        setFilled(newOtp.every((v) => v !== ""));
    };

    // Khi bấm backspace trong hidden input
    const handleKeyPress = (e) => {
        if (e.nativeEvent.key === "Backspace") {
            const filledCount = otp.filter((v) => v !== "").length;
            if (filledCount > 0) {
                const newOtp = [...otp];
                newOtp[filledCount - 1] = "";
                setOtp(newOtp);
                setFilled(false);
            }
        }
    };

    const onVerifyPress = async () => {
  if (!isLoaded) return;

  try {
    const attempt = await signIn.attemptFirstFactor({
      strategy: "email_code",
      code,
    });

    if (attempt.status === "complete") {
      await setActive({ session: attempt.createdSessionId });
      router.replace("/reset_password"); // hoặc vào trang đặt lại mật khẩu
    } else {
      console.log("Attempt result:", JSON.stringify(attempt, null, 2));
    }
  } catch (err) {
    console.error("OTP verify error:", JSON.stringify(err, null, 2));
  }
};

    // Hàm xử lý gửi lại OTP
    const resendOtp = async () => {
        if (resending || timer > 0) return; // tránh spam

        setResending(true);

        try {
            // 👉 Đây là nơi gọi API thực tế (nếu có backend)
            // await api.sendOTP(emailAddress);
            console.log("Đã gửi lại mã OTP!");

            Alert.alert("Thông báo", "Mã xác nhận mới đã được gửi đến email của bạn.");

            // Đếm ngược 30 giây để chặn gửi lại liên tục
            setTimer(30);
            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (error) {
            console.error("Gửi lại OTP thất bại:", error);
            Alert.alert("Lỗi", "Không thể gửi lại mã OTP. Vui lòng thử lại.");
        } finally {
            setResending(false);
        }
    };

    // hiệu ứng đổi icon
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: filled ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: filled ? 1.1 : 1,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    }, [filled]);

    return (
        <View style={styles.container}>
            {/* nút Back */}
            {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity> */}

            <Text style={styles.title}>Xác minh tài khoản</Text>
            <Image style={styles.imgOtp} source={require("../../assets/images/decor/otp.png")} />

            <LinearGradient
                colors={["#FFF4F1", "#F8D8D1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.desc}>
                    Chúng tôi đã gửi mã 6 chữ số tới{" "}
                    <Text style={{ fontWeight: "600" }}>personal@email.com</Text>.{"\n"}
                    Nhập mã bên dưới để xác nhận email.
                </Text>

                <Text style={styles.label}>Nhập OTP:</Text>

                {/* Nhóm ô OTP */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => hiddenInput.current.focus()}
                    style={styles.otpRow}
                >
                    {otp.map((digit, i) => (
                        <View
                            key={i}
                            style={[
                                styles.otpBox,
                                digit && styles.otpFilled,
                                filled && styles.otpAllFilled,
                            ]}
                        >
                            <Text style={styles.otpText}>{digit}</Text>
                        </View>
                    ))}
                </TouchableOpacity>

                {/* Hidden input: người dùng chỉ gõ ở đây */}
                <TextInput
                    ref={hiddenInput}
                    style={styles.hiddenInput}
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp.join("")}
                    onChangeText={handleTextChange}
                    onKeyPress={handleKeyPress}
                    autoFocus
                />

                {/* Icon trạng thái */}
                <View style={styles.iconRow}>
                    <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
                        {/* Ảnh kem */}
                        <Animated.View
                            style={[styles.overlay, {
                                opacity: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                            }]}
                        >
                            <Image
                                source={require("../../assets/icons/ui/veri_light.png")}
                                style={styles.iconImg}
                                contentFit="contain"
                            />
                        </Animated.View>

                        {/* Ảnh nâu */}
                        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                            <Image
                                source={require("../../assets/icons/ui/veri_dark.png")}
                                style={styles.iconImg}
                                contentFit="contain"
                            />
                        </Animated.View>
                    </Animated.View>
                </View>

                {/* Nút xác minh */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.buttonWrapper}
                    onPress={() => console.log("OTP:", otp.join(""))}
                >
                    <LinearGradient
                        colors={filled ? ["#ebc8c1ff", "#faad9aff"] : ["#F3D8D1", "#EBD1CB"]}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Xác minh</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* <Text style={styles.resend}>
                    Nếu bạn chưa nhận được mã,{" "}
                    <Text style={styles.resendHighlight}>GỬI LẠI</Text>
                </Text> */}

                {/* <View style={styles.footerContainer}>
                    <Text style={styles.resend}>Nếu bạn chưa nhận được mã?</Text>
                    <TouchableOpacity onPress={() => router.push("")}>
                        <Text style={styles.resendHighlight}>GỬI LẠI</Text>
                        // tùy chỉnh hành động gửi lại mã
                    </TouchableOpacity>
                </View> */}

                <View style={styles.footerContainer}>
                    <Text style={styles.resend}>Nếu bạn chưa nhận được mã?</Text>

                    {timer > 0 ? (
                        <Text style={[styles.resendHighlight, { opacity: 0.6 }]}>
                            Gửi lại sau {timer}s
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={resendOtp} disabled={resending}>
                            <Text
                                style={[
                                    styles.resendHighlight,
                                    resending && { opacity: 0.5 },
                                ]}
                            >
                                Gửi lại
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>



            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors['#FFF4F1'],
        alignItems: "center",
        // paddingTop: hpA(60),
    },
    backButton: {
        position: "absolute",
        top: hpA(48),
        left: wpA(24),
    },
    title: {
        ...theme.typography.title1,
        color: "#C97C68",
        marginTop: hpA(56),
        // marginBottom: hpA(24),
    },
    imgOtp: {
        width: wpA(100),
        height: hpA(100),
        marginTop: hpA(36),
        marginBottom: hpA(24),
    },
    card: {
        width: wpA(388),
        borderRadius: 24,
        paddingVertical: hpA(24),
        paddingHorizontal: wpA(20),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        ...theme.shadows.drop,
    },
    desc: {
        ...theme.typography.caption2,
        color: theme.colors.textSecondary,
        marginBottom: hpA(16),
    },
    label: {
        ...theme.typography.headline1,
        color: theme.colors.textPrimary,
        marginBottom: hpA(8),
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hpA(16),
    },
    otpBox: {
        width: wpA(46),
        height: hpA(56),
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E0C7C0",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        ...theme.shadows.drop,
    },
    otpText: {
        fontSize: 20,
        color: "#C97C68",
    },
    otpFilled: {
        borderColor: "#C97C68",
        ...theme.typography.title1,
    },
    otpAllFilled: {
        borderColor: "#C97C68",
        shadowOpacity: 0.15,
    },
    hiddenInput: {
        position: "absolute",
        opacity: 0,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: hpA(12),
    },
    iconWrapper: {
        width: 40,
        height: 40,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    overlay: {
        position: "absolute",
        width: 40,
        height: 40,
    },
    iconImg: {
        width: "100%",
        height: "100%",
    },
    buttonWrapper: { alignItems: "center" },
    button: {
        width: wpA(140),
        height: hpA(40),
        borderRadius: 16,
        paddingVertical: hpA(12),
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadows.drop,
    },
    buttonText: {
        ...theme.typography.label1,
        color: "#FFFFFF",
        lineHeight: hpA(16),
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        marginTop: hpA(16),
    },
    resend: {
        ...theme.typography.headline2,
        color: theme.colors.dark_mode_icon_square,
        textAlign: "center",
        // marginTop: hpA(8),
    },
    resendHighlight: {
        color: "#C97C68",
        fontWeight: "600",
        ...theme.typography.headline1,
    },
});
