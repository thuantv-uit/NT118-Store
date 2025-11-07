import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

const SETTINGS_GROUPS = [
  {
    id: "notifications",
    title: "Thông báo",
    items: [
      { id: "order", label: "Thông báo đơn hàng mới", description: "Nhận thông báo khi có đơn đặt hàng mới." },
      { id: "promotion", label: "Chiến dịch khuyến mãi", description: "Cập nhật gợi ý khuyến mãi và sự kiện quan trọng." },
    ],
  },
  {
    id: "store",
    title: "Cửa hàng",
    items: [
      { id: "maintenance", label: "Chế độ nghỉ", description: "Tạm ẩn cửa hàng khi bạn không thể xử lý đơn." },
      { id: "autoReply", label: "Trả lời tự động", description: "Thiết lập tin nhắn phản hồi nhanh cho khách hàng." },
    ],
  },
];

export default function SellerSettings() {
  return (
    <SellerScreenLayout title="Cài đặt" subtitle="Điều chỉnh hoạt động cửa hàng">
      {SETTINGS_GROUPS.map((group) => (
        <LinearGradient
          key={group.id}
          colors={["#FFE5EA", "#FAD4D6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.groupCard}
        >
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.items.map((item, index) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.settingRow,
                index > 0 && styles.settingDivider,
                pressed && styles.settingRowPressed,
              ]}
            >
              <View style={styles.settingTextWrap}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
              <View style={styles.toggleMock}>
                <View style={styles.toggleDot} />
              </View>
            </Pressable>
          ))}
        </LinearGradient>
      ))}

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.supportCard}>
        <Ionicons name="help-circle-outline" size={hp("2.6%")} color="#BE123C" />
        <View style={styles.supportTextWrap}>
          <Text style={styles.supportTitle}>Cần hỗ trợ?</Text>
          <Text style={styles.supportSubtitle}>Liên hệ đội ngũ CSKH để được tư vấn và cấu hình nâng cao.</Text>
        </View>
      </LinearGradient>
    </SellerScreenLayout>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    marginBottom: hp("2%"),
  },
  groupTitle: { fontSize: hp("2.1%"), fontWeight: "700", color: "#BE123C", marginBottom: hp("1.2%") },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: hp("1%") },
  settingDivider: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.6)" },
  settingRowPressed: { opacity: 0.7 },
  settingTextWrap: { flex: 1, paddingRight: wp("3%") },
  settingLabel: { fontSize: hp("1.9%"), fontWeight: "700", color: "#7F1D1D" },
  settingDescription: { fontSize: hp("1.6%"), color: "#4B5563", marginTop: hp("0.2%") },
  toggleMock: {
    width: wp("12%"),
    height: hp("3%"),
    borderRadius: hp("1.5%"),
    backgroundColor: "rgba(255,255,255,0.75)",
    justifyContent: "center",
    padding: hp("0.3%"),
  },
  toggleDot: {
    width: hp("2.2%"),
    height: hp("2.2%"),
    borderRadius: hp("1.1%"),
    backgroundColor: "#CC7861",
    alignSelf: "flex-end",
  },
  supportCard: {
    borderRadius: 20,
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("4%"),
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  supportTextWrap: { marginLeft: wp("3%"), flex: 1 },
  supportTitle: { fontSize: hp("2%"), fontWeight: "700", color: "#BE123C" },
  supportSubtitle: { fontSize: hp("1.7%"), color: "#4B5563", marginTop: hp("0.4%") },
});
