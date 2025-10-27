import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Link,useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import FaceB from '../../assets/icons/ui/fb.svg';
import Googl from '../../assets/icons/ui/gg.svg';
import { wpA, hpA, topA, leftA, rightA, bottomA } from "../../utils/scale";
import { Icon } from "../../components/ui/icon";
import React from "react";


import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Decor from "../../components/decor/Decor";
import { theme } from "../../theme/index";
import { Dimensions } from "react-native";
import { typography } from "../../theme/typography";
import { colors } from "@/theme/colors";
const { width: screenWidth } = Dimensions.get("window");

export default function SignIn() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
    const [error, setError] = useState("");

    // Handle submission of sign-up form
    const onSignInPress = async () => {
        if (!isLoaded) return;
        try {
            // Thực hiện đăng nhập
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.replace("/(tabs)/home");
            } else {
                console.log(JSON.stringify(result, null, 2));
            }
        } catch (err) {
            console.error("Sign in error:", err);
            setError("Sai thông tin đăng nhập. Vui lòng thử lại.");
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid
            enableAutomaticScroll
        >
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


                    <Text style={styles.title}>Đăng nhập</Text>


                    <View style={styles.box}>


                        <View style={styles.userField}>
                            <Text style={styles.labelUser}>Username/Email</Text>
                            <TextInput
                                style={[styles.inputUser, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={emailAddress}
                                placeholderTextColor="#DCBEB6"
                                placeholder="exxample@example.com"
                                onChangeText={setEmailAddress}
                            />
                        </View>

                        <View style={styles.passwordField}>
                            <Text style={styles.labelPass}>Mật khẩu</Text>
                            <TextInput
                                style={[styles.inputPass, error && styles.errorInput]}
                                autoCapitalize="none"
                                value={password}
                                placeholderTextColor="#DCBEB6"
                                placeholder="● ● ● ● ● ● ● ●"

                                onChangeText={setPassword}
                            />
                        </View>
                        {error ? (
                            <View style={styles.errorBox}>
                                <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                                <Text style={styles.errorText}>{error}</Text>
                                <TouchableOpacity onPress={() => setError("")}>
                                    <Ionicons name="close" size={20} color="#b50000ff" />
                                </TouchableOpacity>
                            </View>
                        ) : null}


                        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/(auth)/sign_up_test")}>
                            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>

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
                            <TouchableOpacity onPress={() => router.push("/(auth)/sign_up_test")}>
                                <Text style={styles.linkText}>Đăng ký</Text>
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

                <Decor type="cone2" style={styles.decor2} />
                <Decor type="cone3" style={styles.decor3} />
                <Decor type="cone4" style={styles.decor4} />
            </LinearGradient>
        </KeyboardAwareScrollView >
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
    errorBox: {
        // backgroundColor: "#FFE5E5",
        padding: 12,
        borderRadius: 8,
        // borderLeftWidth: 4,
        borderLeftColor: COLORS.expense,
        // marginBottom: 16,
        marginTop: hpA(16),
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    errorText: {
        color: '#b50000ff',
        marginLeft: 8,
        flex: 1,
        fontSize: 14,
    },
    title: {
        // fontSize: 28,
        // ...theme.typography.title1,
        ...theme.typography.title1,

        color: theme.colors.inside_color_icon_on,
        marginBottom: 24,
        alignSelf: "center",
        // left: leftA(169),
        // top: topA(79),
        marginTop: hpA(40),
        zIndex: 2,
    },
    box: {
        marginTop: hpA(60),
        width: wpA(399),
        position: "relative",
        height: hpA(570),
        backgroundColor: "rgba(255,255,255)",
        borderRadius: 41, // góc bo lớn
        alignSelf: "center",
        elevation: 12, // cho Android
        flexDirection: "column",
        zIndex: 2,
        opacity: 0.67,

    },
    inputContainer: {
        borderRadius: 17,
        alignSelf: 'stretch',
        flexDirection: 'column',
        fontFamily: 'Bellota',
        letterSpacing: 0.75,
        justifyContent: 'center',
        paddingVertical: 13,
        paddingHorizontal: 17,
    },
    labelUser: {
        // fontWeight: '500',
        zIndex: 10,
        marginLeft: 15,
        color: '#000',
        // fontSize: 15,
        ...theme.typography.headline3,
        ...theme.colors.dark_mode_icon_square,
        flexShrink: 0,
    },
    labelPass: {
        zIndex: 10,
        marginLeft: 15,
        ...theme.typography.headline3,
        ...theme.colors.dark_mode_icon_square
    },

    value: {
        color: '#000',
        fontSize: 15,
        fontFamily: 'Athiti',
    },
    userField: {

        marginTop: hpA(40),
        // bottom: bottomA(237,45),
        alignSelf: "center",
    },
    passwordField: {

        marginTop: hpA(24),
        alignSelf: "center",
    },
    inputPass: {
        // position: "absolute",

        backgroundColor: colors.white,
        borderRadius: 17,
        ...theme.shadows.drop,
        // overflow: "hidden",
        opacity: 0.99,    // cắt phần thừa
        paddingStart: 24, // cắt phần thừa
        fontSize: 16,
        width: wpA(344),
        height: hpA(45),
        // top: topA(255),
        // left: leftA(34),

    },
    inputUser: {
        backgroundColor: colors.white,
        borderRadius: 17,
        alignSelf: "center",
        ...theme.shadows.drop,
        // overflow: "hidden",
        opacity: 0.99,
        paddingStart: 24, // cắt phần thừa
        ...theme.typography.body2,
        width: wpA(344),
        height: hpA(45),

    },
    button: {
        backgroundColor: "#f6a189ff",
        borderRadius: 17,
        width: wpA(198),
        height: hpA(50),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hpA(40),
        alignSelf: "center",
        zIndex: 1,
        ...theme.shadows.drop,
        opacity: 0.99,
    },
    buttonText: {
        color: theme.colors.inside_color_icon_on,
        ...theme.typography.label1,
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
    },

    forgotText: {
        position: "fixed",
        fontFamily: 'Athiti-Regular',
        fontSize: 16,
        color: '#4194f3',
        fontWeight: '600',
        lineHeight: Math.round(16 * 1.4),
        textAlign: 'center',
        alignContent: "center",
        marginTop: hpA(12),
        alignSelf: "center",
        textDecorationLine: 'underline',



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
    errorInput: {
        borderColor: COLORS.expense,
        borderWidth: 1,
    },

    decor1: {
        position: "absolute",
        height: hpA(59),
        width: wpA(48),
        objectFit: 'cover',
        ...theme.shadows.drop,
        top: topA(60),
        left: leftA(40),
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
        top: topA(760),
        left: leftA(40),
        zIndex: 5,

    },
    decor4: {
        position: "absolute",
        height: hpA(59),
        width: wpA(48),
        objectFit: 'cover',
        ...theme.shadows.drop,
        top: topA(700),
        left: leftA(340),
        zIndex: 5,
    },




});