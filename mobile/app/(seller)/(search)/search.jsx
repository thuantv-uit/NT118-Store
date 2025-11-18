import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "../../../theme/colors";
import SellerScreenLayout from "../components/SellerScreenLayout";

const QUICK_FILTERS = ["Tất cả sản phẩm", "Còn hàng", "Sắp hết", "Đã ẩn"];

const TOP_KEYWORDS = ["ly gốm a08", "combo quà tết", "lọ hoa artisan", "gốm thủ công"];

export default function SellerSearch() {
  return (
    <SellerScreenLayout title="Tìm kiếm" subtitle="Quản lý sản phẩm và đơn nhanh chóng">
      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.searchBar}>
        <Ionicons name="search" size={hp("2.4%")} color={colors.accent.red} />
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
          <Ionicons name="time-outline" size={hp("2%")} color={colors.accent.redDark} />
          <Text style={styles.recentText}>Đơn hàng #SN-2301</Text>
        </View>
        <View style={styles.recentRow}>
          <Ionicons name="time-outline" size={hp("2%")} color={colors.accent.redDark} />
          <Text style={styles.recentText}>Sản phẩm: Bình gốm đen tuyền</Text>
        </View>
        <View style={styles.recentRow}>
          <Ionicons name="time-outline" size={hp("2%")} color={colors.accent.redDark} />
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
  searchPlaceholder: { fontSize: hp("1.9%"), color: colors.accent.redDarker, fontWeight: "700", marginBottom: hp("0.2%") },
  searchHint: { fontSize: hp("1.6%"), color: colors.text.light },
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: hp("2.2%") },
  filterChip: {
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 999,
    backgroundColor: colors.overlay.primary12,
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  filterChipPressed: { backgroundColor: colors.overlay.primary22 },
  filterChipText: { fontSize: hp("1.7%"), color: colors.accent.redDarker, fontWeight: "600" },
  sectionCard: {
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2.4%"),
  },
  sectionTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: colors.accent.red, marginBottom: hp("1%") },
  keywordWrap: { flexDirection: "row", flexWrap: "wrap", marginTop: hp("0.6%") },
  keywordChip: {
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 999,
    backgroundColor: colors.background.primary,
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  keywordChipPressed: { backgroundColor: colors.overlay.white70 },
  keywordText: { fontSize: hp("1.7%"), color: colors.primary.main, fontWeight: "600" },
  recentRow: { flexDirection: "row", alignItems: "center", marginBottom: hp("0.8%") },
  recentText: { fontSize: hp("1.8%"), color: colors.text.secondary, marginLeft: wp("2.4%") },
});
