//Tình trạng sản phẩm, hàng đặt trước, cài đặt thời gian đăng, chia sẻ Facebook
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function ProductAdditionalSettings() {
  const [preOrder, setPreOrder] = useState(false);
  const [shareFb, setShareFb] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thông tin khác</Text>
      <View style={styles.row}>
        <Text>Tình trạng sản phẩm</Text>
        <Text style={styles.value}>Mới</Text>
      </View>
      <View style={styles.row}>
        <Text>Hàng đặt trước</Text>
        <Switch value={preOrder} onValueChange={setPreOrder} />
      </View>
      <View style={styles.row}>
        <Text>Chia sẻ lên Facebook</Text>
        <Switch value={shareFb} onValueChange={setShareFb} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: { fontWeight: "700", fontSize: 16, color: "#BE123C", marginBottom: 10 },
  row: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 10, borderBottomWidth: 1,
    borderColor: "#f2f2f2"
  },
  value: { color: "#9CA3AF" }
});
