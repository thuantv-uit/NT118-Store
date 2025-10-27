// components/icons/HomeIcon.jsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";
import { colors } from "../../theme/colors";

export default function HomeIcon({ variant = "off", size = 32 }) {
  const isOn = variant === "on";

  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isOn ? colors.hmee04 : colors.hmee01}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M3 12L12 3l9 9" />
        <Path d="M9 21V9h6v12" />
      </Svg>
      {isOn && <View style={styles.underline} />}
    </View>
  );
}

const styles = StyleSheet.create({
  underline: {
    position: "absolute",
    bottom: -4,
    width: "100%",
    height: 2,
    backgroundColor: colors.hmee04,
    borderRadius: 2,
  },
});
