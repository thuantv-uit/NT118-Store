// search.jsx (cập nhật)
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

import {
  QUICK_FILTERS,
  RECENT_SEARCHES,
  TOP_KEYWORDS,
} from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

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
        {RECENT_SEARCHES.map((text, index) => (
          <View key={index} style={styles.recentRow}>
            <Ionicons name="time-outline" size={hp("2%")} color="#9F1239" />
            <Text style={styles.recentText}>{text}</Text>
          </View>
        ))}
      </LinearGradient>
    </SellerScreenLayout>
  );
}