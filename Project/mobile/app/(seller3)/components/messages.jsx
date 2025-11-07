import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import SellerScreenLayout from "./SellerScreenLayout";

import {
  CONVERSATIONS,
  FILTERS,
} from "../data/homeSellerData";
import { styles } from "../styles/HomeSellerStyles";

export default function SellerMessages() {
  return (
    <SellerScreenLayout title="Tin nhắn" subtitle="Quản lý hội thoại với khách hàng">
      <View style={styles.filterRow}>
        {FILTERS.map((item) => (
          <Pressable key={item} style={({ pressed }) => [styles.filterChip, pressed && styles.filterChipPressed]}>
            <Text style={styles.filterChipText}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.highlightBanner}>
        <Ionicons name="chatbubbles-outline" size={hp("3%")} color="#BE123C" />
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerTitle}>Tin nhắn mới</Text>
          <Text style={styles.bannerSubtitle}>Luôn phản hồi nhanh để giữ chân khách hàng trung thành.</Text>
        </View>
      </LinearGradient>

      <View>
        {CONVERSATIONS.map((item) => (
          <LinearGradient
            key={item.id}
            colors={["#FFF1F3", "#FFE3E9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.conversationCard}
          >
            <View style={styles.avatar} />
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <View>
                  <Text style={styles.conversationName}>{item.name}</Text>
                  <Text style={styles.conversationUsername}>{item.username}</Text>
                </View>
                <Text style={styles.conversationTime}>{item.time}</Text>
              </View>
              <Text style={styles.conversationSnippet}>{item.snippet}</Text>
            </View>
            {item.unread > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            ) : null}
          </LinearGradient>
        ))}
      </View>
    </SellerScreenLayout>
  );
}