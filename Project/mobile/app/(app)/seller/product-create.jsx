import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./components/SellerScreenLayout";

const BASIC_FIELDS = [
  { id: "productName", label: "Tên sản phẩm", placeholder: "Ví dụ: Ly gốm Artisan A08" },
  { id: "category", label: "Danh mục", placeholder: "Đồ gốm / Bộ sưu tập xuân" },
  { id: "price", label: "Giá bán", placeholder: "Nhập giá bán (đ)" },
];

const INVENTORY_FIELDS = [
  { id: "sku", label: "Mã SKU", placeholder: "Nhập mã kho" },
  { id: "stock", label: "Tồn kho", placeholder: "Số lượng hiện có" },
  { id: "warehouse", label: "Kho xuất hàng", placeholder: "Kho chính - TP.HCM" },
];

export default function SellerProductCreate() {
  return (
    <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Hoàn tất thông tin để lên kệ">
      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.uploadCard}>
        <View style={styles.uploadIcon}>
          <Ionicons name="cloud-upload-outline" size={hp("3%")} color="#BE123C" />
        </View>
        <View style={styles.uploadTexts}>
          <Text style={styles.uploadTitle}>Thêm hình ảnh sản phẩm</Text>
          <Text style={styles.uploadSubtitle}>Ảnh sắc nét giúp tăng tỷ lệ chuyển đổi.</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.uploadButton, pressed && styles.uploadButtonPressed]}>
          <Text style={styles.uploadButtonText}>Tải lên</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        {BASIC_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputPlaceholder}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kho & giá</Text>
        {INVENTORY_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputPlaceholder}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shippingCard}>
        <MaterialCommunityIcons name="truck-delivery-outline" size={hp("3%")} color="#BE123C" />
        <View style={styles.shippingTexts}>
          <Text style={styles.shippingTitle}>Thiết lập vận chuyển</Text>
          <Text style={styles.shippingSubtitle}>Chọn đơn vị vận chuyển, thời gian xử lý và phí áp dụng.</Text>
        </View>
      </LinearGradient>

      <Pressable style={({ pressed }) => [styles.publishButton, pressed && styles.publishButtonPressed]}>
        <Text style={styles.publishButtonText}>Đăng sản phẩm</Text>
      </Pressable>
      <Pressable style={({ pressed }) => [styles.draftButton, pressed && styles.draftButtonPressed]}>
        <Text style={styles.draftButtonText}>Lưu nháp</Text>
      </Pressable>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  uploadCard: {
    borderRadius: 22,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.4%"),
  },
  uploadIcon: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  uploadTexts: { flex: 1 },
  uploadTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  uploadSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
  uploadButton: {
    backgroundColor: "#FFF",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.8%"),
    borderRadius: 999,
  },
  uploadButtonPressed: { backgroundColor: "rgba(255,255,255,0.75)" },
  uploadButtonText: { fontSize: hp("1.7%"), color: "#BE123C", fontWeight: "700" },
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
  inputPlaceholder: { fontSize: hp("1.8%"), color: "#9CA3AF" },
  shippingCard: {
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.6%"),
  },
  shippingTexts: { marginLeft: wp("3%"), flex: 1 },
  shippingTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  shippingSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
  publishButton: {
    backgroundColor: "#CC7861",
    borderRadius: 18,
    paddingVertical: hp("1.6%"),
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  publishButtonPressed: { backgroundColor: "#B35E48" },
  publishButtonText: { color: "#FFF", fontSize: hp("2%"), fontWeight: "700" },
  draftButton: {
    borderRadius: 18,
    paddingVertical: hp("1.4%"),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(204,120,97,0.4)",
    marginBottom: hp("1%"),
  },
  draftButtonPressed: { backgroundColor: "rgba(204,120,97,0.1)" },
  draftButtonText: { color: "#CC7861", fontSize: hp("1.9%"), fontWeight: "700" },
});
