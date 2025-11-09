//Lưu nháp / Hiển thị sản phẩm
import React from "react";
import { View, Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
// import dùng trong mọi file
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { wpA, hpA } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";



export default function ProductActionButtons({ onSubmit, onSaveDraft, loading }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.draftBtn} onPress={onSaveDraft} disabled={loading}>
        <Text style={styles.draftText}>Lưu nháp</Text>
      </Pressable>

      <Pressable onPress={onSubmit} disabled={loading} style={{ flex: 1 }}>
        <LinearGradient
          colors={["#CC7861", "#B35E48"]}
          style={[styles.publishBtn, loading && { opacity: 0.6 }]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.publishText}>Đăng bán</Text>
          )}
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  draftBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CC7861",
    paddingVertical: 12,
    alignItems: "center",
  },
  draftText: { color: "#CC7861", fontWeight: "700" },
  publishBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  publishText: { color: "#FFF", fontWeight: "700" },
});