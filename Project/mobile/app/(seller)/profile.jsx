import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./components/SellerScreenLayout";

const INFO_FIELDS = [
  { id: "name", label: "Tên cửa hàng", placeholder: "Siny Shop" },
  { id: "owner", label: "Chủ sở hữu", placeholder: "Theresa Webb" },
  { id: "phone", label: "Số điện thoại", placeholder: "0123 456 789" },
  { id: "email", label: "Email", placeholder: "sinyshop@example.com" },
];

const ADDRESS_FIELDS = [
  { id: "address", label: "Địa chỉ", placeholder: "123 Nguyễn Trãi, Q.1, TP.HCM" },
  { id: "warehouse", label: "Kho hàng", placeholder: "Kho 1 - Bình Thạnh" },
];

export default function SellerProfile() {
  return (
    <SellerScreenLayout title="Hồ sơ cửa hàng" subtitle="Tuỳ chỉnh thông tin hiển thị với khách">
      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerCard}>
        <View style={styles.avatarLarge}>
          <Ionicons name="storefront-outline" size={hp("4%")} color="#BE123C" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.shopName}>Siny Shop</Text>
          <Text style={styles.shopSubtitle}>Chia sẻ câu chuyện thương hiệu của bạn với khách hàng.</Text>
          <Pressable style={({ pressed }) => [styles.updateBadge, pressed && styles.updateBadgePressed]}>
            <Ionicons name="pencil" size={hp("1.8%")} color="#BE123C" />
            <Text style={styles.updateBadgeText}>Đổi ảnh đại diện</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        {INFO_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputValue}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ & kho hàng</Text>
        {ADDRESS_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputValue}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.noteCard}>
        <Ionicons name="information-circle-outline" size={hp("2.4%")} color="#BE123C" />
        <Text style={styles.noteText}>
          Thông tin ở đây sẽ được hiển thị công khai trên trang cửa hàng. Đảm bảo dữ liệu luôn chính xác và cập nhật.
        </Text>
      </LinearGradient>

      <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
      </Pressable>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 22,
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.4%"),
  },
  avatarLarge: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: wp("9%"),
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("4%"),
  },
  headerText: { flex: 1 },
  shopName: { fontSize: hp("2.4%"), fontWeight: "700", color: "#7F1D1D", marginBottom: hp("0.6%") },
  shopSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginBottom: hp("1.2%") },
  updateBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
  },
  updateBadgePressed: { backgroundColor: "rgba(255,255,255,0.9)" },
  updateBadgeText: { fontSize: hp("1.6%"), color: "#BE123C", fontWeight: "600", marginLeft: wp("1.5%") },
  section: { marginBottom: hp("2.6%") },
  sectionTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("1.2%") },
  inputShell: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("1%"),
    borderWidth: 1,
    borderColor: "rgba(204,120,97,0.2)",
  },
  inputLabel: { fontSize: hp("1.6%"), color: "#9F1239", fontWeight: "600", marginBottom: hp("0.4%") },
  inputValue: { fontSize: hp("1.8%"), color: "#1F2937" },
  noteCard: {
    borderRadius: 18,
    paddingVertical: hp("1.6%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp("2.4%"),
  },
  noteText: { flex: 1, fontSize: hp("1.7%"), color: "#374151", marginLeft: wp("3%") },
  saveButton: {
    backgroundColor: "#CC7861",
    borderRadius: 18,
    paddingVertical: hp("1.6%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("1%"),
  },
  saveButtonPressed: { backgroundColor: "#B35E48" },
  saveButtonText: { color: "#FFF", fontSize: hp("2%"), fontWeight: "700" },
});
