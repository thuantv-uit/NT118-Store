// NT118-Store/Project/mobile/components/patterns/seller/ProductBasicInfo.jsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProductBasicInfo({
  name,
  description,
  brand,
  category,
  onChange,
  // onSelectCategory,
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const router = useRouter();

  // 🚀 Fetch danh mục khi component mount
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid categories payload");
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories error:", err);
      Alert.alert("Lỗi", "Không lấy được danh sách danh mục.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return Alert.alert("Thiếu tên danh mục");
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Lỗi khi thêm danh mục");
      setCategories((prev) => [...prev, data]);
      setNewCategory("");
      Alert.alert("Thành công", "Đã thêm danh mục mới");
    } catch (err) {
      Alert.alert("Lỗi", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

      {/* Tên sản phẩm */}
      <Text style={styles.label}>Tên sản phẩm *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên sản phẩm"
        value={name}
        onChangeText={(t) => onChange("name", t)}
      />

      {/* Mô tả */}
      <Text style={styles.label}>Mô tả *</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Nhập mô tả sản phẩm..."
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={(t) => onChange("description", t)}
      />

      {/* Dropdown danh mục
      <Text style={styles.label}>Danh mục *</Text>
      <View style={styles.dropdownWrapper}>
        <Picker
          selectedValue={category || ""}
          onValueChange={(value) => {
            if (value === "__add_new__") {
              Alert.prompt("Tạo danh mục mới", "", [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Thêm",
                  onPress: async (text) => {
                    setNewCategory(text);
                    await handleAddCategory();
                  },
                },
              ]);
              return;
            }

            if (value) onSelectCategory?.(value); // ✅ an toàn
          }}
          enabled={!loading}
          style={styles.picker}
        >
          <Picker.Item label="-- Chọn danh mục sản phẩm --" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
          ))}
          <Picker.Item label="+ Thêm danh mục mới" value="__add_new__" />

        </Picker>
      </View> */}
      {/* Chọn danh mục
      <Pressable
        style={styles.selector}
        // Route groups (folders named with parentheses) are not part of the URL path.
        // Navigate to the screen path without the group, e.g. "/select-category".
        onPress={() => { console.log("✅ Press detected - navigating..."); router.push("/select-category") }}
      >
        <Text style={styles.label}>Danh mục *</Text>
        <View style={styles.selectorRow}>
          <Text style={category ? styles.value : styles.placeholder}>
            {category || "Chọn danh mục sản phẩm"}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </View>
      </Pressable> */}

      {/* Thương hiệu */}
      <Text style={styles.label}>Thương hiệu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập thương hiệu (nếu có)"
        value={brand}
        onChangeText={(t) => onChange("brand", t)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: { fontWeight: "700", fontSize: 16, color: "#BE123C", marginBottom: 10 },
  label: { fontWeight: "600", color: "#7F1D1D", marginTop: 10, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(204,120,97,0.3)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#FFF",
  },
  textarea: { height: 100, textAlignVertical: "top" },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: "rgba(204,120,97,0.3)",
    borderRadius: 10,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  picker: { height: 44, color: "#111827" },
});
