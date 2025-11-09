//Màu sắc, kích cỡ, ảnh từng loại, giá và kho từng loại
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function ProductVariationManager() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Phân loại hàng</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Màu sắc</Text>
        <View style={styles.tagRow}>
          <Pressable style={styles.tag}><Text>Đen</Text></Pressable>
          <Pressable style={styles.tag}><Text>Trắng</Text></Pressable>
          <Pressable style={[styles.tag, styles.add]}><Text>+ Thêm</Text></Pressable>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Kích cỡ</Text>
        <View style={styles.tagRow}>
          <Pressable style={styles.tag}><Text>S</Text></Pressable>
          <Pressable style={styles.tag}><Text>M</Text></Pressable>
          <Pressable style={[styles.tag, styles.add]}><Text>+ Thêm</Text></Pressable>
        </View>
      </View>

      <Pressable style={styles.nextBtn}>
        <Text style={styles.nextText}>Next: Set Variation Info</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: { fontWeight: "700", fontSize: 16, color: "#BE123C", marginBottom: 10 },
  row: { marginBottom: 10 },
  label: { fontWeight: "600", marginBottom: 6, color: "#7F1D1D" },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: "#FFF", borderColor: "#CC7861", borderWidth: 1,
    borderRadius: 6, paddingVertical: 4, paddingHorizontal: 10
  },
  add: { backgroundColor: "rgba(204,120,97,0.1)" },
  nextBtn: {
    marginTop: 10, backgroundColor: "#CC7861", borderRadius: 8,
    alignItems: "center", paddingVertical: 10
  },
  nextText: { color: "#FFF", fontWeight: "700" }
});
