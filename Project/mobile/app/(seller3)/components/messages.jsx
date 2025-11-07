// import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

const FILTERS = ["Tất cả", "Chưa đọc", "Đã xử lý", "Ưu tiên"];

const CONVERSATIONS = [
  {
    id: "c1",
    name: "Marvin McKinney",
    username: "@theresa",
    time: "5 phút trước",
    snippet: "Khách cần xác nhận lịch giao hàng cuối tuần.",
    unread: 2,
  },
  {
    id: "c2",
    name: "Courtney Henry",
    username: "@courtney",
    time: "12 phút trước",
    snippet: "Đơn hàng #SN-2301 đã được thanh toán thành công.",
    unread: 0,
  },
  {
    id: "c3",
    name: "Leslie Alexander",
    username: "@leslie",
    time: "Hôm qua",
    snippet: "Bạn có thể cập nhật thêm ảnh cho sản phẩm A08 không?",
    unread: 1,
  },
];

export default function SellerMessages() {
  return (
    <SellerScreenLayout title="Tin nhắn" subtitle="Quản lý hội thoại với khách hàng">
      <View style={styles.filterRow}>
        {FILTERS.map((item) => (
          <Pressable key={item} style={({ pressed }) => [styles.filterChip, pressed && styles.filterChipPressed]}>
            <Text style={styles.filterChipText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.highlightBanner}>
        <Ionicons name="chatbubbles-outline" size={hp("3%")} color="#BE123C" />
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerTitle}>Tin nhắn mới</Text>
          <Text style={styles.bannerSubtitle}>Luôn phản hồi nhanh để giữ chân khách hàng trung thành.</Text>
        </View>
      </LinearGradient>

      <View>
        {CONVERSATIONS.map((item) => (
          <LinearGradient
            key={item.id}
            colors={["#FFF1F3", "#FFE3E9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.conversationCard}
          >
            <View style={styles.avatar} />
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <View>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text style={styles.conversationUsername}>{item.username}</Text>
                </View>
                <Text style={styles.conversationTime}>{item.time}</Text>
              </View>
              <Text style={styles.conversationSnippet}>{item.snippet}</Text>
            </View>
            {item.unread > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            ) : null}
          </LinearGradient>
        ))}
      </View>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  filterRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: hp("2%") },
  filterChip: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 999,
    backgroundColor: "rgba(204,120,97,0.1)",
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  filterChipPressed: { backgroundColor: "rgba(204,120,97,0.2)" },
  filterChipText: { fontSize: hp("1.7%"), color: "#7F1D1D", fontWeight: "600" },
  highlightBanner: {
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.4%"),
  },
  bannerTextWrap: { marginLeft: wp("3%"), flex: 1 },
  bannerTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("0.4%") },
  bannerSubtitle: { fontSize: hp("1.7%"), color: "#4B5563" },
  conversationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 18,
    paddingVertical: hp("1.6%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("1.6%"),
  },
  avatar: { width: wp("12%"), height: wp("12%"), borderRadius: wp("6%"), backgroundColor: "#FFF", marginRight: wp("3%") },
  conversationContent: { flex: 1 },
  conversationHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: hp("0.6%") },
  conversationName: { fontSize: hp("2%"), fontWeight: "700", color: "#1F2937" },
  conversationUsername: { fontSize: hp("1.6%"), color: "#6B7280", marginTop: hp("0.2%") },
  conversationTime: { fontSize: hp("1.6%"), color: "#9CA3AF" },
  conversationSnippet: { fontSize: hp("1.8%"), color: "#374151", marginTop: hp("0.4%") },
  unreadBadge: {
    minWidth: wp("6%"),
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.4%"),
    borderRadius: 999,
    backgroundColor: "#CC7861",
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: { color: "#FFF", fontSize: hp("1.6%"), fontWeight: "700" },
});
