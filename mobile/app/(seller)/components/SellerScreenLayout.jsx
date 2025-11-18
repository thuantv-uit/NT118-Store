// import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "../../../theme/colors";

const HEADER_GRADIENT = [colors.primary.main, colors.primary.light];

export default function SellerScreenLayout({
  title,
  subtitle,
  children,
  rightSlot = null,
  contentStyle,
}) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={HEADER_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <Ionicons name="chevron-back" size={hp("2.6%")} color={colors.text.offWhite} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
        {rightSlot ? rightSlot : <View style={styles.rightPlaceholder} />}
      </LinearGradient>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.secondary },
  scroll: { flex: 1 },
  headerGradient: {
    paddingTop: hp("1.8%"),
    paddingBottom: hp("2.2%"),
    paddingHorizontal: wp("4.5%"),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay.white22,
  },
  backButtonPressed: { backgroundColor: colors.overlay.white36 },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: hp("2.6%"), fontWeight: "700", color: colors.text.offWhite },
  headerSubtitle: { fontSize: hp("1.7%"), color: colors.text.cream, marginTop: hp("0.4%") },
  rightPlaceholder: { width: wp("10%") },
  content: {
    paddingHorizontal: wp("4.5%"),
    paddingTop: hp("2.5%"),
    paddingBottom: hp("5%"),
  },
});
