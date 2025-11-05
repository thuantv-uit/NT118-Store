import { wpA, hpA, topA, leftA, rightA, bottomA } from "../../utils/scale";
// import { Icon } from "../../components/ui/icon";

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";


import { LinearGradient } from "expo-linear-gradient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import { typography } from "../../theme/typography";
import { COLORS } from "../../constants/colors";
import Logo from "../../assets/images/welcome/Logo_welcome.svg" //dung anh svg
import { colors } from "../../theme/colors";
import { Dimensions } from "react-native";
const { width: screenWidth } = Dimensions.get("window");


export default function Welcome2() {
  return (
    <SafeAreaView style={{ flex: 1  }}>
      <LinearGradient
        style={styles.background}
        colors={["#fdefef", "#ffc1c1"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }} >

        <Text style={[styles.text_logo, typography.handwritten2]} > Welcome to Siny</Text>
        
        {/* dung anh svg */}
        <Logo style={styles.logo}/>

        <View style={styles.button}>

          <TouchableOpacity style={styles.login} >
            {/* <View style={styles.button1} /> */}
            <LinearGradient
              {...colors.hmee06}
              opacity={0.8}
              style={styles.button1}

            ></LinearGradient>

            <Text style={[styles.text_button1, typography.label1]}>Đăng Nhập</Text>

          </TouchableOpacity>


          <TouchableOpacity style={styles.register} >
            <LinearGradient
              colors={["#E97996", "#F4D7D2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.1 }}
              locations={[0, 0.89]}
              opacity={0.4}
              style={styles.button1}

            ></LinearGradient>
            <Text style={[styles.text_button2, typography.label1]}>Đăng Ký</Text>

          </TouchableOpacity>
        </View>

        <Image
          source={require("../../assets/images/decor/decor1.png")}
          style={styles.decor1}
          resizeMode="contain"
        />

        <Image
          source={require("../../assets/images/decor/decor2.png")}
          style={styles.decor2}
          resizeMode="contain"
        />

        <Image
          source={require("../../assets/images/decor/decor3.png")}
          style={styles.decor3}
          resizeMode="contain"
        />


      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  background: {
    position: "relative",
    marginHorizontal: "auto",
    marginVertical: 0,
    borderRadius: hpA(5),
    height: hpA(892),
    width: wpA(412),
    maxWidth: screenWidth,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },

  text_logo: {
    position: "absolute",
    flexDirection: "column",
    justifyContent: "center",
    height: hpA(41),
    left: leftA(106),
    top: topA(130),
    width: wpA(225),
    alignItems: "center",
    includeFontPadding: false,   // tránh bị cắt phần trên của font

  },

  logo: {
    position: "absolute",
    width: wpA(411),
    height: hpA(411),
    left: leftA(-11),
    // top: topA(124),
    bottom: bottomA(174, 411),
    aspectRatio: 1,
  },

  button: {
    position: "absolute",
    left: leftA(117),
    top: topA(600),
    gap: hpA(20),
  },

  login: {
    position: "relative",
    height: hpA(46),
    width: wpA(179),
    justifyContent: "center",
    alignItems: "center",
  },

  button1: {
    position: "absolute",
    top: topA(0),
    left: leftA(0),
    height: hpA(46),
    width: wpA(179),
    borderRadius: hpA(12),
    borderWidth: 1,
    // backgroundColor: colors.hmee06,
    borderColor: "#dc2626",
    borderStyle: "solid",
    shadowColor: "#FF384A",
    shadowOffset: {
      width: 0,
      height: hpA(4),
    },
    shadowOpacity: 0.25,
    shadowRadius: hpA(8),
    elevation: 10,
  },

  text_button1: {
    // fontSize: hpA(20),
    fontWeight: "bold",
    textAlign: "center",
    // color: "#A30301",
    color: "#ba5d55ff",
    textShadowColor: "#F0B1A5",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    // includeFontPadding: false, // fix Android cut text
    textAlignVertical: "center",
    zIndex: 1,
  },

  register: {
    position: "relative",
    height: hpA(46),
    width: wpA(179),
    marginTop: hpA(20),
    justifyContent: "center",
    alignItems: "center",
 

  },

  button2: {
    position: "absolute",
    top: topA(0),
    left: leftA(0),
    height: hpA(46),
    width: wpA(179),
    borderRadius: hpA(12),
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.5)",
    borderStyle: "solid",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: hpA(4),
    },
    shadowOpacity: 0.25,
    shadowRadius: hpA(8),
    opacity: 0.5,
    elevation: 8,
  },

  text_button2: {
    // fontSize: hpA(20),
    fontWeight: "bold",
    letterSpacing: wpA(-0.5),
    lineHeight: hpA(24),
    color: "#8c1412b1",
     textShadowColor: "#F0B1A5",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlignVertical: "center",
    zIndex: 1,
  },

  decor1: {
    position: "absolute",
    height: hpA(52),
    left: leftA(344),
    top: topA(500),
    width: wpA(57),
  },

  decor2: {
    position: "absolute",
    height: hpA(128),
    left: leftA(286),
    top: topA(710),
    width: wpA(133),
    // transform: [{ rotate: "43.796deg" }],
    rotate: "43.796deg",
  },

  decor3: {
    position: "absolute",
    height: hpA(34),
    left: leftA(15),
    top: topA(628),
    width: wpA(61),
    transform: [{ rotate: "-26.75deg" }],
  },
});
