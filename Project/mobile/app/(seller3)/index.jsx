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
  Text,
  View
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

// Import styles and data
import {
  FLASH_IMAGES,
  MESSAGES,
  NOTIFICATIONS,
} from "./data/homeSellerData";
import { styles } from "./styles/HomeSellerStyles";

const BANNER_WIDTH = Dimensions.get("window").width * 0.92;

/* ===== Header ===== */
const Header = ({
  onShopPress,
  onSearchPress,
  onNotificationsPress,
  onMessagesPress,
  onSettingsPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Xin chào,</Text>
          <Pressable
            onPress={onShopPress}
            style={({ pressed }) => [styles.shopNamePressable, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Đi đến hồ sơ cửa hàng"
          >
            <Text style={styles.headerTitle}>Siny Shop!</Text>
          </Pressable>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            onPress={onSearchPress}
            style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressedIcon]}
            accessibilityRole="button"
            accessibilityLabel="Tìm kiếm"
          >
            <Ionicons name="search" size={hp("3%")} color="#FFF5F2" />
          </Pressable>
          <Pressable
            onPress={onNotificationsPress}
            style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressedIcon]}
            accessibilityRole="button"
            accessibilityLabel="Thông báo"
          >
            <Ionicons name="notifications-outline" size={hp("3%")} color="#FFF5F2" />
          </Pressable>
          <Pressable
            onPress={onMessagesPress}
            style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressedIcon]}
            accessibilityRole="button"
            accessibilityLabel="Tin nhắn"
          >
            <Ionicons name="chatbubble-ellipses-outline" size={hp("3%")} color="#FFF5F2" />
          </Pressable>
          <Pressable
            onPress={onSettingsPress}
            style={({ pressed }) => [styles.headerIconButton, pressed && styles.pressedIcon]}
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
    <View style={styles.sectionPad}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={styles.flashCarouselContent}
        style={[styles.flashCarousel, { width: BANNER_WIDTH }]}
      >
        {FLASH_IMAGES.map((imageSource, index) => (
          <Image
            key={index.toString()}
            source={imageSource}
            style={[
              styles.flashImage,
              { width: BANNER_WIDTH },
              index === FLASH_IMAGES.length - 1 && { marginRight: 0 },
            ]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={styles.flashDots}>
        {FLASH_IMAGES.map((_, index) => (
          <View
            key={index.toString()}
            style={[styles.flashDot, activeSlide === index ? styles.flashDotActive : styles.flashDotInactive]}
          />
        ))}
      </View>
    </View>
  );
};

/* ===== Revenue ===== */
const RevenueOverview = ({ onPress }) => {
  return (
    <View style={styles.sectionPad}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Đi đến bảng điều khiển doanh thu"
      >
        <LinearGradient
          colors={["rgba(227,171,161,0.9)", "rgba(227,171,161,0.65)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.revenueCard}
        >
          <View style={styles.revenueRow}>
            <View style={styles.revenueIconWrap}>
              <MaterialCommunityIcons name="cash-multiple" size={hp("3.2%")} color="#BE123C" />
            </View>
            <View style={styles.revenueInfo}>
              <Text style={styles.revenueText}>Doanh thu hôm nay</Text>
              <Text style={styles.revenueNumber}>3.200.250 đ</Text>
            </View>
          </View>

          <View style={styles.revenueDivider} />

          <View style={[styles.revenueRow, { justifyContent: "space-between" }]}>
            <View style={styles.revenueMetric}>
              <View style={styles.revenueIconSmallWrap}>
                <Ionicons name="cart-outline" size={hp("2.6%")} color="#BE123C" />
              </View>
              <Text style={styles.revenueMetricText}>
                Đơn mới: <Text style={styles.revenueMetricNumber}>5</Text>
              </Text>
            </View>
            <View style={styles.revenueMetric}>
              <View style={styles.revenueIconSmallWrap}>
                <MaterialCommunityIcons name="truck-delivery-outline" size={hp("2.6%")} color="#BE123C" />
              </View>
              <Text style={styles.revenueMetricText}>
                Đang giao: <Text style={styles.revenueMetricNumber}>2</Text>
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
    <View style={styles.sectionPad}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Tạo sản phẩm mới"
      >
        <LinearGradient
          colors={["#FDE2E4", "#F8BBD0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.productCard}
        >
          <View style={styles.productContent}>
            <View style={styles.productTextWrap}>
              <Text style={styles.productTitle}>Tạo sản phẩm mới</Text>
              <Text style={styles.productDesc}>
                Shop của bạn đã đạt <Text style={styles.bold}>4,8 ⭐</Text> với <Text style={styles.bold}>2530 lượt đánh giá</Text> cho{" "}
                <Text style={styles.bold}>125 sản phẩm</Text>. Thêm sản phẩm mới để tiếp cận nhiều khách hàng hơn nhé!
              </Text>
            </View>
            <View style={styles.productArtWrap}>
              <Image
                source={{ uri: "https://api.builder.io/api/v1/image/assets/TEMP/f4b8c8e4480245a420ca3f57dc435c063e25bc48?width=260" }}
                style={styles.productImage}
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
    <View style={styles.sectionPad}>
      <LinearGradient colors={["#FFE9EC", "#FFE2F2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <View style={styles.notificationHeaderLeft}>
            <Ionicons name="notifications-outline" size={hp("2.4%")} color="#BE123C" />
            <Text style={styles.notificationTitle}>Thông báo mới</Text>
          </View>
          <Pressable
            onPress={handleNavigate}
            style={({ pressed }) => [styles.notificationActionButton, pressed && styles.pressedSoft]}
            accessibilityRole="button"
            accessibilityLabel="Xem tất cả thông báo"
          >
            <Text style={styles.notificationAction}>Xem tất cả</Text>
          </Pressable>
        </View>

        {NOTIFICATIONS.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={handleNavigate}
            style={({ pressed }) => [
              styles.notificationItem,
              index > 0 && styles.notificationItemDivider,
              pressed && styles.pressedSoft,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Chi tiết thông báo ${item.title}`}
          >
            <View style={styles.notificationDot} />
            <View style={styles.notificationBody}>
              <Text style={styles.notificationText}>{item.title}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
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
      style={({ pressed }) => [styles.commentRow, pressed && styles.pressedSoft]}
      accessibilityRole="button"
      accessibilityLabel={`Xem tin nhắn với ${name}`}
    >
      <View style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <View style={styles.commentNameRow}>
            <Text style={styles.commentName}>{name}</Text>
            <Text style={styles.commentUser}>{username}</Text>
          </View>
          <Text style={styles.commentDate}>{date}</Text>
        </View>
        <Text style={styles.commentMsg}>{message}</Text>
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
    <View style={styles.sectionPad}>
      <LinearGradient colors={["#FFEAF1", "#FDE2E4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.messageCard}>
        <Pressable
          onPress={handleNavigate}
          style={({ pressed }) => [styles.messageHeader, pressed && styles.pressedSoft]}
          accessibilityRole="button"
          accessibilityLabel="Xem tất cả tin nhắn"
        >
          <Text style={styles.messageTitle}>Tin nhắn gần đây</Text>
          <View style={styles.messageBadge}>
            <Text style={styles.messageBadgeText}>Bạn có 2 tin nhắn mới</Text>
          </View>
        </Pressable>

        <View style={styles.messageList}>
          {MESSAGES.map((item, index) => (
            <React.Fragment key={item.id}>
              <Comment {...item} onPress={handleNavigate} />
              {index < MESSAGES.length - 1 && <View style={styles.hr} />}
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
    <View style={styles.navWrap}>
      <View style={styles.navPill} />
    </View>
  );
};

export default function HomeSeller() {
  const router = useRouter();
  const goTo = (path) => () => router.push(path);

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        onShopPress={goTo("/profile")}
        // onSearchPress={goTo("/search")}
        onSearchPress={goTo("(seller3)/components/search")}
        onNotificationsPress={goTo("(seller3)/components/notifications")}
        onMessagesPress={goTo("(seller3)/components/messages")}
        onSettingsPress={goTo("(seller3)/components/settings")}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FlashSaleBanner />
        <RevenueOverview onPress={goTo("(seller3)/components/dashboard")} />
        <ProductCreationCard onPress={goTo("(seller3)/components/product-create")} />
        <NotificationFeed onPress={goTo("(seller3)/components/notifications")} />
        <MessageSection onPress={goTo("(seller3)/components/messages")} />
      </ScrollView>
      <NavigationBar />
    </SafeAreaView>
  );
}