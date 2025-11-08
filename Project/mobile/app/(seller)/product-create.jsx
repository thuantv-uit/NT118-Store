import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { API_URL } from "../../constants/api";
import SellerScreenLayout from "./components/SellerScreenLayout";

const BASIC_FIELDS = [
  { id: "name", label: "Tên sản phẩm", placeholder: "Ví dụ: Ly gốm Artisan A08", value: "" },
  { id: "description", label: "Mô tả", placeholder: "Mô tả chi tiết sản phẩm", value: "" },
  { id: "category_id", label: "Danh mục (ID)", placeholder: "Nhập ID danh mục (số)", value: "", keyboardType: "numeric" },
  { id: "price", label: "Giá bán", placeholder: "Nhập giá bán (đ)", value: "", keyboardType: "numeric" },
];

const INVENTORY_FIELDS = [
  { id: "SKU", label: "Mã SKU", placeholder: "Nhập mã kho", value: "" },
  { id: "stock", label: "Tồn kho", placeholder: "Số lượng hiện có", value: "", keyboardType: "numeric" },
  { id: "warehouse", label: "Kho xuất hàng", placeholder: "Kho chính - TP.HCM", value: "" },
];

export default function SellerProductCreate({ navigation }) {
  const [formData, setFormData] = useState(
    [...BASIC_FIELDS, ...INVENTORY_FIELDS].reduce((acc, field) => {
      acc[field.id] = field.value;
      return acc;
    }, {})
  );
  const [loading, setLoading] = useState(false);

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const required = ["SKU", "name", "description", "price", "category_id", "stock"];
    for (let field of required) {
      if (!formData[field] || formData[field].trim() === "") {
        Alert.alert("Lỗi", `${BASIC_FIELDS.find(f => f.id === field)?.label || field} là bắt buộc!`);
        return false;
      }
    }
    if (parseFloat(formData.price) <= 0 || parseInt(formData.stock) < 0 || parseInt(formData.category_id) <= 0) {
      Alert.alert("Lỗi", "Giá phải > 0, tồn kho >= 0, category_id > 0!");
      return false;
    }
    return true;
  };

  const handleCreateProduct = async () => {
    if (!validateForm()) return;
    const baseURL = API_URL;

    setLoading(true);
    try {
      const payload = {
        SKU: formData.SKU,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        stock: parseInt(formData.stock),
      };

      const response = await fetch(`${baseURL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Sản phẩm đã được tạo!", [
          { text: "OK", onPress: () => navigation?.navigate("ProductList") },
        ]);
        setFormData({
          SKU: "",
          name: "",
          description: "",
          price: "",
          category_id: "",
          stock: "",
          warehouse: formData.warehouse,
        });
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
    console.log("Lưu nháp:", formData);
    Alert.alert("Nháp", "Đã lưu nháp!");
  };

  return (
    <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Hoàn tất thông tin để lên kệ">
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
          <Text style={styles.uploadTitle}>Thêm hình ảnh sản phẩm</Text>
          <Text style={styles.uploadSubtitle}>Ảnh sắc nét giúp tăng tỷ lệ chuyển đổi.</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.uploadButton,
            pressed && styles.uploadButtonPressed,
          ]}
        >
          <Text style={styles.uploadButtonText}>Tải lên</Text>
        </Pressable>
      </LinearGradient>

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
              multiline={item.id === "description"}
              numberOfLines={item.id === "description" ? 3 : 1}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kho & giá</Text>
        {INVENTORY_FIELDS.map((item) => (
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

      <LinearGradient
        colors={["#FFEAF1", "#FDE2E4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.shippingCard}
      >
        <MaterialCommunityIcons name="truck-delivery-outline" size={hp("3%")} color="#BE123C" />
        <View style={styles.shippingTexts}>
          <Text style={styles.shippingTitle}>Thiết lập vận chuyển</Text>
          <Text style={styles.shippingSubtitle}>
            Chọn đơn vị vận chuyển, thời gian xử lý và phí áp dụng.
          </Text>
        </View>
      </LinearGradient>

      <Pressable
        style={({ pressed }) => [
          styles.publishButton,
          pressed && styles.publishButtonPressed,
        ]}
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
        style={({ pressed }) => [
          styles.draftButton,
          pressed && styles.draftButtonPressed,
        ]}
        onPress={handleSaveDraft}
      >
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
  shippingSubtitle: {
    fontSize: hp("1.7%"),
    color: "#4B5563",
    marginTop: hp("0.2%"),
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