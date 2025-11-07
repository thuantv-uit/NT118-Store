import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

import {
  BASIC_FIELDS,
  INVENTORY_FIELDS,
} from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

export default function SellerProductCreate() {
  return (
    <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Hoàn tất thông tin để lên kệ">
      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.uploadCard}>
        <View style={styles.uploadIcon}>
          <Ionicons name="cloud-upload-outline" size={hp("3%")} color="#BE123C" />
        </View>
        <View style={styles.uploadTexts}>
          <Text style={styles.uploadTitle}>Thêm hình ảnh sản phẩm</Text>
          <Text style={styles.uploadSubtitle}>Ảnh sắc nét giúp tăng tỷ lệ chuyển đổi.</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.uploadButton, pressed && styles.uploadButtonPressed]}>
          <Text style={styles.uploadButtonText}>Tải lên</Text>
        </Pressable>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        {BASIC_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputPlaceholder}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kho & giá</Text>
        {INVENTORY_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputPlaceholder}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.shippingCard}>
        <MaterialCommunityIcons name="truck-delivery-outline" size={hp("3%")} color="#BE123C" />
        <View style={styles.shippingTexts}>
          <Text style={styles.shippingTitle}>Thiết lập vận chuyển</Text>
          <Text style={styles.shippingSubtitle}>Chọn đơn vị vận chuyển, thời gian xử lý và phí áp dụng.</Text>
        </View>
      </LinearGradient>

      <Pressable style={({ pressed }) => [styles.publishButton, pressed && styles.publishButtonPressed]}>
        <Text style={styles.publishButtonText}>Đăng sản phẩm</Text>
      </Pressable>
      <Pressable style={({ pressed }) => [styles.draftButton, pressed && styles.draftButtonPressed]}>
        <Text style={styles.draftButtonText}>Lưu nháp</Text>
      </Pressable>
    </SellerScreenLayout>
  );
}