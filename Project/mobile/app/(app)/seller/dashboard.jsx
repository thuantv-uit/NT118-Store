import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./components/SellerScreenLayout";
import { useRouter } from "expo-router";

const STAT_CARDS = [
  { id: "revenue", iconType: MaterialCommunityIcons, icon: "cash-multiple", label: "Doanh thu tháng", value: "124.500.000 đ" },
  { id: "orders", iconType: Ionicons, icon: "cart-outline", label: "Đơn hàng mới", value: "320" },
  { id: "conversion", iconType: MaterialCommunityIcons, icon: "chart-line-stacked", label: "Tỉ lệ chuyển đổi", value: "4,2%" },
  { id: "visits", iconType: Ionicons, icon: "people-outline", label: "Lượt truy cập", value: "12.540" },
];

const HIGHLIGHTS = [
  { id: "hot", title: "Sản phẩm bán chạy", description: "Ly gốm A08 tăng trưởng 34% so với tuần trước." },
  { id: "campaign", title: "Chiến dịch sắp diễn ra", description: "Flash sale cuối tuần giúp tăng tỷ lệ chuyển đổi." },
];

export default function SellerDashboard() {
  const router = useRouter();
  const navigateToOrders = () => router.push("/seller/orders");

  return (
    <SellerScreenLayout title="Bảng điều khiển" subtitle="Tổng quan hiệu suất">
      <View style={styles.statGrid}>
        {STAT_CARDS.map(({ id, iconType: Icon, icon, label, value }) => (
          <LinearGradient
            key={id}
            colors={["#FFE5EA", "#FAD4D6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCard}
          >
            <View style={styles.statIconWrap}>
              <Icon name={icon} size={hp("2.6%")} color="#BE123C" />
            </View>
            <Text style={styles.statLabel}>{label}</Text>
            <Text style={styles.statValue}>{value}</Text>
          </LinearGradient>
        ))}
      </View>

      <LinearGradient colors={["#FFE9EC", "#FFE2F2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Hiệu suất bán hàng</Text>
          <Text style={styles.chartPeriod}>7 ngày gần nhất</Text>
        </View>
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartBarLarge} />
          <View style={styles.chartBarSmall} />
          <View style={styles.chartBarMedium} />
          <View style={styles.chartBarLarge} />
          <View style={styles.chartBarSmall} />
          <View style={styles.chartBarMedium} />
          <View style={styles.chartBarLarge} />
        </View>
        <Text style={styles.chartHint}>Biểu đồ sẽ cập nhật dữ liệu bán hàng thực tế của bạn.</Text>
      </LinearGradient>

      <View style={styles.highlights}>
        {HIGHLIGHTS.map((item) => (
          <LinearGradient
            key={item.id}
            colors={["#FDE2E4", "#F8BBD0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.highlightCard}
          >
            <Text style={styles.highlightTitle}>{item.title}</Text>
            <Text style={styles.highlightDescription}>{item.description}</Text>
          </LinearGradient>
        ))}
      </View>

      <Pressable
        onPress={navigateToOrders}
        style={({ pressed }) => [styles.ordersButton, pressed && styles.ordersButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel="Đi đến quản lý đơn hàng"
      >
        <LinearGradient
          colors={["#FFE5EA", "#FAD4D6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ordersButtonInner}
        >
          <View style={styles.ordersButtonIcon}>
            <Ionicons name="receipt-outline" size={hp("2.6%")} color="#BE123C" />
          </View>
          <View style={styles.ordersButtonTextWrap}>
            <Text style={styles.ordersButtonTitle}>Quản lý tất cả đơn hàng</Text>
            <Text style={styles.ordersButtonSubtitle}>Theo dõi trạng thái và xử lý từng đơn nhanh chóng.</Text>
          </View>
          <Ionicons name="chevron-forward" size={hp("2.4%")} color="#BE123C" />
        </LinearGradient>
      </Pressable>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: hp("2.5%"),
  },
  statCard: {
    width: "48%",
    borderRadius: 18,
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("1.8%"),
  },
  statIconWrap: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  statLabel: { fontSize: hp("1.7%"), color: "#7F1D1D", fontWeight: "600" },
  statValue: { fontSize: hp("2.2%"), color: "#581C1C", fontWeight: "700", marginTop: hp("0.4%") },
  chartCard: {
    borderRadius: 20,
    paddingVertical: hp("2.4%"),
    paddingHorizontal: wp("5%"),
    marginBottom: hp("2.5%"),
  },
  chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chartTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C" },
  chartPeriod: { fontSize: hp("1.7%"), color: "#9F1239", fontWeight: "600" },
  chartPlaceholder: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: hp("16%"),
    marginTop: hp("2%"),
    marginBottom: hp("1.4%"),
  },
  chartBarLarge: { width: "12%", height: "100%", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.85)" },
  chartBarMedium: { width: "12%", height: "70%", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.7)" },
  chartBarSmall: { width: "12%", height: "45%", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.55)" },
  chartHint: { fontSize: hp("1.6%"), color: "#6B7280" },
  highlights: { marginBottom: hp("1%") },
  highlightCard: {
    borderRadius: 18,
    paddingVertical: hp("2.2%"),
    paddingHorizontal: wp("4.5%"),
    marginBottom: hp("1.6%"),
  },
  highlightTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("0.8%") },
  highlightDescription: { fontSize: hp("1.7%"), color: "#4B5563", lineHeight: hp("2.4%") },
  ordersButton: { borderRadius: 22, overflow: "hidden" },
  ordersButtonPressed: { opacity: 0.85 },
  ordersButtonInner: {
    borderRadius: 22,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
  },
  ordersButtonIcon: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("5.5%"),
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  ordersButtonTextWrap: { flex: 1 },
  ordersButtonTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  ordersButtonSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
});
