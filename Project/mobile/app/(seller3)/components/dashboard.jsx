import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

import {
  HIGHLIGHTS,
  STAT_CARDS,
} from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

export default function SellerDashboard() {
  const router = useRouter();
  const navigateToOrders = () => router.push("/seller/orders");

  return (
    <SellerScreenLayout title="Bảng điều khiển" subtitle="Tổng quan hiệu suất">
      <View style={styles.statGrid}>
        {STAT_CARDS.map(({ id, iconType: Icon, icon, label, value }) => (
          <LinearGradient
            key={id}
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
        ))}
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