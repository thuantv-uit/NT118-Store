import React, { useRef, useState, useEffect } from "react";
import {
    Dimensions,
    Animated,
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { Image } from "expo-image";
import { Icon } from "../../components/ui/icon";
import { wpA, hpA, topA } from "../../utils/scale";
import { typography } from "../../theme/typography";
import { colors } from "@/theme/colors";
import { LinearGradient } from "expo-linear-gradient";


//components
import FlashSaleSection from "../../components/ui/FlashSaleSection";
import NavigationBar from "../../components/ui/NavigationBar";


const { width: screenWidth } = Dimensions.get("window");

export default function ProductDetail() {
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState("M");

    const colorsList = [
        require("@/assets/images/products/color/color1.png"),
        require("@/assets/images/products/color/color2.png"),
        require("@/assets/images/products/color/color3.png"),
    ];

    const sizes = ["S", "M", "L", "XL", "XXL"];
    const RELATED = [
        { id: "1", img: require("@/assets/images/products/sanpham3.png"), title: "Lorem ipsum dolor sit amet", price: "đ27,000" },
        { id: "2", img: require("@/assets/images/products/sanpham4.png"), title: "Lorem ipsum dolor sit amet", price: "đ31,700" },
        { id: "3", img: require("@/assets/images/products/sanpham5.png"), title: "Lorem ipsum dolor sit amet", price: "đ32,000" },
        { id: "4", img: require("@/assets/images/products/sanpham6.png"), title: "Lorem ipsum dolor sit amet", price: "đ37,200" },
    ];
    const REVIEWS = [
        { id: "r1", user: "N.T****", stars: 5, text: "Áo đẹp, form ổn, chất vải mát. Giao nhanh." },
        { id: "r2", user: "H.M****", stars: 4, text: "Màu giống hình, đường may ok." },
        { id: "r3", user: "T.P****", stars: 4, text: "Tỉ lệ giá/ chất lượng ổn." },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Icon name="back" size={wpA(20)} color={colors.black} />
                </TouchableOpacity>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Image
                            source={require("@/assets/icons/actions/Cart_Icon.png")}
                            style={{ ...styles.iconImage, width: wpA(30), height: hpA(30) }}
                        />
                        {/* <Icon name="cart" size={wpA(22)} color={colors.black} /> */}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Image
                            source={require("@/assets/icons/actions/Share.png")}
                            style={{ ...styles.iconImage, width: wpA(30), height: hpA(30) }}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <Image
                    source={require("@/assets/images/products/sanpham1.png")}
                    style={styles.productImage}
                    resizeMode="cover"
                    marginTop={hpA()}
                />

                {/* Product Info */}
                <View style={styles.infoSection}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Image
                            source={require("@/assets/icons/navigation/Favorite-Off.png")}
                            style={{ ...styles.iconImage, width: "100%", height: "100%", marginLeft: wpA(360), position: "absolute", marginTop: hpA(10) }}
                        />
                        {/* <Icon name="cart" size={wpA(22)} color={colors.black} /> */}
                    </TouchableOpacity>
                    <Text style={styles.price}>đ30,000</Text>
                    <Text style={styles.name}>
                        Áo sơ mi kiểu nữ cổ V phối ren | Nina Shirt - B.Y Tea Clothing
                    </Text>
                    <View style={{ position: "absolute", height: hpA(0.7), width: wpA(412), backgroundColor: colors.black, marginTop: hpA(100), marginBottom: hpA(2) }}></View>

                    {/* Color */}
                    {/* <Text style={styles.sectionTitle}>Màu sắc</Text>
                    <View style={styles.colorRow}>
                        {colorsList.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedColor(index)}
                                style={[
                                    styles.colorBox,
                                    selectedColor === index && styles.colorBoxActive,
                                ]}
                            >
                                <Image
                                    source={item}
                                    style={styles.colorImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </View> */}

                    {/* Size */}
                    {/* <View style={styles.sizeRow}>
                        {sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                onPress={() => setSelectedSize(size)}
                                style={[
                                    styles.sizeBox,
                                    selectedSize === size && styles.sizeBoxActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.sizeText,
                                        selectedSize === size && styles.sizeTextActive,
                                    ]}
                                >
                                    {size}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View> */}
                    {/* Color */}
                    <Text style={styles.sectionTitle}>Màu sắc&Kích Thước</Text>
                    <View style={styles.colorRow}>
                        {colorsList.map((item, index) => {
                            const isActive = selectedColor === null;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedColor(null)}
                                    activeOpacity={0.8}
                                    disabled={true}
                                    style={[styles.colorBox, isActive && styles.colorBoxActive]}
                                >
                                    <Image source={item} style={styles.colorImage} resizeMode="cover" />
                                    {isActive && (
                                        <View style={styles.tickOverlay}>
                                            <Image
                                                source={require("@/assets/icons/navigation/Tick-On.png")} // ✅ tick PNG
                                                style={{ width: "100%", height: "100%" }}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Size */}
                    <View style={styles.sizeRow}>
                        {sizes.map((size) => {
                            const isActive = selectedSize === null;
                            return (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() => setSelectedSize(null)}
                                    disabled={true}
                                    activeOpacity={0.8}
                                    style={[styles.sizeBox, isActive && styles.sizeBoxActive]}
                                >
                                    <Text style={[styles.sizeText, isActive && styles.sizeTextActive]}>
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={{ position: "absolute", height: hpA(0.7), width: wpA(412), backgroundColor: colors.black, marginTop: hpA(255), marginBottom: hpA(2) }}></View>


                    {/* Shipping */}
                    <View style={styles.deliveryRow}>
                        <Image
                            source={require("@/assets/icons/actions/Ship.png")}
                            style={{ ...styles.iconImage, width: wpA(30), height: hpA(30) }}
                        />
                        <Text style={styles.deliveryText}>Nhận hàng sau 2 - 3 ngày</Text>
                        <TouchableOpacity>
                            <Image
                                source={require("@/assets/icons/actions/Next.png")}
                                style={{ ...styles.iconImage, width: wpA(20), height: hpA(20), marginLeft: wpA(130) }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ position: "absolute", height: hpA(4), width: wpA(412), backgroundColor: colors.gray, marginTop: hpA(299), marginBottom: hpA(2) }}></View>


                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <Icon name="star" size={wpA(16)} color={colors.color1} />
                        <Text style={styles.ratingText}>4.5</Text>
                        <Text style={styles.ratingSub}>Đánh giá sản phẩm (1.8k)</Text>
                        <TouchableOpacity>
                            <Text style={{ ...styles.ratingSub, marginLeft: wpA(95), fontSize: wpA(12), color: colors.black, position: "absolute" }}>Xem tất cả</Text>
                            <Image
                                source={require("@/assets/icons/actions/Next.png")}
                                style={{ ...styles.iconImage, width: wpA(20), height: hpA(20), marginLeft: wpA(148), color: colors.gray }}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* Shop info */}
                    <View style={styles.block}>
                        <View style={styles.shopRow}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: wpA(10) }}>
                                <Image
                                    source={require("@/assets/images/products/avtShop.png")}
                                    style={{ width: wpA(44), height: wpA(44), borderRadius: wpA(22) }}
                                />
                                <View>
                                    <Text style={styles.shopName}>LEGENDARY T SHOP</Text>
                                    <Text style={styles.shopSub}>Online 5 phút trước</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.shopBtn}>
                                <Text style={styles.shopBtnText}>Xem shop</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.shopStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>930</Text>
                                <Text style={styles.statLabel}>Sản phẩm</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>98%</Text>
                                <Text style={styles.statLabel}>Tỉ lệ chat</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>4.7</Text>
                                <Text style={styles.statLabel}>Điểm đánh giá</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Specs */}
                    <View style={styles.block}>
                        <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
                        <View style={{ marginTop: hpA(8), gap: hpA(6) }}>
                            <SpecRow label="Danh mục" value="Áo nữ > Áo đầm" />
                            <SpecRow label="Chất liệu" value="Cotton" />
                            <SpecRow label="Kiểu dáng" value="Trơn" />
                            <SpecRow label="Phong cách" value="Hàn quốc" />
                            <SpecRow label="Kích cỡ" value="S - L" />
                            <SpecRow label="Xuất xứ" value="Việt Nam" />
                            <SpecRow label="Cổ áo" value="Cổ vuông" />
                            <SpecRow label="Tay áo" value="Không tay" />
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Description */}
                    <View style={styles.block}>
                        <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                        <Text style={styles.desc}>
                            Form nữ tính, chất vải mát, đường may chắc chắn. Hướng tới phong cách
                            tối giản dễ phối. Vui lòng xem bảng size trước khi đặt. Sản phẩm có thể
                            chênh lệch 1-2cm do đo thủ công.
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Reviews */}
                    <View style={styles.block}>
                        <View style={styles.reviewsHeader}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: wpA(6) }}>
                                <Icon name="star" size={wpA(18)} color={colors.black} />
                                <Text style={styles.ratingBig}>4.5</Text>
                                <Text style={styles.ratingSmall}>• 1.8k đánh giá</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: hpA(10) }}>
                            {REVIEWS.map((r) => (
                                <View key={r.id} style={styles.reviewCard}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text style={styles.reviewUser}>{r.user}</Text>
                                        <Text style={styles.reviewStars}>{"★".repeat(r.stars)}</Text>
                                    </View>
                                    <Text style={styles.reviewText}>{r.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Related products */}
                    <View style={[styles.block, { paddingBottom: hpA(8) }]}>
                        <Text style={styles.sectionTitle}>Sản phẩm liên quan</Text>
                        <FlatList
                            data={RELATED}
                            keyExtractor={(it) => it.id}
                            numColumns={2}
                            scrollEnabled={false}
                            columnWrapperStyle={{ gap: wpA(12) }}
                            contentContainerStyle={{ gap: hpA(12), marginTop: hpA(10) }}
                            renderItem={({ item }) => (
                                <View style={styles.card}>
                                    <Image source={item.img} style={styles.cardImg} contentFit="cover" />
                                    <Text numberOfLines={2} style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardPrice}>{item.price}</Text>
                                </View>
                            )}
                        />
                    </View>

                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.bottomIcon}>
                    <View style={{ position: "absolute", flexDirection: "row", alignItems: "center", width: wpA(90), height: hpA(56), justifyContent: "center", backgroundColor: colors.color1, left: wpA(-24), borderRadius: wpA(0), marginTop: hpA(0) }} />

                    <Image
                        source={require("@/assets/icons/actions/Icon_Chat.png")}
                        style={{ ...styles.iconImage, width: "100%", height: "100%", marginLeft: wpA(20) }}
                    />
                </TouchableOpacity>
                <View style={{ position: "absolute", borderLeftWidth: 1, borderLeftColor: colors.hmee01, height: hpA(40), marginLeft: wpA(85) }}></View>


                <TouchableOpacity style={styles.bottomIcon}>
                    <View style={{ position: "absolute", flexDirection: "row", alignItems: "center", width: wpA(77), height: hpA(56), justifyContent: "center", backgroundColor: colors.color1, left: wpA(24), borderRadius: wpA(0), marginTop: hpA(0) }} />

                    <Image
                        source={require("@/assets/icons/actions/Cart_Icon2.png")}
                        style={{ ...styles.iconImage, width: "100%", height: "100%", marginLeft: wpA(70) }}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buyButton, { backgroundColor: colors.hmee07 }]}>

                    <View style={{ position: "absolute", flexDirection: "row", alignItems: "center", width: wpA(250), height: hpA(56), justifyContent: "center", backgroundColor: colors.icon_square_color, right: wpA(-20), borderRadius: wpA(0), marginTop: hpA(0) }}>
                        <Text style={styles.buyText}>Mua với giá 17.000 đ</Text>
                    </View >
                </TouchableOpacity>
            </View>
        </View>
    );
}
// ---------- small subcomponent ----------
function SpecRow({ label, value }) {
  return (
    <View style={specStyles.row}>
      <Text style={specStyles.label}>{label}</Text>
      <Text style={specStyles.value}>{value}</Text>
    </View>
  );
}

const specStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    ...typography.caption1,
    color: colors.hmee08,
    width: "45%",
  },
  value: {
    ...typography.caption1,
    color: colors.black,
    width: "55%",
    textAlign: "right",
  },
});
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wpA(16),
        paddingTop: hpA(40),
        // paddingBottom: hpA(10),
    },
    headerTitle: {
        ...typography.title2,
        color: colors.hmee07,
    },
    headerRight: {
        flexDirection: "row",
        gap: wpA(10),
    },
    iconBtn: { padding: wpA(6) },

    productImage: {
        width: "100%",
        height: hpA(340),
        // marginTop: hpA(10),
        // borderRadius: wpA(12),
    },

    infoSection: {
        paddingHorizontal: wpA(20),
        // paddingTop: hpA(),
    },
    price: {
        ...typography.title2,
        color: colors.hmee07,
    },
    name: {
        ...typography.body1,
        color: colors.black,
        marginTop: hpA(6),
    },

    sectionTitle: {
        ...typography.headline1,
        color: colors.black,
        marginTop: hpA(16),
    },
    colorRow: {
        flexDirection: "row",
        gap: wpA(12),
        marginTop: hpA(10),
    },
    colorBox: {
        borderRadius: wpA(8),
        // borderWidth: 1,

        padding: wpA(3),
    },
    colorBoxActive: {
        borderColor: colors.white,
    },
    tickOverlay: {
        position: "absolute",
        top: wpA(3),
        right: wpA(3),
        //   backgroundColor: colors.hmee07,
        borderRadius: wpA(10),
        padding: wpA(2),
    },
    colorImage: {
        width: wpA(48),
        height: hpA(48),
        borderRadius: wpA(6),
    },

    sizeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hpA(16),
    },
    sizeBox: {
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: wpA(8),
        width: wpA(48),
        height: wpA(36),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.gray,
    },
    sizeBoxActive: {
        backgroundColor: colors.icon_square_color,
        borderColor: colors.icon_square_color,
    },
    sizeText: {
        ...typography.caption1,
        color: colors.black,
    },
    sizeTextActive: {
        color: colors.inside_color_icon_on,
    },

    deliveryRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: wpA(8),
        marginTop: hpA(20),
    },
    deliveryText: {
        ...typography.body2,
        color: colors.hmee08,
    },

    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: hpA(24),
    },
    ratingText: {
        ...typography.body2,
        color: colors.hmee07,
        marginLeft: wpA(6),
    },
    ratingSub: {
        ...typography.body3,
        color: colors.black,
        marginLeft: wpA(4),
    },
    shopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    shopName: { ...typography.body2, color: colors.black },
    shopSub: { ...typography.caption1, color: colors.hmee08 },
    shopBtn: {
        paddingHorizontal: wpA(12),
        height: hpA(32),
        borderRadius: wpA(16),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.hmee02,
    },
    shopBtnText: { ...typography.caption1, color: colors.black },

    shopStats: {
        marginTop: hpA(12),
        padding: wpA(12),
        borderRadius: wpA(10),
        backgroundColor: colors.hmee01,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statItem: { alignItems: "center", flex: 1 },
    statValue: { ...typography.body2, color: colors.black },
    statLabel: { ...typography.caption1, color: colors.hmee08 },
    statDivider: { width: 1, height: "100%", backgroundColor: colors.hmee02, opacity: 0.5 },

    desc: { ...typography.body3, color: colors.black, marginTop: hpA(8), lineHeight: Math.round(wpA(14) * 1.6) },

    reviewsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    ratingBig: { ...typography.body2, color: colors.hmee07 },
    ratingSmall: { ...typography.caption1, color: colors.hmee08 },
    linkText: { ...typography.caption1, color: colors.hmee07 },

    reviewCard: {
        paddingVertical: hpA(10),
        borderBottomWidth: 1,
        borderColor: colors.hmee01,
    },
    reviewUser: { ...typography.caption1, color: colors.black },
    reviewStars: { ...typography.caption1, color: colors.hmee07 },
    reviewText: { ...typography.body3, color: colors.black, marginTop: hpA(4) },

    card: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.hmee01,
        borderRadius: wpA(10),
        overflow: "hidden",
        backgroundColor: colors.white,
    },
    cardImg: { width: "100%", height: hpA(120) },
    cardTitle: { ...typography.body3, color: colors.black, paddingHorizontal: wpA(8), paddingTop: hpA(8) },
    cardPrice: { ...typography.body2, color: colors.hmee07, paddingHorizontal: wpA(8), paddingBottom: hpA(10) },


    bottomBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wpA(20),
        paddingVertical: hpA(10),
        // borderTopWidth: 1,
        borderColor: colors.hmee01,
        // marginTop: hpA(-10),
    },
    bottomIcon: {
        width: wpA(42),
        height: wpA(42),
        borderRadius: wpA(21),
        backgroundColor: colors.hmee01,
        alignItems: "center",
        justifyContent: "center",
    },
    buyButton: {
        flex: 1,
        marginLeft: wpA(12),
        height: hpA(46),
        borderRadius: wpA(14),
        alignItems: "center",
        justifyContent: "center",
    },
    buyText: {
        ...typography.headline1,
        color: colors.inside_color_icon_on,
    },
});