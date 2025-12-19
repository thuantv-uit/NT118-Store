import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

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
      <LinearGradient
        colors={["#f21e64ff", "#FF8FB2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerContainer}
      >
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <Ionicons name="chevron-back" size={hp("2.4%")} color="#fff" />
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
  safe: { flex: 1, backgroundColor: "#FFF5F9" },
  scroll: { flex: 1 },
  headerContainer: {
    paddingTop: hp("1%"),
    paddingBottom: hp("1%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: wp("9%"),
    height: wp("9%"),
    borderRadius: wp("4.5%"),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  backButtonPressed: { backgroundColor: "rgba(255,255,255,0.2)" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: hp("2.2%"), fontWeight: "800", color: "#fff" },
  headerSubtitle: { fontSize: hp("1.5%"), color: "rgba(255,255,255,0.9)", marginTop: hp("0.2%"), fontWeight: "600" },
  rightPlaceholder: { width: wp("9%") },
  content: {
    paddingHorizontal: wp("4.5%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("5%"),
  },
});
