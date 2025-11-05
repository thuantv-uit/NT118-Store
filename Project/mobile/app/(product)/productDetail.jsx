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
                            style={{ ...styles.iconImage,width: "100%", height: "100%", marginLeft: wpA(360), position: "absolute", marginTop: hpA(10) }}
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