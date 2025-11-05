// import { styles } from "@/assets/styles/auth.styles.js";
import { useSignUp } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../../constants/colors";

//TRANG DANG KY
//Import by Hmee
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Decor from "../../components/decor/Decor";
import { theme } from "../../theme/index";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { wpA, hpA, topA, leftA, rightA, bottomA } from "../../utils/scale";
import { typography } from "../../theme/typography";
import { colors } from "@/theme/colors";
const { width: screenWidth } = Dimensions.get("window");

//import image
import FaceB from '../../assets/icons/ui/fb.svg';
import Googl from '../../assets/icons/ui/gg.svg';



export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    // Dang ky thong tin
    const [fullName, setFullName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Verification state
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    // === VALIDATION ===
    const validateFields = () => {
        const phoneRegex = /^(?:\+84|0)(\d{9})$/;
        const birthRegex = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[0-2])[/-]\d{4}$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|\\:;"'<>,.?/]).{8,}$/;

        if (!fullName.trim()) return "Vui lòng nhập họ tên.";
        if (!emailAddress.includes("@")) return "Email không hợp lệ.";
        if (!birthRegex.test(birthday)) return "Ngày sinh phải có định dạng dd/mm/yyyy.";
        if (!phoneRegex.test(phone)) return "Số điện thoại phải đủ 10 số.";
        if (!passwordRegex.test(password))
            return "Mật khẩu phải có ít nhất 8 ký tự gồm: chữ hoa, chữ thường, số và ký tự đặc biệt.";
        if (password !== confirmPassword) return "Xác nhận mật khẩu không trùng khớp.";
        return null;
    };

    // Hàm định dạng ngày sinh tự động
    const formatDateInput = (text) => {
        // Xóa ký tự không phải số
        let cleaned = text.replace(/\D/g, "");

        // Giới hạn tối đa 8 số
        if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

        // Thêm dấu '/' sau 2 và 4 ký tự
        if (cleaned.length >= 5) {
            cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
        } else if (cleaned.length >= 3) {
            cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        }

        return cleaned;
    };

    // Handle submission of sign-up form
    // const onSignUpPress = async () => {
    //     if (!isLoaded) return;

    //     // Start sign-up process using email and password provided
    //     try {
    //         await signUp.create({
    //             emailAddress,
    //             password,
    //         });

    //         // Send user an email with verification code
    //         await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

    //         // Set 'pendingVerification' to true to display second form
    //         // and capture OTP code
    //         setPendingVerification(true);
    //     } catch (err) {
    //         if (err.errors?.[0]?.code === "form_identifier_exists") {
    //             setError("That email address is already in use. Please try another.");
    //         } else {
    //             setError("An error occurred. Please try again.");
    //         }
    //         console.log(err);
    //     }
    // };

    const onSignUpPress = async () => {
        if (!isLoaded) return;

        // ✅ kiểm tra client-side trước khi gọi Clerk
        const validationError = validateFields();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await signUp.create({
                emailAddress,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setPendingVerification(true);
        } catch (err) {
            // 🔍 Clerk có thể trả về mảng lỗi
            if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
                setError(err.errors[0].message); // ví dụ: “Passwords must be 8 characters or more.”
            } else {
                setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
            console.log("SignUp Error:", JSON.stringify(err, null, 2));
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
            enableAutomaticScroll={true}>
            <LinearGradient
                style={styles.background}
                colors={[
                    '#f1b69499',
                    '#E7979699',
                ]}
                locations={[0, 0.96]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <View style={styles.container}>

                    <Text style={styles.title}>Tạo Tài Khoản</Text>

                    <View style={styles.box}>



                        <View style={styles.userField}>
                            <Text style={styles.labelUser}>Họ tên</Text>
                            <TextInput
                                style={[styles.input, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={fullName}
                                placeholderTextColor="#DCBEB6"
                                placeholder="Nhập họ tên"
                                onChangeText={(name) => setFullName(name)}
                            />
                        </View>

                        <View style={styles.emailField}>
                            <Text style={styles.labelUser}>Email</Text>
                            <TextInput
                                style={[styles.input, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={emailAddress}
                                placeholderTextColor="#DCBEB6"
                                placeholder="Nhập email"
                                onChangeText={(email) => setEmailAddress(email)}
                            />
                        </View>

                        <View style={styles.birthdayField}>
                            <Text style={styles.labelUser}>Ngày sinh</Text>
                            <TextInput
                                style={[styles.input, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={birthday}
                                placeholderTextColor="#DCBEB6"
                                placeholder="Nhập ngày sinh"
                                onChangeText={(dateOfBirth) => setBirthday(formatDateInput(dateOfBirth))}
                                keyboardType="number-pad"
                                maxLength={10}
                            />
                        </View>
                        <View style={styles.phoneField}>
                            <Text style={styles.labelUser}>Số điện thoại</Text>
                            <TextInput
                                style={[styles.input, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={phone}
                                placeholderTextColor="#DCBEB6"
                                placeholder="Nhập số điện thoại"
                                onChangeText={(phoneNumber) => setPhone(phoneNumber)}
                            />
                        </View>
                        <View style={styles.passwordField}>
                            <Text style={styles.labelUser}>Mật khẩu</Text>
                            <TextInput
                                style={[styles.input, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={password}
                                placeholderTextColor="#DCBEB6"
                                placeholder="Nhập mật khẩu"
                                onChangeText={(password) => setPassword(password)}
                            />
                        </View>

                        <View style={styles.confirmPasswordField}>
                            <Text style={styles.labelUser}>Xác nhận mật khẩu</Text>
                            <TextInput
                                style={[styles.input, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={confirmPassword}
                                placeholderTextColor="#DCBEB6"
                                placeholder="Nhập lại mật khẩu"
                                onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                            />
                        </View>

                        {error ? (
                            <View style={styles.errorBox}>
                                <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity onPress={() => setError("")}>
                                    <Ionicons name="close" size={20} color="#a30303ff" />
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        <View style={styles.boxText}>
                            <Text style={styles.text1}>Bằng việc đăng ký, bạn đã đồng ý với {"\n"}
                                <Text style={styles.text2}> Điều khoản sử dụng</Text> và
                                <Text style={styles.text2}> Chính sách quyền riêng tư.</Text>
                            </Text>
                        </View>


                        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                            <Text style={styles.buttonText}>Đăng ký</Text>
                        </TouchableOpacity>

                        <View style={styles.otherbox}>
                            <Text style={styles.otherText}>Đăng ký với</Text>
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
                            <Text style={styles.footerText}>Bạn đã có tài khoản?</Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/signIn")}>
                                <Text style={styles.linkText}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
                {/* Decor */}
                <Decor type="cone1" style={styles.decor1} />
                {/* <Image
                                    source={require("../../assets/images/decor/3.png")}
                                    style={styles.decor2}
                                    contentFit="cover"
                                /> */}
                <Decor type="cone2" size={60} style={{ ...styles.decor2 }} />
                {/* <Decor type="cone2" style={{ ...styles.decor2, size: 30 }} /> */}
                <Decor type="cone3" style={styles.decor3} />
                <Decor type="cone4" size={60} style={styles.decor4} />
            </LinearGradient>
        </KeyboardAwareScrollView>
    );
}


export const styles = StyleSheet.create({
    background: {
        flex: 1,
        // opacity: 0.6,
        position: "absolute",
        marginHorizontal: "auto",
        marginVertical: 0,
        borderRadius: hpA(5),
        height: hpA(892),
        width: wpA(412),
        maxWidth: screenWidth,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        zIndex: 0,
    },

    container: {
        flex: 1,
        zIndex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",

    },
    title: {
        fontSize: 32,
        // ...theme.typography.title1,
        ...theme.typography.title1,

        color: theme.colors.inside_color_icon_on,
        // marginBottom: 24,
        alignSelf: "center",
        // left: leftA(169),
        // top: topA(79),
        marginTop: hpA(8),
        zIndex: 2,
    },
    // box trang
    box: {
        marginTop: hpA(8),
        width: wpA(399),
        position: "relative",
        height: hpA(755),
        backgroundColor: "rgba(255,255,255)",
        borderRadius: 41, // góc bo lớn
        alignSelf: "center",
        elevation: 12, // cho Android
        flexDirection: "column",
        zIndex: 2,
        opacity: 0.67,

    },

    userField: {
        marginTop: hpA(24),
        marginHorizontal: wpA(12),
        alignSelf: "center",
    },
    emailField: {
        marginTop: hpA(4),
        marginHorizontal: wpA(12),
        alignSelf: "center",

    },
    birthdayField: {
        marginTop: hpA(4),
        marginHorizontal: wpA(12),
        alignSelf: "center",

    },
    phoneField: {
        marginTop: hpA(4),
        marginHorizontal: wpA(12),
        alignSelf: "center",

    },
    passwordField: {
        marginTop: hpA(4),
        marginHorizontal: wpA(12),
        alignSelf: "center",

    },
    confirmPasswordField: {
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
    },
    boxText: {
        marginHorizontal: wpA(24),
        marginTop: hpA(32),
        alignItems: "center",
        justifyContent: "center",
    },
    text1: {
        // fontSize: 12,
        ...typography.caption2,
        ...theme.colors.dark_mode_icon_square,
        textAlign: "center",
    },
    text2: {
        // fontSize: 12,
        ...typography.caption1,
        ...theme.colors.dark_mode_icon_square,
        fontWeight: "600",
    },
    errorBox: {
        padding: 12,

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
    button: {
        backgroundColor: "#f6a189ff",
        borderRadius: 17,
        width: wpA(198),
        height: hpA(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hpA(18),
        alignSelf: "center",
        zIndex: 1,
        ...theme.shadows.drop,
        opacity: 0.99,
    },
    buttonText: {
        color: theme.colors.inside_color_icon_on,
        ...theme.typography.label1,
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
    },
    icongg: {
        width: wpA(50),
        height: hpA(50),
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        marginTop: hpA(16),
    },
    footerText: {
        ...theme.typography.headline3,
        ...theme.colors.dark_mode_icon_square,
        marginRight: 8,
    },
    linkText: {
        marginLeft: hpA(-12),
        ...theme.typography.headline3,
        color: '#CC0000',
        fontWeight: '600',
    },

    decor1: {
        position: "absolute",
        height: hpA(59),
        width: wpA(48),
        objectFit: 'cover',
        ...theme.shadows.drop,
        top: topA(760),
        left: leftA(10),
        zIndex: 5,

    },
    decor2: {
        position: "absolute",
        height: hpA(84),
        width: wpA(74),
        objectFit: 'cover',
        ...theme.shadows.drop,
        top: topA(15),
        left: leftA(345),
        // right: rightA(20,74),
        zIndex: 5,

    },
    decor3: {
        position: "absolute",
        height: hpA(59),
        width: wpA(48),
        objectFit: 'cover',
        ...theme.shadows.drop,
        top: topA(770),
        left: leftA(350),
        zIndex: 5,

    },
    decor4: {
        position: "absolute",
        height: hpA(49),
        width: wpA(39),
        objectFit: 'cover',
        ...theme.shadows.drop,
        top: topA(20),
        left: leftA(34),
        transform: [{ rotate: '-6deg' }],
        zIndex: 5,
    },



    // illustration: {
    //     width: "100%",
    //     height: 310,
    //     resizeMode: "contain",
    // },
    // title: {
    //     fontSize: 32,
    //     fontWeight: "bold",
    //     color: COLORS.text,
    //     marginVertical: 15,
    //     textAlign: "center",
    // },
    // box: {
    //     marginBottom: 20,
    //     borderRadius: hpA(12),
    //     shadowRadius: hpA(10),
    //     right: rightA(7, 399),
    //     bottom: bottomA(177, 570),
    //     height: hpA(570),
    //     width: wpA(399),
    // },

    // input: {
    //     backgroundColor: COLORS.white,
    //     borderRadius: 12,
    //     padding: 15,
    //     marginBottom: 16,
    //     borderWidth: 1,
    //     borderColor: COLORS.border,
    //     fontSize: 16,
    //     color: COLORS.text,
    // },
    // errorInput: {
    //     borderColor: COLORS.expense,
    // },
    // button: {
    //     backgroundColor: COLORS.primary,
    //     borderRadius: 12,
    //     padding: 16,
    //     alignItems: "center",
    //     marginTop: 10,
    //     marginBottom: 20,
    // },
    // buttonText: {
    //     color: COLORS.white,
    //     fontSize: 18,
    //     fontWeight: "600",
    // },
    // footerContainer: {
    //     flexDirection: "row",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     gap: 8,
    // },
    // footerText: {
    //     color: COLORS.text,
    //     fontSize: 16,
    // },
    // linkText: {
    //     color: COLORS.primary,
    //     fontSize: 16,
    //     fontWeight: "600",
    // },
    // verificationContainer: {
    //     flex: 1,
    //     backgroundColor: COLORS.background,
    //     padding: 20,
    //     justifyContent: "center",
    //     alignItems: "center",
    // },
    // verificationTitle: {
    //     fontSize: 24,
    //     fontWeight: "bold",
    //     color: COLORS.text,
    //     marginBottom: 20,
    //     textAlign: "center",
    // },
    // verificationInput: {
    //     backgroundColor: COLORS.white,
    //     borderRadius: 12,
    //     padding: 15,
    //     marginBottom: 16,
    //     borderWidth: 1,
    //     borderColor: COLORS.border,
    //     fontSize: 16,
    //     color: COLORS.text,
    //     width: "100%",
    //     textAlign: "center",
    //     letterSpacing: 2,
    // },


    // 🔴 Error styles

});