import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

import { HEADER_GRADIENT } from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

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