import { useSignIn } from "@clerk/clerk-expo";
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
// import { useSignUp } from "@clerk/clerk-expo";
// import { useSignIn } from "@clerk/clerk-expo";



//import image
import FaceB from '../../assets/icons/ui/fb.svg';
import Googl from '../../assets/icons/ui/gg.svg';

//TRANG OTP có thể thay intro băng mail người dùng thật
export default function VerifyScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [filled, setFilled] = useState(false);
    // const { signUp } = useSignUp();
    const { isLoaded, signIn } = useSignIn();

    //Fix lỗi Clerk chưa load kịp nè
    if (!isLoaded) return null; // 👈 Clerk chưa load, đợi tí


    const [pendingVerification, setPendingVerification] = useState(false);
    useEffect(() => {
        if (pendingVerification) {
            const timer = setTimeout(() => {
                setPendingVerification(false);
            }, 30000); // 30 giây

            return () => clearTimeout(timer);
        }
    }, [pendingVerification]);

    const validateFields = () => {

        if (!email.includes("@")) return "Email không hợp lệ.";
        return null;
    };
    // const onGetOtpPress = async () => {
    //     if (!isLoaded) return;

    //     // ✅ kiểm tra client-side trước khi gọi Clerk
    //     const validationError = validateFields();
    //     if (validationError) {
    //         setError(validationError);
    //         return;
    //     }


    //         try {
    //             // Gọi API gửi OTP về email người dùng ở đây (nếu có)
    //             console.log("Gửi OTP đến:", email);
    //             setPendingVerification(true);
    //             Alert.alert("Thành công", "OTP đã được gửi tới email của bạn.");
    //         } catch (err) {
    //             setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    //         }

    //     };
    // Handle submission of verification form
    // const onVerifyPress = async () => {
    //     if (!isLoaded) return;

    //     try {
    //         // Use the code the user provided to attempt verification
    //         const signUpAttempt = await signUp.attemptEmailAddressVerification({
    //             code,
    //         });

    //         // If verification was completed, set the session to active
    //         // and redirect the user
    //         if (signUpAttempt.status === "complete") {
    //             await setActive({ session: signUpAttempt.createdSessionId });
    //             router.replace("/");
    //         } else {
    //             // If the status is not complete, check why. User may need to
    //             // complete further steps.
    //             console.error(JSON.stringify(signUpAttempt, null, 2));
    //         }
    //     } catch (err) {
    //         // See https://clerk.com/docs/custom-flows/error-handling
    //         // for more info on error handling
    //         console.error(JSON.stringify(err, null, 2));
    //     }
    // };
    const onGetOtpPress = async () => {
        if (!isLoaded) return;

        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            // Gọi Clerk để gửi mã khôi phục qua email
            await signIn.create({
                identifier: email, // email người dùng nhập
            });

            await signIn.prepareFirstFactor({
                strategy: "email_code",
            });

            setPendingVerification(true);
            Alert.alert("Đã gửi OTP", "Vui lòng kiểm tra email của bạn để nhận mã xác thực.");
            router.push({
                pathname: "/(auth)/otpScreen",
                params: { email },
            });
        } catch (err) {
            if (err.errors && err.errors.length > 0) {
                setError(err.errors[0].message);
            } else {
                setError("Không thể gửi OTP. Vui lòng thử lại.");
            }
            console.log("Forgot password error:", JSON.stringify(err, null, 2));
        }
    };



    return (
        <View style={styles.container}>
            {/* nút Back */}
            {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity> */}

            <Text style={styles.title}>Quên Mật Khẩu</Text>
            <Image style={styles.imgOtp} source={require("../../assets/images/decor/forgot.png")} />

            <LinearGradient
                colors={["#FFF4F1", "#F8D8D1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.label}>Quên mật khẩu?</Text>
                <Text style={styles.desc}>
                    Đừng lo lắng! Chỉ cần nhập địa chỉ email được liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu.
                </Text>

                <View style={styles.emailField}>
                    <Text style={styles.labelUser}>Nhập Email của bạn</Text>
                    <TextInput
                        style={[styles.input, error && styles.errorInput]}
                        autoCapitalize="none"
                        value={email}
                        placeholderTextColor="#DCBEB6"
                        placeholder="Nhập email"
                        onChangeText={(email) => {
                            setEmail(email);
                            setFilled(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
                        }}
                    />
                </View>



                {/* Nút nhận OTP */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.buttonWrapper}
                    disabled={!filled}
                    onPress={onGetOtpPress}
                >
                    <LinearGradient
                        colors={filled ? ["#ffbdb0ff", "#eca190ff"] : ["#F3D8D1", "#ffcec3ff"]}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Nhận OTP</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Đăng nhập với Facebook và Google */}
                <View style={styles.otherbox}>
                    <Text style={styles.otherText}>Đăng nhập với</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => router.push("/(auth)/sign_in_test")}>
                            <FaceB style={styles.iconfb} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("/(auth)/sign_in_test")}>
                            <Googl style={styles.icongg} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
                        <Text style={styles.linkText}>Đăng ký</Text>
                    </TouchableOpacity>
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
        width: wpA(150),
        height: hpA(150),
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
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: hpA(16),
    },
    label: {
        ...theme.typography.headline1,
        color: theme.colors.textPrimary,
        marginBottom: hpA(8),
        alignSelf: "left",
    },

    emailField: {
        marginTop: hpA(4),
        marginHorizontal: wpA(12),
        alignSelf: "center",

    },
    labelUser: {
        // marginLeft: 15,
        color: '#000',
        // fontSize: 15,
        ...theme.typography.headline3,
        ...theme.colors.dark_mode_icon_square,
        flexShrink: 0,
        zIndex: 10,
    },
    input: {
        backgroundColor: colors.white,
        borderRadius: 17,
        alignSelf: "center",
        ...theme.shadows.drop,
        // overflow: "hidden",
        opacity: 0.99,
        paddingStart: 16,// cắt phần thừa
        ...theme.typography.body2,
        width: wpA(344),
        height: hpA(45),
        marginTop: hpA(8),
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
        height: hpA(45),
        borderRadius: 16,
        paddingVertical: hpA(12),
        alignItems: "center",
        justifyContent: "center",
        marginTop: hpA(24),
        ...theme.shadows.drop,
    },
    buttonText: {
        ...theme.typography.label1,
        color: "#FFFFFF",
        lineHeight: hpA(16 * 1.3),
    },
    otherbox: {
        marginTop: hpA(40),
        alignSelf: "center",
        alignItems: "center",
    },
    otherText: {
        ...theme.typography.headline2,
        ...theme.colors.dark_mode_icon_square,
        marginBottom: hpA(16),
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: wpA(120),
        elevation: 8,
        ...theme.shadows.drop,

    },
    iconfb: {
        width: wpA(50),
        height: hpA(50),

        // elevation: 5,

    },
    icongg: {
        width: wpA(50),
        height: hpA(50),
        // ...theme.shadows.drop,

    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hpA(30),

    },
    footerText: {
        ...theme.typography.headline3,
        ...theme.colors.dark_mode_icon_square,
        marginRight: 8,
    },
    linkText: {
        ...theme.typography.headline3,
        color: '#CC0000',
        fontWeight: '600',
        marginLeft: -4,
    },

});
