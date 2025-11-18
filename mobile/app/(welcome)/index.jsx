import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { typography } from "../../theme/typography";
import { colors } from "../../theme/colors";

export default function Welcome1() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={colors.gradient.welcome}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fill}
        >
            <SafeAreaView style={styles.fill}>
                <View style={styles.content}>
                    {/* Logo */}
                    <Image source={require("../../assets/images/welcome/Logo1.png")} style={styles.logo} />
                     {/* <Logo width={wp("50%")} height={hp("25%")} /> // Cách dùng component SVG trực tiếp */}
                    {/* <Logo style={styles.logo} /> */}

                    {/* Text */}
                    <Text style={[typography.welcome_font, styles.title]}>
                        Welcome to Siny!
                    </Text>

                    {/* Get Started Button */}
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push('/(auth)/sign-in')}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>

                {/* Decorative Plus (tùy chọn, có thể xoá nếu không cần) */}
                <Image
                    source={require("../../assets/images/decor/Plus.png")}
                    style={styles.plus}
                />
               
            </SafeAreaView>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 8,          // chống notch/đục lỗ đè nhẹ
        paddingHorizontal: 1,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        width: wp("100%"),       // 75% chiều ngang màn hình
        height: hp("50%"),              // responsive theo chiều ngang
        aspectRatio: 1.15,      // giữ tỉ lệ logo (tùy ảnh của bạn, chỉnh 1.0–1.3)
        resizeMode: "contain",
        marginBottom: hp(0),       // TẠO KHOẢNG CÁCH logo → text
    },

    // text dưới logo, căn giữa
    title: {
        textAlign: "center",
        // Nếu cần hạ thấp thêm:
        marginTop: hp(8),
        marginBottom: hp(4),
    },

    // Get Started Button
    button: {
        backgroundColor: colors.background.primary,
        paddingHorizontal: wp('15%'),
        paddingVertical: hp('2%'),
        borderRadius: 30,
        marginTop: hp(2),
        shadowColor: colors.shadow.default,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },

    buttonText: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        color: colors.secondary.coral,
        textAlign: 'center',
    },

    // icon trang trí góc phải dưới
    decor: {
        position: "absolute",
        left: wp("5%"),
        bottom: hp("5%"),
       
        width: wp("25%"),
        height: wp("25%"),
        resizeMode: "contain",
        opacity: 0.28,
    },
});
