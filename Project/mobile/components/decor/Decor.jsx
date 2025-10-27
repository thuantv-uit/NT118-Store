import React from "react";
import { View, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { decorMap } from "./decorMap";
import { theme } from "@/theme";

export default function Decor({ type = "cone1", size,style }) {
  const decor = decorMap[type];
  if (!decor) return null;
  // 👇 Nếu không truyền size, dùng default trong decorMap
  const finalSize = size || decor.size || 100;

  return (
    <View style={[styles.wrapper, { width: finalSize, height: finalSize }, style]}>
      {/* Base khối 3D */}
      <Image
        source={decor.base}
        style={[styles.base, { width: finalSize, height: finalSize }]}
        contentFit="cover"
      />

      {/* Mask ánh sáng */}
      <MaskedView
        style={[styles.maskGroup, { width: finalSize, height: finalSize }]}
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
