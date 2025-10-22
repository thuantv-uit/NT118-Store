import { wpA, hpA, topA, leftA, rightA, bottomA } from "../../utils/scale";
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { typography } from "../../theme/typography";
import { COLORS } from "../../constants/colors";
import Logo from "../../assets/images/welcome/Logo_welcome.svg" //dung anh svg
import { colors } from "../../theme/colors";

export default function TestScale() {
    return (
        <LinearGradient
            colors={["#fdefef", "#FFC1C1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fill}
        >
            {/* Lớp phủ trong suốt để làm nhạt nền */}
            <View style={styles.overlay} />
            <SafeAreaView style={styles.fill}>
                <View style={styles.content}>
                    {/* Text */}
                    <Text style={[typography.welcome_font, styles.title]}>
                        Welcome to Siny!
                    </Text>
                    {/* Logo */}
                    <Image source={require("../../assets/images/welcome/Logo1.png")} style={styles.logo} />
                    {/* <Logo width={wp("50%")} height={hp("25%")} /> // Cách dùng component SVG trực tiếp */}
                    {/* <Logo style={styles.logo} /> */}




                </View>

                {/* Decorative Plus (tùy chọn, có thể xoá nếu không cần) */}


            </SafeAreaView>
            <Image
                source={require("../../assets/images/decor/decor1.png")}
                style={styles.decor1}
            />

            <Image
                source={require("../../assets/images/decor/decor2.png")}
                style={styles.decor2}
            />

            <Image
                source={require("../../assets/images/decor/decor3.png")}
                style={styles.decor3}
            />

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fill: {
        flex: 1,
        justifyContent: "space-between",
        opacity: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // phủ toàn màn hình
        backgroundColor: "rgba(255, 255, 255, 0.3)", // màu trắng trong suốt 30%
        zIndex: 1, // nằm trên gradient
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 8,          // chống notch/đục lỗ đè nhẹ
        paddingHorizontal: 1,
        zIndex: 2, // nằm trên lớp phủ
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    logo: {
        position: "absolute",
        right: rightA(-11, 411),
        bottom: bottomA(174, 411),
        width: wpA(411),
        height: hpA(411),
        resizeMode: "contain",
        marginTop: -hp("8%"),       // TẠO KHOẢNG CÁCH logo → text
    },

    // text dưới logo, căn giữa
    title: {
        textAlign: "center",
        // Nếu cần hạ thấp thêm:
    },

    // icon trang trí góc phải dưới
    decor1: {
   position: "absolute",
        right: rightA(344, 57),
        bottom: bottomA(500, 52),
        width: wpA(57),
        height: hpA(52),
        resizeMode: "contain",
        overflow: "visible", 
        transform: [{scale: 2}  ]  ,
        Zindex: 3, // tránh cắt mép
    },
    decor2: {
        position: "absolute",
        right: rightA(276, 96),
        bottom: bottomA(750, 92),
        width: wpA(96),
        height: hpA(92),
        resizeMode: "contain",
        overflow: "visible", 
        transform: [{scale: 2}  ]  ,
        Zindex: 3, // tránh cắt mép



    },
    decor3: {
        position: "absolute",
        left: leftA(14, 61),
        bottom: bottomA(628, 34),
        width: wpA(61),
        height: hpA(34),
        resizeMode: "contain",
        overflow: "visible",
        transform: [{scale: 1}  ] ,
        Zindex:    3,  // tránh cắt mép
    },

});
