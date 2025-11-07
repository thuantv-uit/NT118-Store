import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

import {
  ALERTS,
  REMINDERS,
} from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

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