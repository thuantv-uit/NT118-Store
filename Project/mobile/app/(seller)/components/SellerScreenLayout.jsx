import React from "react";
import { SafeAreaView, View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const HEADER_GRADIENT = ["#CC7861", "#E3ABA1"];

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
          <Ionicons name="chevron-back" size={hp("2.6%")} color="#FFF5F2" />
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
  safe: { flex: 1, backgroundColor: "#FFF8F6", height: wp("10%"), marginTop: hp("2%") },
  scroll: { flex: 1 },
  headerGradient: {
    height: hp("10%"),
    marginTop: hp("20%"),
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
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  backButtonPressed: { backgroundColor: "rgba(255,255,255,0.36)" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" , marginTop: 50},
  headerTitle: { fontSize: hp("2.6%"), fontWeight: "700", color: "#FFF5F2", marginTop: 50 },
  headerSubtitle: { fontSize: hp("1.7%"), color: "#FFE4E1", marginTop: hp("0.4%") },
  rightPlaceholder: { width: wp("10%") },
  content: {
    paddingHorizontal: wp("4.5%"),
    paddingTop: hp("2.5%"),
    paddingBottom: hp("5%"),
  },
});
