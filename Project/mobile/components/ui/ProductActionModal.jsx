import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { wpA, hpA } from "@/utils/scale";

export default function ProductActionModal({ visible, mode = "cart", product, onClose }) {
  // state
  const [selectedColor, setSelectedColor] = useState(0); // mặc định chọn ảnh đầu tiên
  const [selectedSize, setSelectedSize] = useState("M"); // mặc định size M
  const [quantity, setQuantity] = useState(1);

  const slideAnim = useRef(new Animated.Value(400)).current;

  const buttonLabel = mode === "cart" ? "Thêm vào Giỏ hàng" : "Mua ngay";

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.container,
                {
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Header mini product info */}
              <View style={styles.header}>
                <Image source={product.image} style={styles.productImage} contentFit="cover" />
                <View style={{ flex: 1, marginLeft: wpA(12) }}>
                  <Text style={[typography.title3, { color: colors.hmee04, fontWeight: "600" }]}>
                    {product.price}đ
                  </Text>
                  <Text
                    style={[
                      typography.body2,
                      { color: colors.hmee07, textDecorationLine: "line-through", marginTop: hpA(4) },
                    ]}
                  >
                    {product.oldPrice}đ
                  </Text>
                  <Text style={[typography.caption1, { color: colors.hmee06, marginTop: hpA(4) }]}>
                    Kho: {product.stock}
                  </Text>
                </View>
              </View>

              {/* Color options */}
              <Text style={[typography.headline1, styles.sectionTitle]}>Màu sắc</Text>
              <View style={styles.colorRow}>
                {product.colors.map((item, index) => {
                  const isActive = selectedColor === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => setSelectedColor(index)}
                      activeOpacity={0.8}
                      style={[
                        styles.colorBox,
                        isActive && styles.colorBoxActive,
                      ]}
                    >
                      <Image
                        source={item.image}
                        style={styles.colorImage}
                        contentFit="cover"
                      />

                      {/* Tick overlay khi chọn */}
                      {isActive && (
                        <View style={styles.tickOverlay}>
                          <Image
                            source={require("@/assets/icons/navigation/Tick-On.png")}
                            style={{ width: "100%", height: "100%", }}
                          // resizeMode="contain"
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Size options */}
              <Text style={[typography.headline1, styles.sectionTitle]}>Size</Text>
              <View style={styles.sizeRow}>
                {product.sizes.map((size) => {
                  const isActive = selectedSize === size;
                  return (
                    <TouchableOpacity
                      key={size}
                      onPress={() => setSelectedSize(size)}
                      activeOpacity={0.8}
                      style={[
                        styles.sizeBox,
                        isActive && styles.sizeBoxActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          isActive && styles.sizeTextActive,
                        ]}
                      >
                        {size}
                      </Text>
                     
                    </TouchableOpacity>
                  );
                })}
              </View>


              {/* Quantity */}
              <Text style={[typography.headline1, styles.sectionTitle, { marginTop: hpA(20) }]}>Số lượng</Text>
              <View style={styles.qtyContainer}>
                <TouchableOpacity onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} style={styles.qtyBtn}>
                  <Text style={typography.title3}>-</Text>
                </TouchableOpacity>
                <Text style={typography.title3}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                  <Text style={typography.title3}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Action Button */}
              <TouchableOpacity style={styles.actionButton} onPress={onClose}>
                <LinearGradient
                  {...colors.hmee06}
                  // start={{ x: 0, y: 0 }}
                  // end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <Text style={[typography.label1, { color: colors.hmee01, fontWeight: "600" }]}>
                    {buttonLabel}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: wpA(20),
    borderTopRightRadius: wpA(20),
    paddingHorizontal: wpA(20),
    paddingTop: hpA(20),
    paddingBottom: hpA(30),
    elevation: 8,

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hpA(12),
  },
  productImage: {
    width: wpA(70),
    height: wpA(70),
    borderRadius: wpA(10),
  },
  sectionTitle: {
    marginTop: hpA(14),
    marginBottom: hpA(8),
  },
  colorRow: {
    flexDirection: "row",
    // flexWrap: "wrap",
    gap: wpA(10),
    marginTop: hpA(6),
  },

  colorBox: {
    width: wpA(55),
    height: wpA(55),
    borderRadius: wpA(12),
    // overflow: "hidden",
    // borderWidth: 1,
    // borderColor: colors.hmee07,
    // position: "relative",
  },

  colorBoxActive: {
    borderColor: colors.white,
    // borderWidth: 2,
  },

  colorImage: {
    width: wpA(48),
    height: hpA(48),
    borderRadius: wpA(6),
  },

  tickOverlay: {

    position: "absolute",
    top: wpA(-10),
    left: wpA(30),
    right: wpA(-20),
    bottom: wpA(5),
    elevation: 5,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: wpA(30),
    padding: wpA(2),
    width: wpA(25),
    height: hpA(25),
  },

  sizeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wpA(10),
    marginTop: hpA(6),
  },

  sizeBox: {
    // borderWidth: 1,
    // borderColor: colors.black,
    borderRadius: wpA(10),
    paddingVertical: hpA(6),
    paddingHorizontal: wpA(14),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray,
  },

  sizeBoxActive: {
    // borderColor: colors.inside_color_icon_on,
    backgroundColor: colors.icon_square_color,
  },

  sizeText: {
    ...typography.body2,
    color: colors.black,
  },

  sizeTextActive: {
    color: colors.color1,
    // fontWeight: "600",
  },

  colorOption: {
    width: wpA(50),
    height: wpA(50),
    borderRadius: wpA(10),
    marginRight: wpA(10),
  },
  colorSelected: {
    borderWidth: 2,
    borderColor: colors.hmee04,
  },
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wpA(10),
  },
  // sizeBox: {
  //   borderWidth: 1,
  //   borderColor: colors.hmee07,
  //   borderRadius: wpA(8),
  //   paddingVertical: hpA(6),
  //   paddingHorizontal: wpA(14),
  // },
  qtyContainer: {
    position: "absolute",
    left: wpA(250),
    top: hpA(305),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: wpA(14),
    marginBottom: hpA(0),
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: colors.hmee07,
    borderRadius: wpA(20),
    paddingHorizontal: wpA(12),
    paddingVertical: hpA(4),
  },
  actionButton: {
    marginTop: hpA(16),
  },
  gradient: {
    paddingVertical: hpA(14),
    borderRadius: wpA(12),
    alignItems: "center",
    // justifyContent: "center",
    // alignSelf: "center",
    // width: wpA(200),
  },
});
