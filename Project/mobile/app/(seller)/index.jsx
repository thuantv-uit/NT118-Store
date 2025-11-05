import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const FLASH_IMAGES = [
  require("../../assets/images/home_seller/flash_sale/Flast sale.png"),
  require("../../assets/images/home_seller/flash_sale/fl2.png"),
  require("../../assets/images/home_seller/flash_sale/fl3.png"),
];

const BANNER_WIDTH = Dimensions.get("window").width * 0.92;

const MESSAGES = [
  {
    id: "1",
    name: "Marvin McKinney",
    username: "@theresa",
    date: "Mar 5",
    message: "Khách yêu cầu xác nhận lịch giao hàng vào cuối tuần.",
  },
  {
    id: "2",
    name: "Courtney Henry",
    username: "@courtney",
    date: "Mar 5",
    message: "Sản phẩm mới nhận được đánh giá 5⭐. Tuyệt vời!",
  },
];

const NOTIFICATIONS = [
  { id: "n1", title: "Đơn hàng #SN-2301 đã thanh toán", time: "2 phút trước" },
  { id: "n2", title: "Ly gốm A08 đang có 15 người xem", time: "10 phút trước" },
  { id: "n3", title: "Thêm voucher lễ hội để tăng chuyển đổi", time: "1 giờ trước" },
];

/* ===== Header ===== */
const Header = ({
  onShopPress,
  onSearchPress,
  onNotificationsPress,
  onMessagesPress,
  onSettingsPress,
}) => {
  return (
    <View style={sx.headerContainer}>
      <View style={sx.header}>
        <View>
          <Text style={sx.headerGreeting}>Xin chào,</Text>
          <Pressable
            onPress={onShopPress}
            style={({ pressed }) => [sx.shopNamePressable, pressed && sx.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Đi đến hồ sơ cửa hàng"
          >
            <Text style={sx.headerTitle}>Siny Shop!</Text>
          </Pressable>
        </View>
        <View style={sx.headerRight}>
          <Pressable
            onPress={onSearchPress}
            style={({ pressed }) => [sx.headerIconButton, pressed && sx.pressedIcon]}
            accessibilityRole="button"
            accessibilityLabel="Tìm kiếm"
          >
            <Ionicons name="search" size={hp("3%")} color="#FFF5F2" />
          </Pressable>
          <Pressable
            onPress={onNotificationsPress}
            style={({ pressed }) => [sx.headerIconButton, pressed && sx.pressedIcon]}
            accessibilityRole="button"
            accessibilityLabel="Thông báo"
          >
            <Ionicons name="notifications-outline" size={hp("3%")} color="#FFF5F2" />
          </Pressable>
          <Pressable
            onPress={onMessagesPress}
            style={({ pressed }) => [sx.headerIconButton, pressed && sx.pressedIcon]}
            accessibilityRole="button"
            accessibilityLabel="Tin nhắn"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={hp("3%")} color="#FFF5F2" />
          </Pressable>
          <Pressable
            onPress={onSettingsPress}
            style={({ pressed }) => [sx.headerIconButton, pressed && sx.pressedIcon]}
            accessibilityRole="button"
            accessibilityLabel="Cài đặt"
          >
            <Ionicons name="settings-outline" size={hp("3%")} color="#FFF5F2" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

/* ===== Flash sale ===== */
const FlashSaleBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleMomentumScrollEnd = (event) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const index = Math.round(contentOffset.x / layoutMeasurement.width);
    setActiveSlide(index);
  };

  return (
    <View style={sx.sectionPad}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={sx.flashCarouselContent}
        style={[sx.flashCarousel, { width: BANNER_WIDTH }]}
      >
        {FLASH_IMAGES.map((imageSource, index) => (
          <Image
            key={index.toString()}
            source={imageSource}
            style={[
              sx.flashImage,
              { width: BANNER_WIDTH },
              index === FLASH_IMAGES.length - 1 && { marginRight: 0 },
            ]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={sx.flashDots}>
        {FLASH_IMAGES.map((_, index) => (
          <View
            key={index.toString()}
            style={[sx.flashDot, activeSlide === index ? sx.flashDotActive : sx.flashDotInactive]}
          />
        ))}
      </View>
    </View>
  );
};

/* ===== Revenue ===== */
const RevenueOverview = ({ onPress }) => {
  return (
    <View style={sx.sectionPad}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [sx.cardPressable, pressed && sx.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Đi đến bảng điều khiển doanh thu"
      >
        <LinearGradient
          colors={["rgba(227,171,161,0.9)", "rgba(227,171,161,0.65)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={sx.revenueCard}
        >
          <View style={sx.revenueRow}>
            <View style={sx.revenueIconWrap}>
              <MaterialCommunityIcons name="cash-multiple" size={hp("3.2%")} color="#BE123C" />
            </View>
            <View style={sx.revenueInfo}>
              <Text style={sx.revenueText}>Doanh thu hôm nay</Text>
              <Text style={sx.revenueNumber}>3.200.250 đ</Text>
            </View>
          </View>

          <View style={sx.revenueDivider} />

          <View style={[sx.revenueRow, { justifyContent: "space-between" }]}>
            <View style={sx.revenueMetric}>
              <View style={sx.revenueIconSmallWrap}>
                <Ionicons name="cart-outline" size={hp("2.6%")} color="#BE123C" />
              </View>
              <Text style={sx.revenueMetricText}>
                Đơn mới: <Text style={sx.revenueMetricNumber}>5</Text>
              </Text>
            </View>
            <View style={sx.revenueMetric}>
              <View style={sx.revenueIconSmallWrap}>
                <MaterialCommunityIcons name="truck-delivery-outline" size={hp("2.6%")} color="#BE123C" />
              </View>
              <Text style={sx.revenueMetricText}>
                Đang giao: <Text style={sx.revenueMetricNumber}>2</Text>
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

/* ===== Product card ===== */
const ProductCreationCard = ({ onPress }) => {
  return (
    <View style={sx.sectionPad}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [sx.cardPressable, pressed && sx.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Tạo sản phẩm mới"
      >
        <LinearGradient
          colors={["#FDE2E4", "#F8BBD0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={sx.productCard}
        >
          <View style={sx.productContent}>
            <View style={sx.productTextWrap}>
              <Text style={sx.productTitle}>Tạo sản phẩm mới</Text>
              <Text style={sx.productDesc}>
                Shop của bạn đã đạt <Text style={sx.bold}>4,8 ⭐</Text> với <Text style={sx.bold}>2530 lượt đánh giá</Text> cho{" "}
                <Text style={sx.bold}>125 sản phẩm</Text>. Thêm sản phẩm mới để tiếp cận nhiều khách hàng hơn nhé!
              </Text>
            </View>
            <View style={sx.productArtWrap}>
              <Image
                source={{ uri: "https://api.builder.io/api/v1/image/assets/TEMP/f4b8c8e4480245a420ca3f57dc435c063e25bc48?width=260" }}
                style={sx.productImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
};

/* ===== Notification ===== */
const NotificationFeed = ({ onPress }) => {
  const handleNavigate = () => {
    if (onPress) onPress();
  };

  return (
    <View style={sx.sectionPad}>
      <LinearGradient colors={["#FFE9EC", "#FFE2F2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={sx.notificationCard}>
        <View style={sx.notificationHeader}>
          <View style={sx.notificationHeaderLeft}>
            <Ionicons name="notifications-outline" size={hp("2.4%")} color="#BE123C" />
            <Text style={sx.notificationTitle}>Thông báo mới</Text>
          </View>
          <Pressable
            onPress={handleNavigate}
            style={({ pressed }) => [sx.notificationActionButton, pressed && sx.pressedSoft]}
            accessibilityRole="button"
            accessibilityLabel="Xem tất cả thông báo"
          >
            <Text style={sx.notificationAction}>Xem tất cả</Text>
          </Pressable>
        </View>

        {NOTIFICATIONS.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={handleNavigate}
            style={({ pressed }) => [
              sx.notificationItem,
              index > 0 && sx.notificationItemDivider,
              pressed && sx.pressedSoft,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Chi tiết thông báo ${item.title}`}
          >
            <View style={sx.notificationDot} />
            <View style={sx.notificationBody}>
              <Text style={sx.notificationText}>{item.title}</Text>
              <Text style={sx.notificationTime}>{item.time}</Text>
            </View>
          </Pressable>
        ))}
      </LinearGradient>
    </View>
  );
};

/* ===== Comment item ===== */
const Comment = ({ name, username, date, message, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [sx.commentRow, pressed && sx.pressedSoft]}
      accessibilityRole="button"
      accessibilityLabel={`Xem tin nhắn với ${name}`}
    >
      <View style={sx.avatar} />
      <View style={sx.commentContent}>
        <View style={sx.commentHeader}>
          <View style={sx.commentNameRow}>
            <Text style={sx.commentName}>{name}</Text>
            <Text style={sx.commentUser}>{username}</Text>
          </View>
          <Text style={sx.commentDate}>{date}</Text>
        </View>
        <Text style={sx.commentMsg}>{message}</Text>
      </View>
    </Pressable>
  );
};

/* ===== Message ===== */
const MessageSection = ({ onPress }) => {
  const handleNavigate = () => {
    if (onPress) onPress();
  };

  return (
    <View style={sx.sectionPad}>
      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={sx.messageCard}>
        <Pressable
          onPress={handleNavigate}
          style={({ pressed }) => [sx.messageHeader, pressed && sx.pressedSoft]}
          accessibilityRole="button"
          accessibilityLabel="Xem tất cả tin nhắn"
        >
          <Text style={sx.messageTitle}>Tin nhắn gần đây</Text>
          <View style={sx.messageBadge}>
            <Text style={sx.messageBadgeText}>Bạn có 2 tin nhắn mới</Text>
          </View>
        </Pressable>

        <View style={sx.messageList}>
          {MESSAGES.map((item, index) => (
            <React.Fragment key={item.id}>
              <Comment {...item} onPress={handleNavigate} />
              {index < MESSAGES.length - 1 && <View style={sx.hr} />}
            </React.Fragment>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

/* ===== Bottom bar ===== */
const NavigationBar = () => {
  return (
    <View style={sx.navWrap}>
      <View style={sx.navPill} />
    </View>
  );
};

export default function HomeSeller() {
  const router = useRouter();
  const goTo = (path) => () => router.push(path);

  return (
    <SafeAreaView style={sx.safe}>
      <Header
        onShopPress={goTo("/profile")}
        onSearchPress={goTo("/search")}
        onNotificationsPress={goTo("/notifications")}
        onMessagesPress={goTo("/messages")}
        onSettingsPress={goTo("/settings")}
      />
      <ScrollView
        style={sx.scroll}
        contentContainerStyle={sx.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FlashSaleBanner />
        <RevenueOverview onPress={goTo("/dashboard")} />
        <ProductCreationCard onPress={goTo("/product-create")} />
        <NotificationFeed onPress={goTo("/notifications")} />
        <MessageSection onPress={goTo("/messages")} />
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}

/* ===== Styles (đã tối ưu cho màn hình di động) ===== */
const sx = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: hp("2.5%"), paddingBottom: hp("4%"), paddingHorizontal: wp("3%") },

  headerContainer: {
    backgroundColor: "#CC7861",
    paddingTop: hp("1.2%"),
    paddingBottom: hp("1.8%"),
    paddingHorizontal: wp("5%"),
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerGreeting: { fontSize: hp("2%"), color: "#FFE4E1", fontWeight: "500" },
  headerTitle: { fontSize: hp("3%"), color: "#FFFFFF", fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  shopNamePressable: { marginTop: hp("0.4%") },
  headerIconButton: {
    marginLeft: wp("3.5%"),
    padding: wp("1.8%"),
    borderRadius: wp("3.8%"),
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  pressedIcon: { backgroundColor: "rgba(255,255,255,0.3)" },

  sectionPad: {
    width: "100%",
    marginTop: hp("2%"),
  },
  cardPressable: { borderRadius: 18, overflow: "hidden" },
  pressed: { opacity: 0.85 },
  pressedSoft: { opacity: 0.7 },

  flashCarousel: { alignSelf: "center" },
  flashCarouselContent: { paddingRight: wp("3%") },
  flashImage: { height: hp("20%"), borderRadius: 18, marginRight: wp("3%") },
  flashDots: { flexDirection: "row", justifyContent: "center", marginTop: hp("1.2%") },
  flashDot: { width: wp("2.6%"), height: wp("2.6%"), borderRadius: wp("1.3%"), marginHorizontal: wp("1%") },
  flashDotInactive: { backgroundColor: "rgba(252,165,165,0.45)" },
  flashDotActive: { backgroundColor: "#FB7185" },

  revenueCard: { borderRadius: 18, paddingVertical: hp("2.2%"), paddingHorizontal: wp("4.5%") },
  revenueRow: { flexDirection: "row", alignItems: "center" },
  revenueInfo: { flex: 1, marginLeft: wp("3%") },
  revenueIconWrap: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: "#FFE4E8",
    justifyContent: "center",
    alignItems: "center",
  },
  revenueIconSmallWrap: {
    width: wp("9%"),
    height: wp("9%"),
    borderRadius: wp("4.5%"),
    backgroundColor: "#FFE7EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2.2%"),
  },
  revenueText: { fontSize: hp("2%"), fontWeight: "600", color: "#511414" },
  revenueNumber: { fontSize: hp("2.6%"), fontWeight: "700", color: "#7F1D1D", marginTop: hp("0.4%") },
  revenueDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.6)", marginVertical: hp("1.6%") },
  revenueMetric: { flexDirection: "row", alignItems: "center" },
  revenueMetricText: { fontSize: hp("1.8%"), color: "#581C1C" },
  revenueMetricNumber: { fontWeight: "700" },

  productCard: { borderRadius: 18, overflow: "hidden" },
  productContent: { flexDirection: "row", alignItems: "center", paddingVertical: hp("2.2%"), paddingHorizontal: wp("4%") },
  productTextWrap: { flex: 1.35, paddingRight: wp("3%") },
  productTitle: { fontSize: hp("2.2%"), fontWeight: "700", color: "#2F2F31", marginBottom: hp("0.8%") },
  productDesc: { fontSize: hp("1.8%"), lineHeight: hp("2.4%"), color: "#3F3F46" },
  bold: { fontWeight: "700" },
  productArtWrap: { flex: 0.75, height: hp("16%") },
  productImage: { width: "100%", height: "100%", borderRadius: 16 },

  notificationCard: { borderRadius: 18, paddingVertical: hp("2%"), paddingHorizontal: wp("4.5%") },
  notificationHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: hp("1.4%") },
  notificationHeaderLeft: { flexDirection: "row", alignItems: "center" },
  notificationTitle: { marginLeft: wp("2%"), fontSize: hp("2%"), fontWeight: "700", color: "#BE123C" },
  notificationAction: { fontSize: hp("1.7%"), color: "#BE123C", fontWeight: "600" },
  notificationActionButton: { paddingHorizontal: wp("2.2%"), paddingVertical: hp("0.5%"), borderRadius: 999, backgroundColor: "rgba(255,255,255,0.55)" },
  notificationItem: { flexDirection: "row", alignItems: "flex-start", paddingVertical: hp("0.8%") },
  notificationItemDivider: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.7)" },
  notificationDot: { width: wp("2.5%"), height: wp("2.5%"), borderRadius: wp("1.25%"), backgroundColor: "#FB7185", marginRight: wp("3%"), marginTop: hp("0.6%") },
  notificationBody: { flex: 1 },
  notificationText: { fontSize: hp("1.8%"), color: "#1F2937", fontWeight: "600" },
  notificationTime: { fontSize: hp("1.6%"), color: "#6B7280", marginTop: hp("0.4%") },

  messageCard: { borderRadius: 18, paddingVertical: hp("2.2%"), paddingHorizontal: wp("5%") },
  messageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  messageTitle: { fontSize: hp("2.2%"), fontWeight: "700", color: "#1F2937" },
  messageBadge: { paddingHorizontal: wp("3%"), paddingVertical: hp("0.6%"), backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 999 },
  messageBadgeText: { fontSize: hp("1.5%"), fontWeight: "600", color: "#B91C1C" },
  messageList: { marginTop: hp("1.8%") },

  avatar: { width: hp("5.6%"), height: hp("5.6%"), borderRadius: 999, backgroundColor: "#fff" },
  commentRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: hp("1.6%") },
  commentContent: { flex: 1, marginLeft: wp("4%") },
  commentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: hp("0.6%") },
  commentNameRow: { flexDirection: "row", alignItems: "center" },
  commentName: { fontSize: hp("1.9%"), fontWeight: "700", color: "#1F2937", marginRight: wp("1.5%") },
  commentUser: { fontSize: hp("1.6%"), color: "#6B7280" },
  commentDate: { fontSize: hp("1.6%"), fontWeight: "500", color: "#9CA3AF" },
  commentMsg: { fontSize: hp("1.9%"), fontWeight: "500", color: "#111827" },
  hr: { height: 1, backgroundColor: "rgba(255,255,255,0.7)", marginVertical: hp("1.2%") },

  navWrap: { display: 'none' },
  navPill: { display: 'none' },
});