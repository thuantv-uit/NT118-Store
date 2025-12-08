import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { API_URL } from "../../../constants/api";
import SellerScreenLayout from "./SellerScreenLayout";

const BASIC_FIELDS = [
  { id: "SKU", label: "Mã SKU", placeholder: "Nhập mã kho", value: "" },
  { id: "name", label: "Tên sản phẩm", placeholder: "Ví dụ: Ly gốm Artisan A08", value: "" },
  { id: "category_id", label: "Danh mục (ID)", placeholder: "Nhập ID danh mục (số)", value: "", keyboardType: "numeric" },
];

const DESCRIPTION_SECTIONS = [
  { id: "features", label: "Tính năng nổi bật", placeholder: "Liệt kê các tính năng chính của sản phẩm...", value: "", multiline: true, lines: 3 },
  { id: "origin", label: "Thông tin xuất xứ", placeholder: "Nguồn gốc, chất liệu, nhà sản xuất...", value: "", multiline: true, lines: 3 },
  { id: "usage", label: "Hướng dẫn sử dụng", placeholder: "Cách sử dụng, bảo quản sản phẩm...", value: "", multiline: true, lines: 3 },
  { id: "industry_info", label: "Thông tin đặc trưng của ngành hàng", placeholder: "Đặc điểm nổi bật của loại sản phẩm này...", value: "", multiline: true, lines: 3 },
];

const VARIANT_FIELDS = [
  { id: "size", label: "Kích thước", placeholder: "Ví dụ: M", value: "" },
  { id: "color", label: "Màu sắc", placeholder: "Ví dụ: Đỏ", value: "" },
  { id: "price", label: "Giá bán", placeholder: "Nhập giá (đ)", value: "", keyboardType: "numeric" },
  { id: "stock", label: "Tồn kho", placeholder: "Số lượng hiện có", value: "", keyboardType: "numeric" },
  { id: "weight", label: "Cân nặng (gram)", placeholder: "Ví dụ: 250", value: "", keyboardType: "numeric" },
  { id: "dimensions", label: "Kích thước vận chuyển", placeholder: "Ví dụ: 10x20x30 cm", value: "" },
];

const SHIPPING_OPTIONS = ["GHTK", "GHN", "Viettel Post", "J&T Express"];

const MAX_IMAGES = 5;
const MAX_VARIANTS = 10;

export default function SellerProductCreate({ navigation }) {
  const [formData, setFormData] = useState(
    { ...BASIC_FIELDS.reduce((acc, field) => { acc[field.id] = field.value; return acc; }, {}),
      ...DESCRIPTION_SECTIONS.reduce((acc, field) => { acc[field.id] = field.value; return acc; }, {}),
      category_id: "" }
  );
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]); // Lưu data gốc cho table
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [shippingData, setShippingData] = useState({
    method: SHIPPING_OPTIONS[0],
    processing_time: "1-2",
    shipping_fee: "",
  });
  const [variants, setVariants] = useState([{ id: Date.now(), ...Object.fromEntries(VARIANT_FIELDS.map(f => [f.id, ""])) }]);
  const [images, setImages] = useState([]); // Array URIs cho preview
  const [loading, setLoading] = useState(false);

  // THÊM: Lấy userId từ Clerk
  const { userId, isLoaded } = useAuth();

  // Mới: Fetch categories khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_URL}/category`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("LOG all categories:", data); // Debug log
        setOriginalCategories(data || []); // Lưu data gốc cho table
        console.log("Set originalCategories:", data || []); // Debug log sau set
        // Giả sử data là array [{id, name, parent_id?, gender_type?}], flatten với indent cho nested
        const flattenedCategories = flattenCategories(data || []);
        console.log("LOG flattened categories:", flattenedCategories); // Debug log
        setCategories(flattenedCategories);
      } catch (error) {
        console.error("Lỗi fetch categories:", error);
        Alert.alert("Lỗi", "Không thể tải danh mục. Vui lòng thử lại hoặc nhập ID thủ công.");
        // Fallback: Giữ nguyên TextInput cũ nếu fetch fail
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Mới: Helper để flatten tree categories với indent (hiển thị dạng "Parent > Child")
  // Fix: Handle flat list (no parent_id) by treating all as top-level if parentId null
  const flattenCategories = (categories, parentId = null, level = 0) => {
    return categories
      .filter(cat => {
        if (parentId === null) {
          // Top-level: no parent_id or parent_id is null/undefined
          return cat.parent_id == null; // == null handles both null and undefined
        } else {
          return cat.parent_id === parentId;
        }
      })
      .flatMap(cat => [
        {
          id: cat.id,
          displayName: "  ".repeat(level) + `• ${cat.name}`, // Indent với dấu chấm
          gender_type: cat.gender_type, // Thêm gender_type cho bảng
        },
        ...flattenCategories(categories, cat.id, level + 1), // Recursive cho con
      ]);
  };
  
  const handleInputChange = (id, value) => {
    const isNumeric = ["price", "stock", "weight", "category_id"].includes(id);
    let processedValue = value;
    if (isNumeric) {
      let numericValue = Number(value);
      if (numericValue > 2147483646) {
        numericValue = 2147483646;
      }
      processedValue = numericValue.toString();
    }
    // Cho description sections và text khác, giữ nguyên string
    setFormData((prev) => ({ ...prev, [id]: processedValue }));
  };

  // THÊM: Update field trong variant cụ thể (tương tự, handle numeric)
  const handleVariantChange = (variantId, fieldId, value) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, [fieldId]: ["price", "stock", "weight"].includes(fieldId) ? Number(value).toString() : value }
          : v
      )
    );
  };

  // THÊM: Update shipping
  const handleShippingChange = (fieldId, value) => {
    setShippingData((prev) => ({ ...prev, [fieldId]: value }));
  };

  // THÊM: Thêm variant mới
  const addVariant = () => {
    if (variants.length >= MAX_VARIANTS) {
      Alert.alert("Lỗi", `Tối đa ${MAX_VARIANTS} biến thể!`);
      return;
    }
    setVariants((prev) => [...prev, { id: Date.now(), ...Object.fromEntries(VARIANT_FIELDS.map(f => [f.id, ""])) }]);
  };

  // THÊM: Xóa variant
  const removeVariant = (variantId) => {
    if (variants.length <= 1) {
      Alert.alert("Lỗi", "Phải có ít nhất 1 biến thể!");
      return;
    }
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  // THÊM: Chọn multiple images
  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh để chọn ảnh!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages = result.assets.map(asset => asset.uri);
      const total = images.length + newImages.length;
      if (total > MAX_IMAGES) {
        Alert.alert("Lỗi", `Tối đa ${MAX_IMAGES} ảnh! Đã chọn ${total} ảnh.`);
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
      Alert.alert("Thành công", `Đã chọn ${newImages.length} ảnh!`);
    }
  };

  // THÊM: Xóa image cụ thể
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    // THÊM: Check userId từ Clerk
    if (!isLoaded || !userId) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập để tạo sản phẩm!");
      return false;
    }

    const requiredBasic = ["SKU", "name", "category_id"];
    for (let field of requiredBasic) {
      if (!formData[field] || formData[field].trim() === "") {
        Alert.alert("Lỗi", `${BASIC_FIELDS.find(f => f.id === field)?.label || field} là bắt buộc!`);
        return false;
      }
    }

    if (parseInt(formData.category_id) <= 0) {
      Alert.alert("Lỗi", "category_id phải > 0!");
      return false;
    }

    // THÊM: Validate description sections (ít nhất 1 không rỗng, nhưng optional)
    const hasDescription = DESCRIPTION_SECTIONS.some(sec => formData[sec.id].trim() !== "");
    if (!hasDescription) {
      Alert.alert("Cảnh báo", "Nên thêm mô tả để sản phẩm hấp dẫn hơn!");
      // Không return false, chỉ warn
    }

    // THÊM: Validate variants (ít nhất 1, size/color required, price>0, stock>=0, weight>=0)
    if (variants.length === 0) {
      Alert.alert("Lỗi", "Phải có ít nhất 1 biến thể sản phẩm!");
      return false;
    }
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.size || !v.color) {
        Alert.alert("Lỗi", `Biến thể ${i + 1}: Kích thước và màu sắc là bắt buộc!`);
        return false;
      }
      if (parseFloat(v.price) <= 0 || parseInt(v.stock) < 0 || parseFloat(v.weight) < 0) {
        Alert.alert("Lỗi", `Biến thể ${i + 1}: Giá > 0, tồn kho >= 0, cân nặng >= 0!`);
        return false;
      }
      if (!v.dimensions || v.dimensions.trim() === "") {
        Alert.alert("Lỗi", `Biến thể ${i + 1}: Kích thước vận chuyển là bắt buộc!`);
        return false;
      }
    }

    // Check unique size+color (case-insensitive)
    const uniqueKeys = variants.map(v => `${v.size.toLowerCase()}-${v.color.toLowerCase()}`);
    const duplicates = uniqueKeys.filter((k, idx) => uniqueKeys.indexOf(k) !== idx);
    if (duplicates.length > 0) {
      Alert.alert("Lỗi", `Biến thể trùng lặp: ${duplicates.join(', ')} (size-color)!`);
      return false;
    }

    // THÊM: Validate shipping (optional, nhưng fee numeric nếu có)
    if (shippingData.shipping_fee && (isNaN(parseFloat(shippingData.shipping_fee)) || parseFloat(shippingData.shipping_fee) < 0)) {
      Alert.alert("Lỗi", "Phí vận chuyển phải là số >= 0!");
      return false;
    }

    return true;
  };

  // CẬP NHẬT: Create product với merged description, shipping JSON, variants (JSON), multiple images
  const handleCreateProduct = async () => {
    if (!validateForm()) return;
    const baseURL = API_URL;

    setLoading(true);
    try {
      // Merge description sections
      const description = DESCRIPTION_SECTIONS.map(sec => formData[sec.id].trim()).filter(Boolean).join("\n\n");

      // Parse variants với numeric conversion
      const parsedVariants = variants.map(v => ({
        size: v.size,
        color: v.color,
        price: parseFloat(v.price),
        stock: parseInt(v.stock),
        weight: parseFloat(v.weight),
        dimensions: v.dimensions,
      }));

      // Shipping as JSON (backend có thể xử lý sau)
      const shipping = {
        method: shippingData.method,
        processing_time: shippingData.processing_time,
        shipping_fee: parseFloat(shippingData.shipping_fee) || 0,
      };

      // Create FormData
      const formPayload = new FormData();
      formPayload.append("SKU", formData.SKU);
      formPayload.append("name", formData.name);
      formPayload.append("description", description);
      formPayload.append("category_id", parseInt(formData.category_id));
      formPayload.append("customer_id", userId);
      formPayload.append("variants", JSON.stringify(parsedVariants)); // JSON string cho variants
      formPayload.append("shipping", JSON.stringify(shipping)); // JSON cho shipping

      // Append multiple images
      images.forEach((imageUri, index) => {
        const fileName = `product_${Date.now()}_${index}.jpg`; // Generic name
        formPayload.append("images", { // Field name: 'images' (array)
          uri: imageUri,
          type: 'image/jpeg',
          name: fileName,
        });
      });

      const response = await fetch(`${baseURL}/product`, {
        method: "POST",
        body: formPayload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Sản phẩm đã được tạo!", [
          { text: "OK", onPress: () => {
            navigation?.navigate("ProductList");
            // Clear form
            setFormData({ ...BASIC_FIELDS.reduce((acc, field) => { acc[field.id] = ""; return acc; }, {}),
                          ...DESCRIPTION_SECTIONS.reduce((acc, field) => { acc[field.id] = ""; return acc; }, {}) });
            setShippingData({ method: SHIPPING_OPTIONS[0], processing_time: "1-2", shipping_fee: "" });
            setVariants([{ id: Date.now(), ...Object.fromEntries(VARIANT_FIELDS.map(f => [f.id, ""])) }]);
            setImages([]);
          }},
        ]);
      } else {
        Alert.alert("Lỗi", result.message || "Không thể tạo sản phẩm!");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Lỗi", "Kết nối backend thất bại. Kiểm tra server!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    // Merge description for log
    const description = DESCRIPTION_SECTIONS.map(sec => formData[sec.id].trim()).filter(Boolean).join("\n\n");
    console.log("Lưu nháp:", { formData: { ...formData, description }, shippingData, variants, images: images.length });
    Alert.alert("Nháp", "Đã lưu nháp!");
  };

  // THÊM: Loading state cho Clerk
  if (!isLoaded) {
    return (
      <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Đang tải...">
        <ActivityIndicator size="large" color="#BE123C" style={{ alignSelf: "center", marginTop: hp("20%") }} />
      </SellerScreenLayout>
    );
  }

  return (
    <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Hoàn tất thông tin để lên kệ">
      <ScrollView style={styles.scrollContainer}>
        {/* THÊM: Preview multiple images */}
        {images.length > 0 && (
          <View style={styles.imagesPreview}>
            <Text style={styles.sectionTitle}>Ảnh đã chọn ({images.length}/{MAX_IMAGES})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageItem}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <Pressable style={styles.removeImageButton} onPress={() => removeImage(index)}>
                    <Ionicons name="close-circle" size={20} color="#FF0000" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Upload card for multiple images */}
        <LinearGradient
          colors={["#FFE5EA", "#FAD4D6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.uploadCard}
        >
          <View style={styles.uploadIcon}>
            <Ionicons name="cloud-upload-outline" size={hp("3%")} color="#BE123C" />
          </View>
          <View style={styles.uploadTexts}>
            <Text style={styles.uploadTitle}>Thêm hình ảnh sản phẩm (tối đa {MAX_IMAGES})</Text>
            <Text style={styles.uploadSubtitle}>Chọn nhiều ảnh để hiển thị chi tiết.</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.uploadButton, pressed && styles.uploadButtonPressed]}
            onPress={pickImages}
            disabled={loading || images.length >= MAX_IMAGES}
          >
            <Text style={styles.uploadButtonText}>Tải lên</Text>
          </Pressable>
        </LinearGradient>

        {/* THÊM: Section Variants */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Biến thể sản phẩm</Text>
            <Pressable style={styles.addVariantButton} onPress={addVariant} disabled={variants.length >= MAX_VARIANTS}>
              <Ionicons name="add-circle" size={24} color="#BE123C" />
              <Text style={styles.addVariantText}>Thêm</Text>
            </Pressable>
          </View>
          {variants.map((variant, index) => (
            <View key={variant.id} style={styles.variantContainer}>
              <View style={styles.variantHeader}>
                <Text style={styles.variantTitle}>Biến thể {index + 1}</Text>
                {variants.length > 1 && (
                  <Pressable onPress={() => removeVariant(variant.id)} style={styles.removeVariantButton}>
                    <Ionicons name="trash-outline" size={20} color="#FF0000" />
                  </Pressable>
                )}
              </View>
              {VARIANT_FIELDS.map((item) => (
                <View key={item.id} style={styles.inputShell}>
                  <Text style={styles.inputLabel}>{item.label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={item.placeholder}
                    value={variant[item.id]}
                    onChangeText={(value) => handleVariantChange(variant.id, item.id, value)}
                    keyboardType={item.keyboardType}
                    multiline={item.id === "dimensions"}
                    numberOfLines={item.id === "dimensions" ? 2 : 1}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* MỚI: Section Bảng danh mục (hiển thị ID, Tên, Giới tính với indent cho hierarchy) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách danh mục</Text>
          {loadingCategories ? (
            <ActivityIndicator size="large" color="#BE123C" style={{ alignSelf: "center", marginTop: hp("2%") }} />
          ) : categories.length > 0 ? (
            <ScrollView style={styles.categoryTable} nestedScrollEnabled={true}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>ID</Text>
                <Text style={[styles.tableHeaderText, { flex: 2 }]}>Tên danh mục</Text>
                <Text style={styles.tableHeaderText}>Giới tính</Text>
              </View>
              {categories.map((cat, index) => (
                <View key={cat.id} style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}>
                  <Text style={styles.tableCell}>{cat.id}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{cat.displayName}</Text>
                  <Text style={styles.tableCell}>{cat.gender_type || 'N/A'}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.input}>Không có dữ liệu danh mục.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
          {BASIC_FIELDS.map((item) => (
            <View key={item.id} style={styles.inputShell}>
              <Text style={styles.inputLabel}>{item.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={item.placeholder}
                value={formData[item.id]}
                onChangeText={(value) => handleInputChange(item.id, value)}
                keyboardType={item.keyboardType}
              />
            </View>
          ))}
        </View>

        {/* THÊM: Section Mô tả chi tiết (4 phần, multiline lớn hơn) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          {DESCRIPTION_SECTIONS.map((item) => (
            <View key={item.id} style={styles.inputShell}>
              <Text style={styles.inputLabel}>{item.label}</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder={item.placeholder}
                value={formData[item.id]}
                onChangeText={(value) => handleInputChange(item.id, value)} // Giữ string
                multiline={item.multiline}
                numberOfLines={item.lines}
                textAlignVertical="top"
              />
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.publishButton, pressed && styles.publishButtonPressed]}
          onPress={handleCreateProduct}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.publishButtonText}>Đăng sản phẩm</Text>
          )}
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.draftButton, pressed && styles.draftButtonPressed]}
          onPress={handleSaveDraft}
          disabled={loading}
        >
          <Text style={styles.draftButtonText}>Lưu nháp</Text>
        </Pressable>
      </ScrollView>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingBottom: hp("10%"),
  },
  // THÊM: Styles cho multiple images preview
  imagesPreview: {
    marginBottom: hp("2%"),
  },
  imageItem: {
    width: wp("25%"),
    height: wp("25%"),
    marginRight: wp("2%"),
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 10,
    padding: 2,
  },
  // THÊM: Styles cho variants section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  addVariantButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(190, 18, 60, 0.1)",
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 20,
  },
  addVariantText: {
    marginLeft: wp("1%"),
    color: "#BE123C",
    fontWeight: "600",
    fontSize: hp("1.6%"),
  },
  variantContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: wp("4%"),
    marginBottom: hp("2%"),
    borderWidth: 1,
    borderColor: "rgba(190, 18, 60, 0.1)",
  },
  variantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  variantTitle: {
    fontSize: hp("2%"),
    fontWeight: "700",
    color: "#BE123C",
  },
  removeVariantButton: {
    padding: 5,
  },
  // MỚI: Styles cho bảng danh mục (cải thiện UI)
  categoryTable: {
    maxHeight: hp("30%"), // Tăng chiều cao một chút
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: hp("1%"),
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#BE123C",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.5%"),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: hp("1.8%"),
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.2%"),
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowEven: {
    backgroundColor: "#F9FAFB",
  },
  tableRowOdd: {
    backgroundColor: "#FFF",
  },
  tableCell: {
    flex: 1,
    fontSize: hp("1.7%"),
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
  },
  // THÊM: Styles cho multiline description (lớn hơn)
  multilineInput: {
    minHeight: hp("8%"), // Lớn hơn để dễ nhập
    maxHeight: hp("15%"),
  },

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
  uploadSubtitle: {
    fontSize: hp("1.7%"),
    color: "#4B5563",
    marginTop: hp("0.2%"),
  },
  uploadButton: {
    backgroundColor: "#FFF",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("0.8%"),
    borderRadius: 999,
  },
  uploadButtonPressed: { backgroundColor: "rgba(255,255,255,0.75)" },
  uploadButtonText: { fontSize: hp("1.7%"), color: "#BE123C", fontWeight: "700" },
  section: { marginBottom: hp("2.6%") },
  sectionTitle: {
    fontSize: hp("2.1%"),
    fontWeight: "700",
    color: "#BE123C",
    marginBottom: hp("1.2%"),
  },
  inputShell: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("1%"),
    borderWidth: 1,
    borderColor: "rgba(204,120,97,0.2)",
  },
  inputLabel: {
    fontSize: hp("1.6%"),
    color: "#9F1239",
    fontWeight: "600",
    marginBottom: hp("0.4%"),
  },
  input: {
    fontSize: hp("1.8%"),
    color: "#000",
    padding: 0,
  },
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