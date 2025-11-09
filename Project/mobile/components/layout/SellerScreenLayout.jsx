import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { hpA, wpA } from "@/utils/scale";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function SellerScreenLayout({ title, subtitle, children }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[typography.title2, styles.title]}>{title}</Text>
      {subtitle && <Text style={[typography.body2, styles.subtitle]}>{subtitle}</Text>}
      <View style={{ marginTop: hpA(12) }}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wpA(24),
    paddingVertical: hpA(16),
    backgroundColor: colors.hmee01,
  },
  title: {
    color: colors.hmee05,
  },
  subtitle: {
    color: colors.hmee03,
    marginTop: hpA(4),
  },
});
