import { useUser } from "@clerk/clerk-expo";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { API_URL } from "../../../constants/api";
import SellerScreenLayout from "../components/SellerScreenLayout";

const HIGHLIGHTS = [
  { id: "hot", title: "Sản phẩm bán chạy", description: "Ly gốm A08 tăng trưởng 34% so với tuần trước." },
  { id: "campaign", title: "Chiến dịch sắp diễn ra", description: "Flash sale cuối tuần giúp tăng tỷ lệ chuyển đổi." },
];
const API_BASE_URL = API_URL;

export default function SellerDashboard() {
  const router = useRouter();
  const { user } = useUser(); // Lấy user từ Clerk
  const [stats, setStats] = useState({
    revenue: "0 đ",
    orders: "0",
    conversion: "0%", // Giữ nguyên hardcoded nếu chưa có API
    visits: "0", // Giữ nguyên hardcoded nếu chưa có API
  });
  const [loading, setLoading] = useState(true); // State cho loading
  const [error, setError] = useState(null); // State cho error

  const navigateToOrders = () => router.push("(seller)/(orders)");

  // Hàm format số tiền (thêm dấu chấm phân cách)
  const formatCurrency = (amount) => {
    if (!amount) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount).replace("₫", " đ");
  };

  useEffect(() => {
    const fetchOrderSummary = async () => {
      if (!user?.id) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch summary cho revenue và totalOrders (giữ nguyên)
        const summaryResponse = await fetch(`${API_BASE_URL}/order_status/summary/seller/${user.id}`);
        if (!summaryResponse.ok) {
          throw new Error(`Lỗi API summary: ${summaryResponse.status}`);
        }
        const summaryData = await summaryResponse.json();

        // MỚI THÊM: Fetch pending orders để lấy count cho "Đơn hàng mới"
        const pendingResponse = await fetch(`${API_BASE_URL}/order_status/seller/${user.id}/pending`);
        if (!pendingResponse.ok) {
          throw new Error(`Lỗi API pending: ${pendingResponse.status}`);
        }
        const pendingData = await pendingResponse.json();
        const pendingCount = pendingData.length || 0;

        setStats((prev) => ({
          ...prev,
          revenue: formatCurrency(summaryData.totalAmount),
          orders: pendingCount.toString(), // Sử dụng pending count cho "Đơn hàng mới"
        }));
      } catch (err) {
        console.error("Lỗi fetch order summary:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSummary();
  }, [user?.id]);

  // Render loading spinner nếu đang load
  if (loading) {
    return (
      <SellerScreenLayout title="Bảng điều khiển" subtitle="Tổng quan hiệu suất">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#BE123C" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      </SellerScreenLayout>
    );
  }

  // Render error nếu có lỗi
  if (error) {
    return (
      <SellerScreenLayout title="Bảng điều khiển" subtitle="Tổng quan hiệu suất">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lỗi: {error}</Text>
          <Pressable onPress={() => window.location.reload()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </Pressable>
        </View>
      </SellerScreenLayout>
    );
  }

  return (
    <SellerScreenLayout title="Bảng điều khiển" subtitle="Tổng quan hiệu suất">
      <View style={styles.statGrid}>
        {Object.entries(stats).map(([id, value]) => {
          let Icon, icon, label;
          switch (id) {
            case "revenue":
              Icon = MaterialCommunityIcons;
              icon = "cash-multiple";
              label = "Doanh thu";
              break;
            case "orders":
              Icon = Ionicons;
              icon = "cart-outline";
              label = "Đơn hàng mới";
              break;
            case "conversion":
              Icon = MaterialCommunityIcons;
              icon = "chart-line-stacked";
              label = "Tỉ lệ chuyển đổi";
              break;
            case "visits":
              Icon = Ionicons;
              icon = "people-outline";
              label = "Lượt truy cập";
              break;
            default:
              return null;
          }

          const isOrdersCard = id === "orders";
          return (
            <Pressable
              key={id}
              onPress={isOrdersCard ? navigateToOrders : undefined}
              style={({ pressed }) => [styles.statCardPressable, pressed && styles.statCardPressed]}
              accessibilityRole={isOrdersCard ? "button" : undefined}
              accessibilityLabel={isOrdersCard ? "Xem đơn hàng mới" : undefined}
            >
              <LinearGradient
                colors={["#FFE5EA", "#FAD4D6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statCard}
              >
                <View style={styles.statIconWrap}>
                  <Icon name={icon} size={hp("2.6%")} color="#BE123C" />
                </View>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      <LinearGradient colors={["#FFE9EC", "#FFE2F2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Hiệu suất bán hàng</Text>
          <Text style={styles.chartPeriod}>7 ngày gần nhất</Text>
        </View>
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartBarLarge} />
          <View style={styles.chartBarSmall} />
          <View style={styles.chartBarMedium} />
          <View style={styles.chartBarLarge} />
          <View style={styles.chartBarSmall} />
          <View style={styles.chartBarMedium} />
          <View style={styles.chartBarLarge} />
        </View>
        <Text style={styles.chartHint}>Biểu đồ sẽ cập nhật dữ liệu bán hàng thực tế của bạn.</Text>
      </LinearGradient>

      <View style={styles.highlights}>
        {HIGHLIGHTS.map((item) => (
          <LinearGradient
            key={item.id}
            colors={["#FDE2E4", "#F8BBD0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.highlightCard}
          >
            <Text style={styles.highlightTitle}>{item.title}</Text>
            <Text style={styles.highlightDescription}>{item.description}</Text>
          </LinearGradient>
        ))}
      </View>

      <Pressable
        onPress={navigateToOrders}
        style={({ pressed }) => [styles.ordersButton, pressed && styles.ordersButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel="Đi đến quản lý đơn hàng"
      >
        <LinearGradient
          colors={["#FFE5EA", "#FAD4D6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ordersButtonInner}
        >
          <View style={styles.ordersButtonIcon}>
            <Ionicons name="receipt-outline" size={hp("2.6%")} color="#BE123C" />
          </View>
          <View style={styles.ordersButtonTextWrap}>
            <Text style={styles.ordersButtonTitle}>Quản lý tất cả đơn hàng</Text>
            <Text style={styles.ordersButtonSubtitle}>Theo dõi trạng thái và xử lý từng đơn nhanh chóng.</Text>
          </View>
          <Ionicons name="chevron-forward" size={hp("2.4%")} color="#BE123C" />
        </LinearGradient>
      </Pressable>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: hp("2.5%"),
  },
  statCardPressable: {
    width: "48%",
    marginBottom: hp("1.8%"),
  },
  statCardPressed: {
    opacity: 0.85,
  },
  statCard: {
    borderRadius: 18,
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
  },
  statIconWrap: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  statLabel: { fontSize: hp("1.7%"), color: "#7F1D1D", fontWeight: "600" },
  statValue: { fontSize: hp("2.2%"), color: "#581C1C", fontWeight: "700", marginTop: hp("0.4%") },
  chartCard: {
    borderRadius: 20,
    paddingVertical: hp("2.4%"),
    paddingHorizontal: wp("5%"),
    marginBottom: hp("2.5%"),
  },
  chartHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  chartTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C" },
  chartPeriod: { fontSize: hp("1.7%"), color: "#9F1239", fontWeight: "600" },
  chartPlaceholder: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: hp("16%"),
    marginTop: hp("2%"),
    marginBottom: hp("1.4%"),
  },
  chartBarLarge: { width: "12%", height: "100%", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.85)" },
  chartBarMedium: { width: "12%", height: "70%", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.7)" },
  chartBarSmall: { width: "12%", height: "45%", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.55)" },
  chartHint: { fontSize: hp("1.6%"), color: "#6B7280" },
  highlights: { marginBottom: hp("1%") },
  highlightCard: {
    borderRadius: 18,
    paddingVertical: hp("2.2%"),
    paddingHorizontal: wp("4.5%"),
    marginBottom: hp("1.6%"),
  },
  highlightTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("0.8%") },
  highlightDescription: { fontSize: hp("1.7%"), color: "#4B5563", lineHeight: hp("2.4%") },
  ordersButton: { borderRadius: 22, overflow: "hidden" },
  ordersButtonPressed: { opacity: 0.85 },
  ordersButtonInner: {
    borderRadius: 22,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
  },
  ordersButtonIcon: {
    width: wp("11%"),
    height: wp("11%"),
    borderRadius: wp("5.5%"),
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp("3%"),
  },
  ordersButtonTextWrap: { flex: 1 },
  ordersButtonTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#7F1D1D" },
  ordersButtonSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.2%") },
  // Styles mới cho loading và error
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: hp("1%"),
    fontSize: hp("1.8%"),
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("10%"),
  },
  errorText: {
    fontSize: hp("1.8%"),
    color: "#EF4444",
    textAlign: "center",
    marginBottom: hp("2%"),
  },
  retryButton: {
    backgroundColor: "#BE123C",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 10,
  },
  retryButtonText: {
    color: "white",
    fontSize: hp("1.7%"),
    fontWeight: "600",
  },
});