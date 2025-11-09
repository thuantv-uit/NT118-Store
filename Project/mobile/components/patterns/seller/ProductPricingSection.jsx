//Giá, kho, số lượng đặt hàng tối thiểu, nhiều mức giá (mua sỉ)
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
// import dùng trong mọi file
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { wpA, hpA } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";

export default function ProductPricingSection({ price, stock, onChange }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Giá & Tồn kho</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Giá bán (VNĐ)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Nhập giá bán"
          placeholderTextColor={colors.hmee03}
          value={price}
          onChangeText={(t) => onChange("price", t)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tồn kho</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Số lượng hiện có"
          placeholderTextColor={colors.hmee03}
          value={stock}
          onChangeText={(t) => onChange("stock", t)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: hpA(18) },
  title: { fontWeight: "700", fontSize: hpA(16), color: colors.hmee05, marginBottom: hpA(10) },
  field: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(204,120,97,0.2)",
    marginBottom: hpA(10),
    paddingVertical: hpA(8),
    paddingHorizontal: wpA(14),
  },
  label: { fontSize: hpA(13), fontWeight: "600", color: colors.hmee05, marginBottom: hpA(4) },
  input: { fontSize: hpA(15), color: colors.textPrimary },
});