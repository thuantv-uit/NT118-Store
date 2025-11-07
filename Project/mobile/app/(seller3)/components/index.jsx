import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

const ORDERS = [
  { id: "SN-2301", customer: "Courtney Henry", value: "420.000 đ", status: "Đã thanh toán", time: "2 phút trước" },
  { id: "SN-2298", customer: "Marvin McKinney", value: "725.000 đ", status: "Đang chuẩn bị", time: "15 phút trước" },
  { id: "SN-2294", customer: "Leslie Alexander", value: "199.000 đ", status: "Chờ vận chuyển", time: "30 phút trước" },
  { id: "SN-2288", customer: "Jenny Wilson", value: "1.020.000 đ", status: "Đang giao", time: "1 giờ trước" },
];

const FILTERS = ["Tất cả", "Chưa xử lý", "Đang giao", "Hoàn tất"];

export default function SellerOrders() {
  const router = useRouter();
  const goToOrder = (id) => () => router.push(`/seller/orders/${id}`);

  return (
    <SellerScreenLayout title="Đơn hàng" subtitle="Theo dõi và xử lý các đơn của bạn">
      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <Pressable key={item} style={({ pressed }) => [styles.filterChip, pressed && styles.filterChipPressed]}>
            <Text style={styles.filterText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons name="clipboard-list-outline" size={hp("3%")} color="#BE123C" />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>4 đơn cần theo dõi</Text>
          <Text style={styles.summarySubtitle}>Cập nhật trạng thái liên tục để đảm bảo trải nghiệm khách hàng.</Text>
        </View>
      </LinearGradient>

      <View>
        {ORDERS.map((order) => (
          <Pressable
            key={order.id}
            onPress={goToOrder(order.id)}
            style={({ pressed }) => [styles.orderCard, pressed && styles.orderCardPressed]}
            accessibilityRole="button"
            accessibilityLabel={`Xem chi tiết đơn ${order.id}`}
          >
            <LinearGradient
              colors={["#FFF1F3", "#FFE3E9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.orderCardInner}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>{order.id}</Text>
                <View style={styles.orderStatusPill}>
                  <Ionicons name="ellipse" size={hp("1%")} color="#FB7185" />
                  <Text style={styles.orderStatus}>{order.status}</Text>
                </View>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text style={styles.orderValue}>{order.value}</Text>
              </View>
              <View style={styles.orderFooter}>
                <Text style={styles.orderTime}>{order.time}</Text>
                <View style={styles.orderFooterRight}>
                  <Text style={styles.orderDetailHint}>Xem chi tiết</Text>
                  <Ionicons name="chevron-forward" size={hp("2%")} color="#BE123C" />
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </View>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", flexWrap: "wrap", marginBottom: hp("2.2%") },
  filterChip: {
    paddingHorizontal: wp("3.5%"),
    paddingVertical: hp("0.6%"),
    borderRadius: 999,
    backgroundColor: "rgba(204,120,97,0.12)",
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  filterChipPressed: { backgroundColor: "rgba(204,120,97,0.22)" },
  filterText: { fontSize: hp("1.7%"), color: "#7F1D1D", fontWeight: "600" },
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
  summaryText: { flex: 1 },
  summaryTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  summarySubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
  orderCard: { borderRadius: 20, marginBottom: hp("1.6%"), overflow: "hidden" },
  orderCardPressed: { opacity: 0.85 },
  orderCardInner: { borderRadius: 20, paddingVertical: hp("1.6%"), paddingHorizontal: wp("4%") },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: hp("0.8%") },
  orderId: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  orderStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.3%"),
    gap: wp("1.2%"),
  },
  orderStatus: { fontSize: hp("1.6%"), color: "#BE123C", fontWeight: "600" },
  orderInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: hp("0.6%") },
  orderCustomer: { fontSize: hp("1.8%"), color: "#374151" },
  orderValue: { fontSize: hp("1.8%"), color: "#B91C1C", fontWeight: "700" },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: hp("0.6%") },
  orderTime: { fontSize: hp("1.6%"), color: "#9CA3AF" },
  orderFooterRight: { flexDirection: "row", alignItems: "center" },
  orderDetailHint: { fontSize: hp("1.7%"), color: "#BE123C", fontWeight: "600", marginRight: wp("1%") },
});
