import React, { useEffect, useRef } from "react";
import { View, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function LoadingIcon({ status = "loading", size = 48 }) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status === "loading") {
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [status]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (status === "check")
    return <Ionicons name="checkmark-circle" size={size} color={colors.hmee04} />;
  if (status === "error")
    return <Ionicons name="close-circle" size={size} color={colors.hmee04} />;

  return (
    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
      <Ionicons name="ellipse-outline" size={size} color={colors.hmee04} />
    </Animated.View>
  );
}
