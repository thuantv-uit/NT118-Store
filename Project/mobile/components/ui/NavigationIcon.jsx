import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function NavigationIcon({
  icon = "home-outline",
  variant = "off", // "on" | "off"
  onPress,
}) {
  const isActive = variant === "on";
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons
        name={icon}
        size={28}
        color={isActive ? colors.hmee04 : colors.hmee01}
      />
      {isActive && <View style={styles.activeLine} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  activeLine: {
    marginTop: 4,
    width: 30,
    height: 3,
    backgroundColor: colors.hmee04,
    borderRadius: 10,
  },
});
