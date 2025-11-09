//Cân nặng, kích thước, lựa chọn đơn vị vận chuyển
import React from "react";
import { View, Text, TextInput, StyleSheet, Switch } from "react-native";
// import dùng trong mọi file
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { wpA, hpA } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";

export default function ProductShippingSection({ shipping, onChange }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Vận chuyển</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Phương thức</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: Giao hàng tiêu chuẩn"
          value={shipping.method}
          onChangeText={(t) => onChange("shipping", { ...shipping, method: t })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phí vận chuyển (VNĐ)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập phí vận chuyển"
          keyboardType="numeric"
          value={shipping.cost}
          onChangeText={(t) => onChange("shipping", { ...shipping, cost: t })}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Thời gian xử lý (ngày)</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: 2 - 3 ngày"
          value={shipping.time}
          onChangeText={(t) => onChange("shipping", { ...shipping, time: t })}
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