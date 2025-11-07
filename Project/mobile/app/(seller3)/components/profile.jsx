// profile.jsx (cập nhật)
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

import {
  ADDRESS_FIELDS,
  INFO_FIELDS,
} from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

export default function SellerProfile() {
  return (
    <SellerScreenLayout title="Hồ sơ cửa hàng" subtitle="Tuỳ chỉnh thông tin hiển thị với khách">
      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerCard}>
        <View style={styles.avatarLarge}>
          <Ionicons name="storefront-outline" size={hp("4%")} color="#BE123C" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.shopName}>Siny Shop</Text>
          <Text style={styles.shopSubtitle}>Chia sẻ câu chuyện thương hiệu của bạn với khách hàng.</Text>
          <Pressable style={({ pressed }) => [styles.updateBadge, pressed && styles.updateBadgePressed]}>
            <Ionicons name="pencil" size={hp("1.8%")} color="#BE123C" />
            <Text style={styles.updateBadgeText}>Đổi ảnh đại diện</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        {INFO_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputValue}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ & kho hàng</Text>
        {ADDRESS_FIELDS.map((item) => (
          <View key={item.id} style={styles.inputShell}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <Text style={styles.inputValue}>{item.placeholder}</Text>
          </View>
        ))}
      </View>

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.noteCard}>
        <Ionicons name="information-circle-outline" size={hp("2.4%")} color="#BE123C" />
        <Text style={styles.noteText}>
          Thông tin ở đây sẽ được hiển thị công khai trên trang cửa hàng. Đảm bảo dữ liệu luôn chính xác và cập nhật.
        </Text>
      </LinearGradient>

      <Pressable style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}>
        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
      </Pressable>
    </SellerScreenLayout>
  );
}