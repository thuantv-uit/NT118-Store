import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import SellerScreenLayout from "../components/SellerScreenLayout";

const ALERTS = [
  { id: "a1", type: "Đơn hàng", message: "Đơn hàng #SN-2301 đã được thanh toán thành công.", time: "2 phút trước" },
  { id: "a2", type: "Sản phẩm", message: "Ly gốm A08 đạt 15 người xem trong 10 phút gần đây.", time: "10 phút trước" },
  { id: "a3", type: "Marketing", message: "Thêm mã giảm giá lễ hội để tăng chuyển đổi cuối tuần.", time: "1 giờ trước" },
  { id: "a4", type: "Vận chuyển", message: "Đơn hàng #SN-2281 đang chờ xác nhận đơn vị vận chuyển.", time: "2 giờ trước" },
];

const REMINDERS = [
  "Đặt lịch livestream với sản phẩm mới.",
  "Kiểm tra tồn kho mặt hàng phổ biến.",
  "Thử nghiệm combo ưu đãi trong tuần này.",
];

export default function SellerNotifications() {
  return (
    <SellerScreenLayout title="Thông báo" subtitle="Theo dõi mọi cập nhật của cửa hàng">
      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summaryCard}>
        <Ionicons name="notifications-outline" size={hp("3%")} color="#BE123C" />
        <View style={styles.summaryTextWrap}>
          <Text style={styles.summaryTitle}>Bạn có 4 thông báo mới</Text>
          <Text style={styles.summarySubtitle}>Giữ phản hồi nhanh để khách hàng luôn hài lòng.</Text>
        </View>
      </LinearGradient>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Thông báo gần đây</Text>
        {ALERTS.map((item) => (
          <LinearGradient
            key={item.id}
            colors={["#FFF1F3", "#FFE3E9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.alertCard}
          >
            <View style={styles.alertIcon}>
              <Ionicons name="radio-button-on" size={hp("1.6%")} color="#EC4899" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertType}>{item.type}</Text>
              <Text style={styles.alertMessage}>{item.message}</Text>
              <Text style={styles.alertTime}>{item.time}</Text>
            </View>
          </LinearGradient>
        ))}
      </View>

      <LinearGradient colors={["#FFE9EC", "#FFE2F2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.reminderCard}>
        <Text style={styles.sectionTitle}>Gợi ý hôm nay</Text>
        {REMINDERS.map((item, index) => (
          <View key={item} style={[styles.reminderRow, index > 0 && styles.reminderDivider]}>
            <Ionicons name="sparkles" size={hp("2%")} color="#BE123C" />
            <Text style={styles.reminderText}>{item}</Text>
          </View>
        ))}
      </LinearGradient>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2.4%"),
  },
  summaryTextWrap: { marginLeft: wp("3%"), flex: 1 },
  summaryTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C" },
  summarySubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.4%") },
  listSection: { marginBottom: hp("2.6%") },
  sectionTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("1.2%") },
  alertCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 18,
    paddingVertical: hp("1.6%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("1.2%"),
  },
  alertIcon: { marginRight: wp("3%"), marginTop: hp("0.4%") },
  alertContent: { flex: 1 },
  alertType: { fontSize: hp("1.7%"), color: "#9F1239", fontWeight: "600", marginBottom: hp("0.4%") },
  alertMessage: { fontSize: hp("1.8%"), color: "#374151", lineHeight: hp("2.4%") },
  alertTime: { fontSize: hp("1.6%"), color: "#9CA3AF", marginTop: hp("0.6%") },
  reminderCard: { borderRadius: 20, paddingVertical: hp("2%"), paddingHorizontal: wp("4.5%") },
  reminderRow: { flexDirection: "row", alignItems: "center", paddingVertical: hp("0.6%") },
  reminderDivider: { borderTopWidth: 1, borderTopColor: "rgba(190,18,60,0.2)" },
  reminderText: { fontSize: hp("1.8%"), color: "#374151", marginLeft: wp("2.4%"), flex: 1 },
});
