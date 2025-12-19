import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { API_URL } from "../../../constants/api";

const MAX_IMAGES = 5;

export default function ProductEdit() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [SKU, setSKU] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/product/${id}`);
      if (!res.ok) throw new Error(`Fetch product failed ${res.status}`);
      const data = await res.json();
      setProduct(data);
      setName(data.name || "");
      setDescription(data.description || "");
      setSKU(data.SKU || "");
      setCategoryId(data.category_id?.toString() || "");
      setImages(data.images || []);
      setVariants(data.variants || []);
    } catch (err) {
      setError(err.message || "Không tải được sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      const total = images.length + newImages.length;
      if (total > MAX_IMAGES) {
        Alert.alert("Lỗi", `Tối đa ${MAX_IMAGES} ảnh!`);
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    );
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, { size: "", color: "", price: "", stock: "", weight: "", dimensions: "" }]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      Alert.alert("Lỗi", "Phải có ít nhất 1 biến thể!");
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!product) return;
    
    if (!name.trim() || !SKU.trim() || !categoryId.trim()) {
      Alert.alert("Lỗi", "Tên, SKU và Danh mục là bắt buộc!");
      return;
    }

    if (variants.length === 0) {
      Alert.alert("Lỗi", "Phải có ít nhất 1 biến thể!");
      return;
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.size || !v.color || !v.price || !v.stock || !v.weight || !v.dimensions) {
        Alert.alert("Lỗi", `Biến thể ${i + 1}: Vui lòng điền đầy đủ thông tin!`);
        return;
      }
    }

    try {
      setSaving(true);
      
      const parsedVariants = variants.map(v => ({
        size: v.size,
        color: v.color,
        price: parseFloat(v.price) || 0,
        stock: parseInt(v.stock) || 0,
        weight: parseFloat(v.weight) || 0,
        dimensions: v.dimensions,
      }));

      const formData = new FormData();
      formData.append("SKU", SKU);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category_id", parseInt(categoryId));
      formData.append("customer_id", userId);
      formData.append("variants", JSON.stringify(parsedVariants));

      // Append images
      images.forEach((imageUri, index) => {
        // Check if it's a new local image or existing URL
        if (imageUri.startsWith('file://') || imageUri.startsWith('content://')) {
          const fileName = `product_${Date.now()}_${index}.jpg`;
          formData.append("images", {
            uri: imageUri,
            type: 'image/jpeg',
            name: fileName,
          });
        } else {
          // Keep existing image URL
          formData.append("existingImages", imageUri);
        }
      });

      const res = await fetch(`${API_URL}/product/${product.id}`, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res.ok) {
        const msg = (await res.json())?.message || `Lưu thất bại ${res.status}`;
        throw new Error(msg);
      }

      Alert.alert("Thành công", "Đã cập nhật sản phẩm", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator color="#f7729a" size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#fff" }}>
        <Text style={{ color: "#b91c1c", fontWeight: "800", marginBottom: 8 }}>Lỗi</Text>
        <Text style={{ color: "#475569", textAlign: "center" }}>{error}</Text>
        <Pressable onPress={fetchProduct} style={({ pressed }) => [{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: pressed ? "#e85d88" : "#f7729a" }]}>
          <Text style={{ color: "#fff", fontWeight: "800" }}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={hp("2.4%")} color="#0f172a" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chỉnh sửa sản phẩm</Text>
          <Text style={styles.headerSubtitle}>{product?.SKU}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Thông tin cơ bản */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mã SKU <Text style={styles.required}>*</Text></Text>
            <TextInput
              value={SKU}
              onChangeText={setSKU}
              placeholder="Nhập mã SKU"
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên sản phẩm <Text style={styles.required}>*</Text></Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên sản phẩm"
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Danh mục (ID) <Text style={styles.required}>*</Text></Text>
            <TextInput
              value={categoryId}
              onChangeText={setCategoryId}
              placeholder="Nhập ID danh mục"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Mô tả sản phẩm"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />
          </View>
        </View>

        {/* Hình ảnh */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>
          <Pressable
            onPress={pickImages}
            disabled={images.length >= MAX_IMAGES}
            style={({ pressed }) => [
              styles.uploadBtn,
              pressed && { opacity: 0.7 },
              images.length >= MAX_IMAGES && styles.uploadBtnDisabled
            ]}
          >
            <Ionicons name="cloud-upload-outline" size={hp("3%")} color="#f7729a" />
            <Text style={styles.uploadBtnText}>
              {images.length >= MAX_IMAGES ? "Đã đạt giới hạn" : "Chọn ảnh"}
            </Text>
            <Text style={styles.uploadHint}>{images.length}/{MAX_IMAGES}</Text>
          </Pressable>

          {images.length > 0 && (
            <View style={styles.imageGrid}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageCard}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <Pressable
                    onPress={() => removeImage(index)}
                    style={styles.removeImageBtn}
                  >
                    <Ionicons name="close-circle" size={hp("2.6%")} color="#ef4444" />
                  </Pressable>
                  <View style={styles.imageIndexBadge}>
                    <Text style={styles.imageIndexText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Biến thể */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Biến thể sản phẩm</Text>
            <Pressable
              onPress={addVariant}
              style={({ pressed }) => [
                styles.addBtn,
                pressed && { opacity: 0.7 }
              ]}
            >
              <Ionicons name="add-circle-outline" size={hp("2%")} color="#fff" />
              <Text style={styles.addBtnText}>Thêm</Text>
            </Pressable>
          </View>

          {variants.map((variant, index) => (
            <View key={index} style={styles.variantCard}>
              <View style={styles.variantHeader}>
                <View style={styles.variantBadge}>
                  <Text style={styles.variantBadgeText}>#{index + 1}</Text>
                </View>
                {variants.length > 1 && (
                  <Pressable
                    onPress={() => removeVariant(index)}
                    style={({ pressed }) => [
                      styles.removeBtn,
                      pressed && { opacity: 0.6 }
                    ]}
                  >
                    <Ionicons name="trash-outline" size={hp("2%")} color="#ef4444" />
                  </Pressable>
                )}
              </View>

              <View style={styles.variantFields}>
                <View style={styles.variantRow}>
                  <View style={[styles.variantInputGroup, { flex: 1, marginRight: wp("2%") }]}>
                    <Text style={styles.variantLabel}>Kích thước <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      value={variant.size}
                      onChangeText={(val) => handleVariantChange(index, "size", val)}
                      placeholder="M"
                      placeholderTextColor="#94a3b8"
                      style={styles.variantInput}
                    />
                  </View>
                  <View style={[styles.variantInputGroup, { flex: 1 }]}>
                    <Text style={styles.variantLabel}>Màu sắc <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      value={variant.color}
                      onChangeText={(val) => handleVariantChange(index, "color", val)}
                      placeholder="Đỏ"
                      placeholderTextColor="#94a3b8"
                      style={styles.variantInput}
                    />
                  </View>
                </View>

                <View style={styles.variantRow}>
                  <View style={[styles.variantInputGroup, { flex: 1, marginRight: wp("2%") }]}>
                    <Text style={styles.variantLabel}>Giá bán (đ) <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      value={variant.price?.toString()}
                      onChangeText={(val) => handleVariantChange(index, "price", val)}
                      placeholder="0"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numeric"
                      style={styles.variantInput}
                    />
                  </View>
                  <View style={[styles.variantInputGroup, { flex: 1 }]}>
                    <Text style={styles.variantLabel}>Tồn kho <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      value={variant.stock?.toString()}
                      onChangeText={(val) => handleVariantChange(index, "stock", val)}
                      placeholder="0"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numeric"
                      style={styles.variantInput}
                    />
                  </View>
                </View>

                <View style={styles.variantInputGroup}>
                  <Text style={styles.variantLabel}>Cân nặng (gram) <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    value={variant.weight?.toString()}
                    onChangeText={(val) => handleVariantChange(index, "weight", val)}
                    placeholder="250"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    style={styles.variantInput}
                  />
                </View>

                <View style={styles.variantInputGroup}>
                  <Text style={styles.variantLabel}>Kích thước vận chuyển <Text style={styles.required}>*</Text></Text>
                  <TextInput
                    value={variant.dimensions}
                    onChangeText={(val) => handleVariantChange(index, "dimensions", val)}
                    placeholder="10x20x30 cm"
                    placeholderTextColor="#94a3b8"
                    style={styles.variantInput}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveBtn,
            pressed && { opacity: 0.85 },
            saving && styles.saveBtnDisabled
          ]}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={hp("2.2%")} color="#fff" />
              <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.2%"),
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: {
    width: wp("9%"),
    height: wp("9%"),
    borderRadius: wp("4.5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: hp("2.2%"), fontWeight: "800", color: "#0f172a" },
  headerSubtitle: { fontSize: hp("1.5%"), color: "#64748b", marginTop: 2, fontWeight: "600" },
  headerRight: { width: wp("9%") },
  scrollContent: {
    padding: wp("4%"),
    paddingBottom: hp("3%"),
  },
  section: {
    marginBottom: hp("2.4%"),
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: wp("4%"),
    borderWidth: 1,
    borderColor: "rgba(154,214,223,0.25)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp("1.5%"),
  },
  sectionTitle: {
    fontSize: hp("2%"),
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: hp("1.2%"),
  },
  inputGroup: { marginBottom: hp("1.2%") },
  label: {
    fontSize: hp("1.6%"),
    fontWeight: "700",
    color: "#0f766e",
    marginBottom: hp("0.6%"),
  },
  required: { color: "#ef4444", fontSize: hp("1.7%") },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1.5,
    borderColor: "rgba(154,214,223,0.4)",
    borderRadius: 12,
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1.2%"),
    fontSize: hp("1.7%"),
    color: "#0f172a",
    fontWeight: "600",
  },
  textArea: {
    minHeight: hp("10%"),
    textAlignVertical: "top",
  },
  uploadBtn: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(247,114,154,0.4)",
    borderRadius: 14,
    paddingVertical: hp("2.5%"),
    alignItems: "center",
    backgroundColor: "rgba(247,188,211,0.05)",
  },
  uploadBtnDisabled: {
    opacity: 0.5,
    borderColor: "#cbd5e1",
  },
  uploadBtnText: {
    fontSize: hp("1.8%"),
    fontWeight: "800",
    color: "#0f172a",
    marginTop: hp("0.5%"),
  },
  uploadHint: {
    fontSize: hp("1.4%"),
    color: "#64748b",
    marginTop: hp("0.4%"),
    fontWeight: "600",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("3%"),
    marginTop: hp("1.5%"),
  },
  imageCard: {
    width: wp("26%"),
    height: wp("26%"),
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
    borderWidth: 2,
    borderColor: "rgba(154,214,223,0.3)",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    padding: 2,
  },
  imageIndexBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(15,118,110,0.9)",
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.3%"),
    borderRadius: 6,
  },
  imageIndexText: {
    fontSize: hp("1.3%"),
    fontWeight: "800",
    color: "#fff",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f766e",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.7%"),
    borderRadius: 20,
    gap: wp("1%"),
  },
  addBtnText: {
    fontSize: hp("1.6%"),
    fontWeight: "800",
    color: "#fff",
  },
  variantCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: wp("3.5%"),
    borderWidth: 1.5,
    borderColor: "rgba(154,214,223,0.35)",
    marginBottom: hp("1.2%"),
  },
  variantHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp("1%"),
    paddingBottom: hp("0.8%"),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(154,214,223,0.25)",
  },
  variantBadge: {
    backgroundColor: "#f7729a",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.4%"),
    borderRadius: 8,
  },
  variantBadgeText: {
    fontSize: hp("1.5%"),
    fontWeight: "900",
    color: "#fff",
  },
  removeBtn: { padding: hp("0.6%") },
  variantFields: { gap: hp("1%") },
  variantRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  variantInputGroup: { marginBottom: hp("0.6%") },
  variantLabel: {
    fontSize: hp("1.5%"),
    fontWeight: "700",
    color: "#475569",
    marginBottom: hp("0.4%"),
  },
  variantInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(154,214,223,0.35)",
    borderRadius: 10,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    fontSize: hp("1.6%"),
    color: "#0f172a",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#f7729a",
    borderRadius: 16,
    paddingVertical: hp("1.8%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp("2%"),
    shadowColor: "#f7729a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginTop: hp("1%"),
  },
  saveBtnDisabled: {
    backgroundColor: "#cbd5e1",
    shadowOpacity: 0,
  },
  saveBtnText: {
    fontSize: hp("2%"),
    fontWeight: "900",
    color: "#fff",
  },
});
