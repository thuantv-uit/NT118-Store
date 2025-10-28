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
import { Icon } from "../../components/ui/icon";
// import { useSignUp } from "@clerk/clerk-expo";
// import { useSignIn } from "@clerk/clerk-expo";



//import image
import FaceB from '../../assets/icons/ui/fb.svg';
import Googl from '../../assets/icons/ui/gg.svg';

//TRANG OTP có thể thay intro băng mail người dùng thật
export default function ResetPasswordScreen() {
    const router = useRouter();
    // const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);



    const [error, setError] = useState("");
    const [filled, setFilled] = useState(false);
    // const { signUp } = useSignUp();
    const { isLoaded, signIn } = useSignIn();

    const [pendingVerification, setPendingVerification] = useState(false);


    const validateFields = () => {
        if (!password || !confirmPassword)
            return "Vui lòng nhập đầy đủ mật khẩu.";

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|\\:;"'<>,.?/]).{8,}$/;
        if (!passwordRegex.test(password))
            return "Mật khẩu phải có ít nhất 8 ký tự gồm: chữ hoa, chữ thường, số và ký tự đặc biệt.";
        if (password !== confirmPassword) return "Xác nhận mật khẩu không trùng khớp.";

        return null;
    };

    const onResetPasswordPress = async () => {
        if (!isLoaded) return;

        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            // Thực hiện đổi mật khẩu (sau khi đã xác minh OTP)
            const result = await signIn.updatePassword({
                password, // mật khẩu mới
            });

            if (result.status === "complete") {
                Alert.alert("Thành công", "Mật khẩu của bạn đã được đổi thành công!");
                router.push("/(auth)/sign_in"); // chuyển về màn đăng nhập
            } else {
                setError("Không thể đổi mật khẩu. Vui lòng thử lại.");
                console.log("Reset password result:", result);
            }
        } catch (err) {
            console.log("Reset password error:", JSON.stringify(err, null, 2));
            if (err.errors && err.errors.length > 0) {
                setError(err.errors[0].message);
            } else {
                setError("Có lỗi xảy ra khi đặt lại mật khẩu.");
            }
        }
    };


    return (
        <View style={styles.container}>
            {/* nút Back */}
            {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity> */}

            <Text style={styles.title}>Đặt Lại Mật Khẩu</Text>
            <Image style={styles.imgOtp} source={require("../../assets/images/decor/reset_password.png")} />
            <Text style={styles.label}>Đổi mật khẩu</Text>
            <Text style={styles.desc}>
                Vui lòng nhập mật khẩu mới của bạn bên dưới. Đảm bảo mật khẩu dài ít nhất 8 ký tự và bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
            </Text>

            <LinearGradient
                colors={["#FFF4F1", "#F8D8D1"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.card}
            >
                <View style={styles.passwordField}>
                    <Text style={styles.labelUser}>Mật khẩu</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={passwordRef}
                            style={styles.input}
                            value={showPassword ? password : "●".repeat(password.length)} // dùng dấu "●" to và tròn hơn
                            // value={password}                 // ✅ controlled
                            secureTextEntry={false}  // ✅ toggle ẩn/hiện
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#DCBEB6"
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword((v) => !v)}
                            style={styles.eyeInside}
                            activeOpacity={0.7}
                        >
                            <Icon
                                name={showPassword ? "eye_open" : "eye_close"}
                                size={wpA(22)}
                                color={colors.hmee04}
                            />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.confirmPasswordField}>
                    <Text style={styles.labelUser}>Xác nhận mật khẩu</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={confirmRef}
                            style={[styles.input, error && styles.errorInput]}
                            // value={confirmPassword}                 // ✅ controlled
                            // secureTextEntry={!showConfirmPassword}  // ✅ state riêng
                            secureTextEntry={false}  // ✅ state riêng
                            value={showConfirmPassword ? confirmPassword : "●".repeat(confirmPassword.length)} // dùng dấu "●" to và tròn hơn
                            placeholder="Nhập lại mật khẩu"
                            placeholderTextColor="#DCBEB6"
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword((v) => !v)}
                            style={styles.eyeInside}
                            activeOpacity={0.7}
                        >
                            <Icon
                                name={showConfirmPassword ? "eye_open" : "eye_close"}
                                size={wpA(22)}
                                color={colors.hmee04}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {error ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={"#a30303ff"} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError("")}>
                            <Ionicons name="close" size={20} color="#a30303ff" />
                        </TouchableOpacity>
                    </View>
                ) : null}



                {/* Nút nhận OTP */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.buttonWrapper}
                    // disabled={!filled}
                    onPress={onResetPasswordPress}
                >
                    <LinearGradient
                        colors={filled ? ["#ffbdb0ff", "#eca190ff"] : ["#F3D8D1", "#ffcec3ff"]}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Đổi Mật Khẩu</Text>
                    </LinearGradient>
                </TouchableOpacity>
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
        marginTop: hpA(24),
        // marginBottom: hpA(24),
    },
    imgOtp: {
        width: wpA(200),
        height: hpA(200),
        marginTop: hpA(36),
        marginBottom: hpA(16),
    },
    desc: {
        ...theme.typography.body2,
        color: theme.colors.textSecondary,
        marginBottom: hpA(26),
        paddingHorizontal: wpA(30),
        // alignSelf: "left",
    },
    label: {
        ...theme.typography.headline1,
        color: theme.colors.textPrimary,
        marginTop: hpA(-18),
        alignSelf: "left",
        paddingHorizontal: wpA(30),
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

    // emailField: {
    //     marginTop: hpA(4),
    //     marginHorizontal: wpA(12),
    //     alignSelf: "center",

    // },
    passwordField: {
        marginTop: hpA(4),
        // flexDirection: "row",

        marginHorizontal: wpA(12),
        alignSelf: "center",

    },
    confirmPasswordField: {
        marginTop: hpA(16),
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
        marginTop: hpA(4),
      
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    eyeInside: {
        position: "absolute",
        right: wpA(14),
        padding: 4,
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

    errorBox: {
        padding: 12,
        // top: hpA(50),
        // left: wpA(20),

        marginTop: hpA(12),
        // marginBottom: 16
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    errorText: {
        color: "#a30303ff",
        marginLeft: 8,
        flex: 1,
        fontSize: 14,
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
