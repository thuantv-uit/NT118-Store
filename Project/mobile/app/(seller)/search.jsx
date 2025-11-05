import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./components/SellerScreenLayout";

const QUICK_FILTERS = ["Tất cả sản phẩm", "Còn hàng", "Sắp hết", "Đã ẩn"];

const TOP_KEYWORDS = ["ly gốm a08", "combo quà tết", "lọ hoa artisan", "gốm thủ công"];

export default function SellerSearch() {
  return (
    <SellerScreenLayout title="Tìm kiếm" subtitle="Quản lý sản phẩm và đơn nhanh chóng">
      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.searchBar}>
        <Ionicons name="search" size={hp("2.4%")} color="#BE123C" />
        <View style={styles.searchTexts}>
          <Text style={styles.searchPlaceholder}>Tìm sản phẩm, đơn hàng hoặc khách hàng</Text>
          <Text style={styles.searchHint}>Gợi ý: nhập ký tự để xem gợi ý tức thì</Text>
        </View>
      </LinearGradient>

      <View style={styles.filterRow}>
        {QUICK_FILTERS.map((item) => (
          <Pressable key={item} style={({ pressed }) => [styles.filterChip, pressed && styles.filterChipPressed]}>
            <Text style={styles.filterChipText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Từ khoá nổi bật</Text>
        <View style={styles.keywordWrap}>
          {TOP_KEYWORDS.map((keyword) => (
            <Pressable key={keyword} style={({ pressed }) => [styles.keywordChip, pressed && styles.keywordChipPressed]}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      <LinearGradient colors={["#FFF1F3", "#FFE3E9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
        <View style={styles.recentRow}>
          <Ionicons name="time-outline" size={hp("2%")} color="#9F1239" />
          <Text style={styles.recentText}>Đơn hàng #SN-2301</Text>
        </View>
        <View style={styles.recentRow}>
          <Ionicons name="time-outline" size={hp("2%")} color="#9F1239" />
          <Text style={styles.recentText}>Sản phẩm: Bình gốm đen tuyền</Text>
        </View>
        <View style={styles.recentRow}>
          <Ionicons name="time-outline" size={hp("2%")} color="#9F1239" />
          <Text style={styles.recentText}>Khách hàng: @leslie</Text>
        </View>
      </LinearGradient>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 18,
    paddingVertical: hp("1.4%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.2%"),
  },
  searchTexts: { marginLeft: wp("3%") },
  searchPlaceholder: { fontSize: hp("1.9%"), color: "#7F1D1D", fontWeight: "700", marginBottom: hp("0.2%") },
  searchHint: { fontSize: hp("1.6%"), color: "#6B7280" },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: hp("2.2%") },
  filterChip: {
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 999,
    backgroundColor: "rgba(204,120,97,0.12)",
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  filterChipPressed: { backgroundColor: "rgba(204,120,97,0.22)" },
  filterChipText: { fontSize: hp("1.7%"), color: "#7F1D1D", fontWeight: "600" },
  sectionCard: {
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2.4%"),
  },
  sectionTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("1%") },
  keywordWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: hp("0.6%") },
  keywordChip: {
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 999,
    backgroundColor: "#FFF",
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  keywordChipPressed: { backgroundColor: "rgba(255,255,255,0.7)" },
  keywordText: { fontSize: hp("1.7%"), color: "#CC7861", fontWeight: "600" },
  recentRow: { flexDirection: "row", alignItems: "center", marginBottom: hp("0.8%") },
  recentText: { fontSize: hp("1.8%"), color: "#374151", marginLeft: wp("2.4%") },
});
