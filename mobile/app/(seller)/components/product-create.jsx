import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const [formData, setFormData] = useState(
    { ...BASIC_FIELDS.reduce((acc, field) => { acc[field.id] = field.value; return acc; }, {}),
      ...DESCRIPTION_SECTIONS.reduce((acc, field) => { acc[field.id] = field.value; return acc; }, {}),
      category_id: "" }
  );
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]); // Lưu data gốc cho table
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showCategories, setShowCategories] = useState(false); // Toggle category table
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
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Quick Action Card - Quản lý sản phẩm */}
        <Pressable
          onPress={() => router.push('/(seller)/(search)/manage-products')}
          style={({ pressed }) => [styles.quickActionCard, pressed && { opacity: 0.85 }]}
        >
          <LinearGradient
            colors={["#FFD1E3", "#FFF0F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickActionGradient}
          >
            <View style={styles.quickActionLeft}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="cube-outline" size={hp("2.8%") } color="#FF3B80" />
              </View>
              <View style={styles.quickActionText}>
                <Text style={styles.quickActionTitle}>Quản lý kho</Text>
                <Text style={styles.quickActionSubtitle}>Xem & chỉnh sửa sản phẩm</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={hp("2.4%") } color="#FF3B80" />
          </LinearGradient>
        </Pressable>

        {/* Step 1: Thông tin cơ bản */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Thông tin cơ bản</Text>
          </View>
          <View style={styles.stepContent}>
            {BASIC_FIELDS.map((item) => (
              <View key={item.id} style={styles.inputGroup}>
                <Text style={styles.label}>
                  {item.label} <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={item.placeholder}
                  placeholderTextColor="#94a3b8"
                  value={formData[item.id]}
                  onChangeText={(value) => handleInputChange(item.id, value)}
                  keyboardType={item.keyboardType || "default"}
                />
              </View>
            ))}
            
            {/* Category Lookup Table */}
            <View style={styles.categoryLookup}>
              <Pressable 
                onPress={() => setShowCategories(!showCategories)}
                style={styles.categoryToggle}
              >
                <Ionicons 
                  name={showCategories ? "chevron-down" : "chevron-forward"} 
                  size={hp("2%")} 
                  color="#0f766e" 
                />
                <Text style={styles.categoryToggleText}>
                  {showCategories ? "Ẩn danh sách danh mục" : "Xem danh sách danh mục"}
                </Text>
              </Pressable>
              
              {showCategories && (
                loadingCategories ? (
                  <ActivityIndicator size="small" color="#f7729a" style={{ marginTop: hp("2%") }} />
                ) : (
                  <ScrollView style={styles.categoryTableWrapper} nestedScrollEnabled={true}>
                    <View style={styles.categoryTableHeader}>
                      <Text style={[styles.categoryHeaderCell, { flex: 0.6 }]}>ID</Text>
                      <Text style={[styles.categoryHeaderCell, { flex: 2 }]}>Danh mục</Text>
                      <Text style={[styles.categoryHeaderCell, { flex: 0.8 }]}>Giới tính</Text>
                    </View>
                    {categories.map((cat, index) => (
                      <View key={cat.id} style={[styles.categoryRow, index % 2 === 0 && styles.categoryRowAlt]}>
                        <Text style={[styles.categoryCell, { flex: 0.6 }]}>{cat.id}</Text>
                        <Text style={[styles.categoryCell, { flex: 2 }]} numberOfLines={2}>{cat.displayName}</Text>
                        <Text style={[styles.categoryCell, { flex: 0.8 }]}>{cat.gender_type || '-'}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )
              )}
            </View>
          </View>
        </View>

        {/* Step 2: Hình ảnh sản phẩm */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Hình ảnh sản phẩm</Text>
          </View>
          <View style={styles.stepContent}>
            <Pressable
              onPress={pickImages}
              disabled={loading || images.length >= MAX_IMAGES}
              style={({ pressed }) => [
                styles.uploadArea,
                pressed && { opacity: 0.7 },
                images.length >= MAX_IMAGES && styles.uploadAreaDisabled
              ]}
            >
              <View style={styles.uploadIconWrapper}>
                <Ionicons name="cloud-upload-outline" size={hp("4%") } color="#FF3B80" />
              </View>
              <Text style={styles.uploadText}>
                {images.length >= MAX_IMAGES ? "Đã đạt giới hạn" : "Chọn ảnh sản phẩm"}
              </Text>
              <Text style={styles.uploadHint}>Tối đa {MAX_IMAGES} ảnh • {images.length}/{MAX_IMAGES}</Text>
            </Pressable>

            {images.length > 0 && (
              <View style={styles.imageGrid}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageCard}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <Pressable
                      onPress={() => removeImage(index)}
                      style={styles.imageRemoveBtn}
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
        </View>

        {/* Step 3: Mô tả chi tiết */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Mô tả chi tiết</Text>
          </View>
          <View style={styles.stepContent}>
            {DESCRIPTION_SECTIONS.map((item) => (
              <View key={item.id} style={styles.inputGroup}>
                <Text style={styles.label}>{item.label}</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder={item.placeholder}
                  placeholderTextColor="#94a3b8"
                  value={formData[item.id]}
                  onChangeText={(value) => handleInputChange(item.id, value)}
                  multiline={true}
                  numberOfLines={item.lines}
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Step 4: Biến thể sản phẩm */}
        <View style={styles.stepContainer}>
          <View style={styles.stepHeader}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <Text style={styles.stepTitle}>Biến thể sản phẩm</Text>
            <Pressable
              onPress={addVariant}
              disabled={variants.length >= MAX_VARIANTS}
              style={({ pressed }) => [
                styles.addVariantBtn,
                pressed && { opacity: 0.7 },
                variants.length >= MAX_VARIANTS && styles.addVariantBtnDisabled
              ]}
            >
              <Ionicons name="add-circle-outline" size={hp("2%")} color="#fff" />
              <Text style={styles.addVariantBtnText}>Thêm</Text>
            </Pressable>
          </View>
          
          <View style={styles.stepContent}>
            {variants.map((variant, index) => (
              <View key={variant.id} style={styles.variantCard}>
                <View style={styles.variantCardHeader}>
                  <View style={styles.variantBadge}>
                    <Text style={styles.variantBadgeText}>#{index + 1}</Text>
                  </View>
                  {variants.length > 1 && (
                    <Pressable
                      onPress={() => removeVariant(variant.id)}
                      style={({ pressed }) => [
                        styles.variantRemoveBtn,
                        pressed && { opacity: 0.6 }
                      ]}
                    >
                      <Ionicons name="trash-outline" size={hp("2%")} color="#ef4444" />
                    </Pressable>
                  )}
                </View>
                
                <View style={styles.variantFields}>
                  {VARIANT_FIELDS.map((field) => (
                    <View key={field.id} style={styles.variantInputGroup}>
                      <Text style={styles.variantLabel}>
                        {field.label} <Text style={styles.required}>*</Text>
                      </Text>
                      <TextInput
                        style={styles.variantInput}
                        placeholder={field.placeholder}
                        placeholderTextColor="#94a3b8"
                        value={variant[field.id]}
                        onChangeText={(value) => handleVariantChange(variant.id, field.id, value)}
                        keyboardType={field.keyboardType || "default"}
                        multiline={field.id === "dimensions"}
                        numberOfLines={field.id === "dimensions" ? 2 : 1}
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            onPress={handleCreateProduct}
            disabled={loading}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.85 },
              loading && styles.primaryButtonDisabled
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={hp("2.2%")} color="#fff" />
                <Text style={styles.primaryButtonText}>Đăng sản phẩm</Text>
              </>
            )}
          </Pressable>
          
          <Pressable
            onPress={handleSaveDraft}
            disabled={loading}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.7 }
            ]}
          >
            <Ionicons name="bookmark-outline" size={hp("2%")} color="#0f766e" />
            <Text style={styles.secondaryButtonText}>Lưu nháp</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingBottom: hp("3%"),
    backgroundColor: "#fff",
  },
  
  // Quick Action Card
  quickActionCard: {
    marginBottom: hp("2%"),
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp("3.5%"),
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: hp("2.1%"),
    fontWeight: '900',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  quickActionSubtitle: {
    fontSize: hp("1.6%"),
    color: '#4a4a4a',
    fontWeight: '600',
  },

  // Step Container
  stepContainer: {
    marginBottom: hp("2.4%"),
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: wp("4.5%"),
    shadowColor: '#FFB6C1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#FFE4E8',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp("1.8%"),
    paddingBottom: hp("1.2%"),
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(247,114,154,0.15)',
  },
  stepNumber: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: '#FF6B9D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp("3.5%"),
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  stepNumberText: {
    fontSize: hp("2.3%"),
    fontWeight: '900',
    color: '#fff',
  },
  stepTitle: {
    fontSize: hp("2.2%"),
    fontWeight: '900',
    color: '#1a1a1a',
    flex: 1,
  },
  stepContent: {
    gap: hp("1.5%"),
  },

  // Input Groups
  inputGroup: {
    marginBottom: hp("1.2%"),
  },
  label: {
    fontSize: hp("1.7%"),
    fontWeight: '800',
    color: '#FF6B9D',
    marginBottom: hp("0.7%"),
  },
  required: {
    color: '#ef4444',
    fontSize: hp("1.8%"),
  },
  textInput: {
    backgroundColor: '#FFF5F7',
    borderWidth: 1.5,
    borderColor: '#FFD6E0',
    borderRadius: 14,
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1.3%"),
    fontSize: hp("1.8%"),
    color: '#1a1a1a',
    fontWeight: '600',
  },
  textArea: {
    minHeight: hp("10%"),
    maxHeight: hp("18%"),
    textAlignVertical: 'top',
    paddingTop: hp("1.2%"),
  },

  // Category Lookup
  categoryLookup: {
    marginTop: hp("1%"),
  },
  categoryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp("1%"),
  },
  categoryToggleText: {
    fontSize: hp("1.7%"),
    color: '#0f766e',
    fontWeight: '700',
    marginLeft: wp("2%"),
  },
  categoryTableWrapper: {
    maxHeight: hp("28%"),
    marginTop: hp("1%"),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(154,214,223,0.3)',
    backgroundColor: '#fff',
  },
  categoryTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("1.3%"),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryHeaderCell: {
    fontSize: hp("1.6%"),
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryRowAlt: {
    backgroundColor: '#f8fafc',
  },
  categoryCell: {
    fontSize: hp("1.5%"),
    color: '#334155',
    textAlign: 'center',
    fontWeight: '600',
  },

  // Upload Area
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FF9FC4',
    borderRadius: 18,
    paddingVertical: hp("3.5%"),
    alignItems: 'center',
    backgroundColor: '#FFF0F7',
  },
  uploadAreaDisabled: {
    opacity: 0.5,
    borderColor: '#cbd5e1',
  },
  uploadIconWrapper: {
    width: wp("15%"),
    height: wp("15%"),
    borderRadius: wp("7.5%"),
    backgroundColor: '#FFD6E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp("1.2%"),
  },
  uploadText: {
    fontSize: hp("1.9%"),
    fontWeight: '800',
    color: '#0f172a',
    marginTop: hp("0.5%"),
  },
  uploadHint: {
    fontSize: hp("1.5%"),
    color: '#FF6B9D',
    marginTop: hp("0.4%"),
    fontWeight: '600',
  },

  // Image Grid
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp("3%"),
    marginTop: hp("1.5%"),
  },
  imageCard: {
    width: wp("27%"),
    height: wp("27%"),
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(154,214,223,0.3)',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    padding: 2,
  },
  imageIndexBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(255,107,157,0.95)',
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.4%"),
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  imageIndexText: {
    fontSize: hp("1.4%"),
    fontWeight: '800',
    color: '#fff',
  },

  // Variant Section
  addVariantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B9D',
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.8%"),
    borderRadius: 20,
    gap: wp("1.5%"),
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addVariantBtnDisabled: {
    opacity: 0.4,
  },
  addVariantBtnText: {
    fontSize: hp("1.6%"),
    fontWeight: '800',
    color: '#fff',
  },
  variantCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: wp("3.5%"),
    borderWidth: 1.5,
    borderColor: 'rgba(154,214,223,0.35)',
    marginTop: hp("1%"),
  },
  variantCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp("1.2%"),
    paddingBottom: hp("0.8%"),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(154,214,223,0.25)',
  },
  variantBadge: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.5%"),
    borderRadius: 10,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  variantBadgeText: {
    fontSize: hp("1.6%"),
    fontWeight: '900',
    color: '#fff',
  },
  variantRemoveBtn: {
    padding: hp("0.6%"),
  },
  variantFields: {
    gap: hp("1%"),
  },
  variantInputGroup: {
    marginBottom: hp("0.6%"),
  },
  variantLabel: {
    fontSize: hp("1.5%"),
    fontWeight: '700',
    color: '#475569',
    marginBottom: hp("0.4%"),
  },
  variantInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(154,214,223,0.35)',
    borderRadius: 10,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1%"),
    fontSize: hp("1.7%"),
    color: '#0f172a',
    fontWeight: '600',
  },

  // Action Buttons
  actionButtons: {
    gap: hp("1.2%"),
    marginTop: hp("1%"),
    marginBottom: hp("2%"),
  },
  primaryButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 18,
    paddingVertical: hp("2%"),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp("2%"),
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  primaryButtonText: {
    fontSize: hp("2.1%"),
    fontWeight: '900',
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#FFF5F7',
    borderWidth: 2,
    borderColor: '#FFB6D9',
    borderRadius: 18,
    paddingVertical: hp("1.8%"),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp("2%"),
  },
  secondaryButtonText: {
    fontSize: hp("1.9%"),
    fontWeight: '800',
    color: '#FF6B9D',
  },
});
