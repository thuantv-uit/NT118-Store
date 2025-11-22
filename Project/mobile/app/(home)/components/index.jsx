//NT118-Store/Project/mobile/app/%28root%29/homeScreen.jsx
import React, { useRef, useState, useEffect  } from "react";
import { useRouter } from "expo-router";

import { Dimensions, Animated, View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Icon } from "../../../components/ui/icon";
import { wpA, hpA, topA } from "../../../utils/scale";
import { typography } from "../../../theme/typography";
import { colors } from "@/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { formatVND } from "../../../utils/format";


//components
import FlashSaleSection from "../../../components/ui/FlashSaleSection";
import NavigationBar from "../../../components/ui/NavigationBar";

//backend
import { API_URL } from "@/constants/api";


const { width: screenWidth } = Dimensions.get("window");


export default function HomeScreen() {
    const [activeCategory, setActiveCategory] = useState(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    //==Database neon===
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    // ========== Fetch products từ API Neon ==========
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();
                console.log('[HomeScreen] fetched products count=', Array.isArray(data) ? data.length : 'not-array');
                if (Array.isArray(data) && data.length > 0) {
                    console.log('[HomeScreen] sample product[0]=', JSON.stringify(data[0], null, 2));
                }
                if (!response.ok) throw new Error(data.message || "Không thể tải sản phẩm.");
                setProducts(data); // giả sử backend trả mảng sản phẩm
            } catch (err) {
                console.warn("[HomeScreen] Lỗi tải sản phẩm:", err && err.message ? err.message : err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // ===== Dữ liệu demo =====
    const categories = [
        {
            id: 1,
            iconDefault: require("@/assets/icons/navigation/Vay-On.png"),
            iconActive: require("@/assets/icons/navigation/Vay-Off.png"),
            name: "Váy",
        },
        {
            id: 2,
            iconDefault: require("@/assets/icons/navigation/Nam-On.png"),
            iconActive: require("@/assets/icons/navigation/Nam-Off.png"),
            name: "Áo",
        },
        {
            id: 3,
            iconDefault: require("@/assets/icons/navigation/Quan-On.png"),
            iconActive: require("@/assets/icons/navigation/Quan-Off.png"),
            name: "Quần",
        },
        {
            id: 4,
            iconDefault: require("@/assets/icons/navigation/Balo-On.png"),
            iconActive: require("@/assets/icons/navigation/Balo-Off.png"),
            name: "Túi",
        },
        {
            id: 5,
            iconDefault: require("@/assets/icons/navigation/Giay-On.png"),
            iconActive: require("@/assets/icons/navigation/Giay-Off.png"),
            name: "Giày",
        },
    ];

    // const products = [
    //     {
    //         id: 1,
    //         name: "Đầm Body Maxi Nữ",
    //         price: "220.000đ",
    //         img: require("@/assets/images/products/sanpham1.png"),
    //     },
    //     {
    //         id: 2,
    //         name: "Áo Sơ Mi Đùi MiSoul",
    //         price: "350.000đ",
    //         img: require("@/assets/images/products/sanpham2.png"),
    //     },
    //     {
    //         id: 3,
    //         name: "Đầm Body Maxi Nữ",
    //         price: "220.000đ",
    //         img: require("@/assets/images/products/sanpham1.png"),
    //     },
    //     {
    //         id: 4,
    //         name: "Áo Sơ Mi Đùi MiSoul",
    //         price: "350.000đ",
    //         img: require("@/assets/images/products/sanpham2.png"),
    //     },
    //     {
    //         id: 5,
    //         name: "Đầm Body Maxi Nữ",
    //         price: "220.000đ",
    //         img: require("@/assets/images/products/sanpham1.png"),
    //     },
    //     {
    //         id: 6,
    //         name: "Áo Sơ Mi Đùi MiSoul",
    //         price: "350.000đ",
    //         img: require("@/assets/images/products/sanpham2.png"),
    //     },
    //     {
    //         id: 7,
    //         name: "Đầm Body Maxi Nữ",
    //         price: "220.000đ",
    //         img: require("@/assets/images/products/sanpham1.png"),
    //     },
    //     {
    //         id: 8,
    //         name: "Áo Sơ Mi Đùi MiSoul",
    //         price: "350.000đ",
    //         img: require("@/assets/images/products/sanpham2.png"),
    //     },
    //     {
    //         id: 9,
    //         name: "Đầm Body Maxi Nữ",
    //         price: "220.000đ",
    //         img: require("@/assets/images/products/sanpham1.png"),
    //     },
    //     {
    //         id: 10,
    //         name: "Áo Sơ Mi Đùi MiSoul",
    //         price: "350.000đ",
    //         img: require("@/assets/images/products/sanpham2.png"),
    //     },
    //     {
    //         id: 11,
    //         name: "Đầm Body Maxi Nữ",
    //         price: "220.000đ",
    //         img: require("@/assets/images/products/sanpham1.png"),
    //     },
    //     {
    //         id: 12,
    //         name: "Áo Sơ Mi Đùi MiSoul",
    //         price: "350.000đ",
    //         img: require("@/assets/images/products/sanpham2.png"),
    //     },
    //     {
    //         id: 13,
    //         name: "Đầm Body Maxi Nữ",
    //         price: "220.000đ",
    //         img: require("@/assets/images/products/sanpham1.png"),
    //     },
    //     {
    //         id: 14,
    //         name: "Áo Sơ Mi Đùi MiSoul",
    //         price: "350.000đ",
    //         img: require("@/assets/images/products/sanpham2.png"),
    //     },
    // ];
    const flashSaleData = [
        {
            id: 1,
            name: "Áo Polo Croptop",
            discount: 42,
            price: "46.153",
            status: "hot",
            image: require("@/assets/images/products/sanpham2.png"),
        },
        {
            id: 2,
            name: "Quần Jean Ống Rộng",
            discount: 57,
            price: "99.437",
            status: "top",
            image: require("@/assets/images/products/sanpham1.png"),
        },
        {
            id: 3,
            name: "Áo Hai Dây",
            discount: 51,
            price: "17.470",
            status: "top",
            image: require("@/assets/images/products/sanpham2.png"),
        },
        {
            id: 4,
            name: "Áo Polo Croptop",
            discount: 42,
            price: "46.153",
            status: "hot",
            image: require("@/assets/images/products/sanpham2.png"),
        },
        {
            id: 5,
            name: "Quần Jean Ống Rộng",
            discount: 57,
            price: "99.437",
            status: "top",
            image: require("@/assets/images/products/sanpham1.png"),
        },
        {
            id: 6,
            name: "Áo Hai Dây",
            discount: 51,
            price: "17.470",
            status: "top",
            image: require("@/assets/images/products/sanpham2.png"),
        },
        {
            id: 7,
            name: "Áo Polo Croptop",
            discount: 42,
            price: "46.153",
            status: "hot",
            image: require("@/assets/images/products/sanpham2.png"),
        },
        {
            id: 8,
            name: "Quần Jean Ống Rộng",
            discount: 57,
            price: "99.437",
            status: "top",
            image: require("@/assets/images/products/sanpham1.png"),
        },
        {
            id: 9,
            name: "Áo Hai Dây",
            discount: 51,
            price: "17.470",
            status: "top",
            image: require("@/assets/images/products/sanpham2.png"),
        },

    ];


    const headerTranslate = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -80], // cuộn xuống ẩn header
        extrapolate: "clamp",
    });

    // ===== Giao diện =====
    // Helper to safely extract first image URL from various backend shapes
    const getFirstImageUrl = (item) => {
        try {
            // support several possible shapes/casings returned by backend
            const candidates = [
                item?.imageUrls,
                item?.imageurls,
                item?.images,
                item?.image,
                item?.media,
            ];

            let imgs = null;
            for (const c of candidates) {
                if (c != null) {
                    imgs = c;
                    break;
                }
            }

            if (!imgs) return null;
            // sometimes backend returns a JSON string
            const arr = typeof imgs === 'string' ? JSON.parse(imgs) : imgs;
            if (!Array.isArray(arr) || arr.length === 0) return null;
            const first = arr[0];
            if (!first) return null;
            if (typeof first === 'string') return first;
            // common keys used by Cloudinary responses: secure_url, url
            return first.url || first.secure_url || first.src || null;
        } catch (e) {
            console.warn('[HomeScreen] getFirstImageUrl parse error', e && e.message ? e.message : e);
            return null;
        }
    };

    const navigateToDetail = (id) => {
    router.push(`/product/${id}`);
};

    return (
        <View style={styles.container}>
            {/* HEADER ẩn khi cuộn */}
            <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}>
                <Text style={styles.username}>Hi, User Name</Text>
                <View style={styles.searchBox}>
                    <Icon name="search" color={colors.hmee06} size={wpA(16)} />
                    <Text style={styles.searchPlaceholder}>Clothing</Text>
                </View>
                <TouchableOpacity>
                    <Icon name="setting" color={colors.hmee06} size={wpA(18)} />
                </TouchableOpacity>
            </Animated.View>

            {/* NỘI DUNG CHÍNH */}
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Banner */}
                <Image
                    source={require("@/assets/images/banner/home-sale.png")}
                    style={styles.banner}
                    contentFit="cover"
                />

                {/* Danh mục */}
                <Text style={styles.sectionTitle}>Danh mục</Text>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryList}
                    renderItem={({ item }) => {
                        const isActive = item.id === activeCategory;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setActiveCategory(item.id)}
                                style={[
                                    styles.categoryItem,
                                    { backgroundColor: isActive ? colors.hmee04 : colors.hmee02 },
                                ]}
                            >
                                <Image
                                    source={isActive ? item.iconActive : item.iconDefault}
                                    style={styles.categoryIcon}
                                    contentFit="cover"
                                />
                                <Text
                                    style={[
                                        styles.categoryText,
                                        { color: isActive ? colors.hmee07 : colors.hmee06 },
                                    ]}
                                >
                                    {/* {item.name} */}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />

                {/* Flash Sale */}
                {/* <Text style={styles.sectionTitle}>Flash Sale</Text> */}
                <FlashSaleSection data={flashSaleData} onViewAll={() => console.log("Xem tất cả Flash Sale")} style={styles.flashSaleSection} />

                {/* Banner */}
                <Image
                    source={require("@/assets/images/banner/Home-Sale2.png")}
                    style={styles.banner}
                    contentFit="cover"
                />
                {/* <View style={styles.flashCard}>
          <Text style={styles.flashText}>Deal hot mỗi ngày – giảm đến 50%</Text>
          <TouchableOpacity style={styles.shopNow}>
            <Text style={styles.shopNowText}>Shop Now</Text>
          </TouchableOpacity>
        </View> */}

                {/* <View style={{ ...styles.boxProduct, flex:1 }}> */}
                    {/* Sản phẩm */}
                    <Text style={{ ...styles.sectionTitle, marginTop: hpA(-20) }}>Sản phẩm</Text>

                    <View style={styles.masonryContainer}>
                        {/* Cột trái */}
                        <View style={styles.column}>
                            {products.filter((_, i) => i % 2 === 0).map((item) => (
                                <TouchableOpacity key={item.id} onPress={() => navigateToDetail(item.id)} style={styles.productCard}>
                                    <Image
                                        source={{ uri: getFirstImageUrl(item) || "https://placehold.co/300x400" }}
                                        style={styles.productImage}
                                        contentFit="cover"
                                    />
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <View style={{ height: hpA(0.7), width: "80%", backgroundColor: colors.color1, marginTop: hpA(2), marginBottom: hpA(2) }}></View>
                                    <Text style={styles.productPrice}>{formatVND(item.price)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Cột phải (dịch thấp hơn một chút) */}
                        <View style={[styles.column, { marginTop: hpA(20) }]}>
                            {products.filter((_, i) => i % 2 !== 0).map((item) => (
                                <TouchableOpacity key={item.id} onPress={() => navigateToDetail(item.id)} style={styles.productCard}>
                                    <Image
                                        source={{ uri: getFirstImageUrl(item) || "https://placehold.co/300x400" }}
                                        style={styles.productImage}
                                        contentFit="cover"
                                    />
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <View style={{ height: hpA(0.7), width: "80%", backgroundColor: colors.color1, marginTop: hpA(2), marginBottom: hpA(2) }}></View>

                                    <Text style={styles.productPrice}>{formatVND(item.price)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                {/* </View> */}

                {/* lỗi về 2 cột trong FlatList */}
                {/* <FlatList
                    vertical
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    scrollEnabled={false}
                    contentContainerStyle={styles.productList}
                    renderItem={({ item, index }) => {
                        const isRight = index % 2 !== 0;
                        return (
                            <TouchableOpacity
                                style={[styles.productCard,
                                { marginTop: isRight ? hpA(20) : 0 }]} // so le
                            >
                                <Image source={item.img} style={styles.productImage} contentFit="cover" />
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>{formatVND(item.price)}</Text>
                            </TouchableOpacity>
                        );
                    }}
                /> */}
                {/* <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.productList}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.productCardGrid}>
                            <Image source={item.img} style={styles.productImage} contentFit="cover" />
                            <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>{formatVND(item.price)}</Text>
                        </TouchableOpacity>
                    )}
                /> */}
            </Animated.ScrollView>
            <NavigationBar selected="home" style={{ position: "absolute", bottom: 0, left: 0, right: 0, }} />
        </View>
    );
}

// ===== STYLE =====
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.white, marginTop: topA(40) },

    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: colors.hmee01,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wpA(16),
        paddingVertical: hpA(10),
    },

    username: { ...typography.title3, color: colors.hmee06 },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.icon_square_color,
        borderColor: colors.color1,
        borderRadius: wpA(16),
        paddingHorizontal: wpA(12),
        paddingVertical: hpA(6),
        flex: 1,
        marginHorizontal: wpA(12),
    },

    searchPlaceholder: { ...typography.body2, color: colors.hmee07, marginLeft: wpA(6) },

    scrollContent: { paddingTop: hpA(70), paddingBottom: hpA(20) },

    banner: { width: "100%", height: hpA(150), borderRadius: wpA(10) },

    sectionTitle: { ...typography.headline1, color: colors.color1, marginTop: hpA(8), marginLeft: wpA(12) },

    categoryList: { paddingVertical: hpA(10) },

    categoryItem: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: wpA(16),
        padding: wpA(10),
        marginRight: wpA(8),
        marginTop: hpA(-14),
    },

    categoryIcon: {
        width: wpA(66),
        height: wpA(66),
        marginBottom: hpA(-40),
    },

    categoryText: { ...typography.body3, color: colors.hmee06 },
    // flashSaleSection: { marginTop: hpA(-40) },

    // flashCard: {
    //     backgroundColor: colors.hmee04,
    //     borderRadius: wpA(16),
    //     padding: wpA(16),
    //     marginVertical: hpA(10),
    // },

    // flashText: { ...typography.body2, color: colors.hmee06 },

    // shopNow: {
    //     backgroundColor: colors.hmee06,
    //     borderRadius: wpA(10),
    //     paddingVertical: hpA(6),
    //     paddingHorizontal: wpA(12),
    //     alignSelf: "flex-start",
    //     marginTop: hpA(10),
    // },

    // shopNowText: { ...typography.body3, color: colors.hmee01 },
    masonryContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: wpA(12),
        marginTop: hpA(10),
        backgroundColor: "#f6f3f3ba"
    },
    column: {
        flex: 1,
    },

    productList: { paddingVertical: hpA(10) },

    productCard: {
        backgroundColor: colors.white,
        borderRadius: wpA(12),
        padding: wpA(8),
        marginBottom: hpA(14),
        marginHorizontal: wpA(4),
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    productImage: { width: "100%", height: hpA(160), borderRadius: wpA(8) },

    productName: { ...typography.body2, color: colors.color1, marginTop: hpA(6) },

    productPrice: { ...typography.body1, fontStyle: "bold", color: colors.inside_color_icon_on },
});
