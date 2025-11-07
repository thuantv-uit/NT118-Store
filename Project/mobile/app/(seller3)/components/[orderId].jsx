import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

const STATUS_STEPS = [
  { id: "created", label: "Đơn hàng tạo", time: "08:30 • 05/03", description: "Khách hàng đã đặt đơn thành công." },
  { id: "paid", label: "Đã thanh toán", time: "08:32 • 05/03", description: "Thanh toán online hoàn tất." },
  { id: "packing", label: "Đang chuẩn bị", time: "09:10 • 05/03", description: "Kho đang đóng gói sản phẩm." },
  { id: "shipping", label: "Đang giao", time: "11:20 • 05/03", description: "Đơn vị vận chuyển đã tiếp nhận bưu kiện." },
];

export default function SellerOrderDetail() {
  const { orderId } = useLocalSearchParams();

  return (
    <SellerScreenLayout title={`Đơn hàng ${orderId ?? ""}`} subtitle="Theo dõi trạng thái chi tiết">
      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={hp("3.2%")} color="#BE123C" />
        </View>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryTitle}>Trạng thái hiện tại: Đang giao</Text>
          <Text style={styles.summarySubtitle}>Dự kiến giao: 07/03 • Đơn vị GHN Express</Text>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Khách hàng</Text>
          <Text style={styles.detailValue}>Courtney Henry</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Số điện thoại</Text>
          <Text style={styles.detailValue}>0123 456 789</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Địa chỉ giao</Text>
          <Text style={styles.detailValue}>123 Nguyễn Trãi, Q.1, TP.HCM</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Giá trị đơn</Text>
          <Text style={styles.detailValueHighlight}>420.000 đ</Text>
        </View>
      </View>

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Tiến trình xử lý</Text>
        {STATUS_STEPS.map((step, index) => {
          const isLast = index === STATUS_STEPS.length - 1;
          return (
            <View key={step.id} style={styles.timelineRow}>
              <View style={styles.timelineCol}>
                <View style={styles.timelineDot} />
                {!isLast ? <View style={styles.timelineLine} /> : null}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineLabel}>{step.label}</Text>
                  <Text style={styles.timelineTime}>{step.time}</Text>
                </View>
                <Text style={styles.timelineDescription}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </LinearGradient>

      <LinearGradient colors={["#FFF1F3", "#FFE3E9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.actionCard}>
        <Ionicons name="chatbubble-ellipses-outline" size={hp("2.6%")} color="#BE123C" />
        <View style={styles.actionText}>
          <Text style={styles.actionTitle}>Trợ giúp khách hàng</Text>
          <Text style={styles.actionSubtitle}>Liên hệ hỗ trợ ngay nếu đơn phát sinh vấn đề.</Text>
        </View>
        <Ionicons name="chevron-forward" size={hp("2.4%")} color="#BE123C" />
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
  summaryIcon: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("5.5%"),
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  summaryContent: { flex: 1 },
  summaryTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  summarySubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
  section: { marginBottom: hp("2.4%") },
  sectionTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("1%") },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: hp("0.5%") },
  detailLabel: { fontSize: hp("1.7%"), color: "#6B7280" },
  detailValue: { fontSize: hp("1.8%"), color: "#374151", fontWeight: "600" },
  detailValueHighlight: { fontSize: hp("1.9%"), color: "#B91C1C", fontWeight: "700" },
  timelineCard: { borderRadius: 20, paddingVertical: hp("1.8%"), paddingHorizontal: wp("4%"), marginBottom: hp("2.4%") },
  timelineRow: { flexDirection: "row", marginBottom: hp("1.2%") },
  timelineCol: { width: wp("8%"), alignItems: "center" },
  timelineDot: { width: wp("3%"), height: wp("3%"), borderRadius: wp("1.5%"), backgroundColor: "#EC4899" },
  timelineLine: { width: 2, flex: 1, backgroundColor: "rgba(236,72,153,0.4)", marginTop: hp("0.4%") },
  timelineContent: { flex: 1 },
  timelineHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  timelineLabel: { fontSize: hp("1.9%"), fontWeight: "700", color: "#7F1D1D" },
  timelineTime: { fontSize: hp("1.6%"), color: "#9CA3AF" },
  timelineDescription: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.4%") },
  actionCard: {
    borderRadius: 20,
    paddingVertical: hp("1.6%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  actionText: { flex: 1 },
  actionTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  actionSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
});