// components/icons/CategoryIcon.jsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Svg, Path, Rect } from "react-native-svg";
import { colors } from "../../theme/colors";

export default function CategoryIcon({ state = "default", size = 64 }) {
  const isPressed = state === "pressed";

  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: isPressed ? colors.hmee02 : colors.white,
          borderColor: isPressed ? colors.hmee04 : colors.hmee01,
          width: size,
          height: size,
        },
      ]}
    >
      <Svg
        width="50%"
        height="50%"
        viewBox="0 0 24 24"
        stroke={isPressed ? colors.white : colors.hmee04}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M4 4h16v16H4z" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 2,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
