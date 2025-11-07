import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

import { SETTINGS_GROUPS } from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

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