import React from "react";
import { View, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { decorMap } from "./decorMap";
import { theme } from "@/theme";

export default function Decor({ type = "cone1", style }) {
  const decor = decorMap[type];
  if (!decor) return null;

  return (
    <View style={[styles.wrapper, { width: decor.size, height: decor.size }, style]}>
      {/* Base khối 3D */}
      <Image
        source={decor.base}
        style={[styles.base, { width: decor.size, height: decor.size }]}
        contentFit="cover"
      />

      {/* Mask ánh sáng */}
      <MaskedView
        style={[styles.maskGroup, { width: decor.size, height: decor.size }]}
        maskElement={
          <Image
            source={decor.mask}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        }
      >
        {decor.gradientColors ? (
          <LinearGradient
            colors={decor.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.fill, { opacity: decor.opacity }]}
          />
        ) : (
          <Image
            source={decor.light}
            style={[styles.fill, { opacity: decor.opacity }]}
            contentFit="cover"
          />
        )}
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.drop,
  },
  base: {
    position: "absolute"
  },
  maskGroup: {
    position: "absolute"
  },
  fill: {
    width: "100%",
    height: "100%",
    // opacity: 0.7
  }
});
