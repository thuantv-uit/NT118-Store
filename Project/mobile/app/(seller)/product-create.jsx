// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Pressable
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
// import SellerScreenLayout from "./components/SellerScreenLayout";

// import ProductMediaPicker from "@/components/patterns/seller/ProductMediaPicker";
// import ProductBasicInfo from "@/components/patterns/seller/ProductBasicInfo";
// import ProductAttributes from "@/components/patterns/seller/ProductAttributes";
// import ProductVariationManager from "@/components/patterns/seller/ProductVariationManager";
// import ProductPricingSection from "@/components/patterns/seller/ProductPricingSection";
// import ProductShippingSection from "@/components/patterns/seller/ProductShippingSection";
// import ProductAdditionalSettings from "@/components/patterns/seller/ProductAdditionalSettings";
// import ProductActionButtons from "@/components/patterns/seller/ProductActionButtons";
// const BASIC_FIELDS = [
//   { id: "productName", label: "Tên sản phẩm", placeholder: "Ví dụ: Ly gốm Artisan A08" },
//   { id: "category", label: "Danh mục", placeholder: "Đồ gốm / Bộ sưu tập xuân" },
//   { id: "price", label: "Giá bán", placeholder: "Nhập giá bán (đ)" },
// ];

// const INVENTORY_FIELDS = [
//   { id: "sku", label: "Mã SKU", placeholder: "Nhập mã kho" },
//   { id: "stock", label: "Tồn kho", placeholder: "Số lượng hiện có" },
//   { id: "warehouse", label: "Kho xuất hàng", placeholder: "Kho chính - TP.HCM" },
// ];

// export default function SellerProductCreate() {
//   const [form, setForm] = useState({
//     productName: "",
//     category: "",
//     price: "",
//   });
//   const handleChange = (id, value) => {
//     setForm((prev) => ({ ...prev, [id]: value }));
//   };

//   return (
//     <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Hoàn tất thông tin để lên kệ">
//       <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.uploadCard}>
//         <View style={styles.uploadIcon}>
//           <Ionicons name="cloud-upload-outline" size={hp("3%")} color="#BE123C" />
//         </View>
//         {/* <View style={styles.uploadTexts}>
//           <Text style={styles.uploadTitle}>Thêm hình ảnh sản phẩm</Text>
//           <Text style={styles.uploadSubtitle}>Ảnh sắc nét giúp tăng tỷ lệ chuyển đổi.</Text>
//         </View>
//         <Pressable style={({ pressed }) => [styles.uploadButton, pressed && styles.uploadButtonPressed]}>
//           <Text style={styles.uploadButtonText}>Tải lên</Text>
//         </Pressable> */}
//       </LinearGradient>

//       {/* <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
//         {BASIC_FIELDS.map((item) => (
//           <View key={item.id} style={styles.inputShell}>
//             <Text style={styles.inputLabel}>{item.label}</Text>
//             <TextInput
//               style={styles.inputField}
//               placeholder={item.placeholder}
//               value={form[item.id]}
//               onChangeText={(text) => handleChange(item.id, text)}
//               placeholderTextColor="#9CA3AF"
//             />
//           </View>
//         ))}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Kho & giá</Text>
//         {INVENTORY_FIELDS.map((item) => (
//           <View key={item.id} style={styles.inputShell}>
//             <Text style={styles.inputLabel}>{item.label}</Text>
//             <TextInput
//               style={styles.inputField}
//               placeholder={item.placeholder}
//               value={form[item.id]}
//               onChangeText={(text) => handleChange(item.id, text)}
//               placeholderTextColor="#9CA3AF"
//             />
//             12</View>
//         ))}
//       </View>

//       <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shippingCard}>
//         <MaterialCommunityIcons name="truck-delivery-outline" size={hp("3%")} color="#BE123C" />
//         <View style={styles.shippingTexts}>
//           <Text style={styles.shippingTitle}>Thiết lập vận chuyển</Text>
//           <Text style={styles.shippingSubtitle}>Chọn đơn vị vận chuyển, thời gian xử lý và phí áp dụng.</Text>
//         </View>
//       </LinearGradient> */}
//       <ProductMediaPicker />

//       {/* 2️⃣ Thông tin cơ bản */}
//       <ProductBasicInfo />

//       {/* 3️⃣ Thuộc tính sản phẩm */}
//       <ProductAttributes />

//       {/* 4️⃣ Phân loại hàng */}
//       <ProductVariationManager />

//       {/* 5️⃣ Giá & kho */}
//       <ProductPricingSection />

//       <Pressable style={({ pressed }) => [styles.publishButton, pressed && styles.publishButtonPressed]}>
//         <Text style={styles.publishButtonText}>Đăng sản phẩm</Text>
//       </Pressable>
//       <Pressable style={({ pressed }) => [styles.draftButton, pressed && styles.draftButtonPressed]}>
//         <Text style={styles.draftButtonText}>Lưu nháp</Text>
//       </Pressable>
//     </SellerScreenLayout>
//   );
// }

// const styles = StyleSheet.create({
//   uploadCard: {
//     borderRadius: 22,
//     paddingVertical: hp("1.8%"),
//     paddingHorizontal: wp("4%"),
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: hp("2.4%"),
//   },
//   uploadIcon: {
//     width: wp("12%"),
//     height: wp("12%"),
//     borderRadius: wp("6%"),
//     backgroundColor: "rgba(255,255,255,0.7)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: wp("3%"),
//   },
//   uploadTexts: { flex: 1 },
//   uploadTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
//   uploadSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
//   uploadButton: {
//     backgroundColor: "#FFF",
//     paddingHorizontal: wp("4%"),
//     paddingVertical: hp("0.8%"),
//     borderRadius: 999,
//   },
//   uploadButtonPressed: { backgroundColor: "rgba(255,255,255,0.75)" },
//   uploadButtonText: { fontSize: hp("1.7%"), color: "#BE123C", fontWeight: "700" },
//   section: { marginBottom: hp("2.6%") },
//   sectionTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("1.2%") },
//   inputShell: {
//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     paddingVertical: hp("1.2%"),
//     paddingHorizontal: wp("4%"),
//     marginBottom: hp("1%"),
//     borderWidth: 1,
//     borderColor: "rgba(204,120,97,0.2)",
//   },
//   inputLabel: { fontSize: hp("1.6%"), color: "#9F1239", fontWeight: "600", marginBottom: hp("0.4%") },
//   inputField: {
//     fontSize: hp("1.8%"),
//     color: "#1F2937",
//     paddingVertical: hp("0.6%"),
//   },

//   inputPlaceholder: { fontSize: hp("1.8%"), color: "#9CA3AF" },
//   shippingCard: {
//     borderRadius: 20,
//     paddingVertical: hp("1.8%"),
//     paddingHorizontal: wp("4%"),
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: hp("2.6%"),
//   },
//   shippingTexts: { marginLeft: wp("3%"), flex: 1 },
//   shippingTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
//   shippingSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
//   publishButton: {
//     backgroundColor: "#CC7861",
//     borderRadius: 18,
//     paddingVertical: hp("1.6%"),
//     alignItems: "center",
//     marginBottom: hp("1%"),
//   },
//   publishButtonPressed: { backgroundColor: "#B35E48" },
//   publishButtonText: { color: "#FFF", fontSize: hp("2%"), fontWeight: "700" },
//   draftButton: {
//     borderRadius: 18,
//     paddingVertical: hp("1.4%"),
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(204,120,97,0.4)",
//     marginBottom: hp("1%"),
//   },
//   draftButtonPressed: { backgroundColor: "rgba(204,120,97,0.1)" },
//   draftButtonText: { color: "#CC7861", fontSize: hp("1.9%"), fontWeight: "700" },
// });
// NT118-Store/Project/mobile/app/(seller)/sellerCreateProduct.jsx
import React, { useState } from "react";
import { Alert, ScrollView, View, Text,Pressable} from "react-native";
import SellerScreenLayout from "@/components/layout/SellerScreenLayout";
import { useLocalSearchParams } from "expo-router";

// import dùng trong mọi file
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { wpA, hpA } from "@/utils/scale";

import ProductMediaPicker from "@/components/patterns/seller/ProductMediaPicker";
import ProductBasicInfo from "@/components/patterns/seller/ProductBasicInfo";
import ProductAttributes from "@/components/patterns/seller/ProductAttributes";
import ProductVariationManager from "@/components/patterns/seller/ProductVariationManager";
import ProductPricingSection from "@/components/patterns/seller/ProductPricingSection";
import ProductShippingSection from "@/components/patterns/seller/ProductShippingSection";
import ProductAdditionalSettings from "@/components/patterns/seller/ProductAdditionalSettings";
import ProductActionButtons from "@/components/patterns/seller/ProductActionButtons";
import { useRouter } from "expo-router";


export default function SellerCreateProduct() {
    const { selectedCategory, selectedCategoryId } = useLocalSearchParams();
  const router = useRouter();

  // Gom dữ liệu form tổng
  const [productData, setProductData] = useState({
    name: "",
    category: selectedCategory || "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    dimensions: "",
    variations: [],
    attributes: [],
    images: [],
    shipping: {
      method: "",
      cost: "",
      time: "",
    },
  });
  const [loading, setLoading] = useState(false);

  // cập nhật dữ liệu con
  const updateField = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  // If user selected a category via the separate screen, update the form
  React.useEffect(() => {
    if (selectedCategory) {
      updateField("category", selectedCategory);
    }
    if (selectedCategoryId) {
      updateField("category_id", selectedCategoryId);
    }
  }, [selectedCategory, selectedCategoryId]);
  // xử lý chọn danh mục
  const handleSelectCategory = (cat) => {
    updateField("category", cat.name);
    updateField("category_id", cat.id);
  };

  // gửi dữ liệu lên backend
  const handleSubmit = async () => {
    if (!productData.name || !productData.price) {
      Alert.alert("Thiếu thông tin", "Tên và giá sản phẩm là bắt buộc.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.173:5001/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SKU: productData.sku,
          name: productData.name,
          description: productData.description || "Sản phẩm mới",
          price: Number(productData.price),
          category_id: Number(productData.category_id),
          stock: Number(productData.stock || 0),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Không thể thêm sản phẩm.");

      Alert.alert("Thành công", "Sản phẩm đã được tạo!");
      setProductData({
        name: "",
        category_id: 1,
        sku: "",
        description: "",
        price: "",
        stock: "",
        weight: "",
        dimensions: "",
        variations: [],
        attributes: [],
        images: [],
        shipping: { method: "", cost: "", time: "" },
      });
    } catch (err) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Điền thông tin chi tiết để đăng bán">
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: hpA(20) }}>
        <ProductMediaPicker
          images={productData.images}
          onChange={(imgs) => updateField("images", imgs)}
        />
        <ProductBasicInfo
          name={productData.name}
          description={productData.description}
          brand={productData.brand}
          category={productData.category}
          onChange={updateField}
          // onSelectCategory={(catName) => updateField("category", catName)}
        />
        {/* Chọn danh mục */}
        <View style={{ marginVertical: hpA(12) }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.hmee04, marginBottom: hpA(8) }}>
            Danh mục sản phẩm *
          </Text>
          <Pressable
            style={{ paddingVertical: 12, paddingHorizontal: 10, backgroundColor: "#fff", borderRadius: 8 }}
            onPress={() => router.push('/select-category')}
          >
            <Text>{productData.category || "Chọn danh mục"}</Text>
          </Pressable>
          {productData.category ? (
            <Text style={{ color: colors.hmee03, marginTop: hpA(4) }}>
              Đã chọn: {productData.category}
            </Text>
          ) : null}
        </View>
        <ProductPricingSection
          price={productData.price}
          stock={productData.stock}
          onChange={updateField}
        />
        <ProductVariationManager
          variations={productData.variations}
          onChange={(v) => updateField("variations", v)}
        />
        <ProductAttributes
          attributes={productData.attributes}
          onChange={(attrs) => updateField("attributes", attrs)}
        />
        <ProductShippingSection
          shipping={productData.shipping}
          onChange={(ship) => updateField("shipping", ship)}
        />
        <ProductAdditionalSettings
          weight={productData.weight}
          dimensions={productData.dimensions}
          onChange={updateField}
        />
        <View style={{ height: hpA(16) }} />
        <ProductActionButtons onSubmit={handleSubmit} loading={loading} />
      </ScrollView>
    </SellerScreenLayout>
  );
}

