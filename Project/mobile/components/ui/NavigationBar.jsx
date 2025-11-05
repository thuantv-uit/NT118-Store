import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { colors } from "../../theme/colors";
import { wpA, hpA } from "../../utils/scale";

export default function NavigationBar({ onTabChange }) {
  const [active, setActive] = useState("home");

  const tabs = [
    {
      id: "home",
      iconDefault: require("../../assets/icons/navigation/Home-Off.png"),
      iconActive: require("../../assets/icons/navigation/Home-On.png"),
    },
    {
      id: "category",
      iconDefault: require("../../assets/icons/navigation/Category-Off.png"),
      iconActive: require("../../assets/icons/navigation/Category-On.png"),
    },
    {
      id: "cart",
      iconDefault: require("../../assets/icons/navigation/Cart-Off.png"),
      iconActive: require("../../assets/icons/navigation/Cart-On.png"),
    },
    {
      id: "wishlist",
      iconDefault: require("../../assets/icons/navigation/Wishlist-Off.png"),
      iconActive: require("../../assets/icons/navigation/Wishlist-On.png"),
    },
    {
      id: "profile",
      iconDefault: require("../../assets/icons/navigation/Profile-Off.png"),
      iconActive: require("../../assets/icons/navigation/Profile-On.png"),
    },
  ];

  const handlePress = (id) => {
    setActive(id);
    onTabChange?.(id);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        const iconSource = isActive ? tab.iconActive : tab.iconDefault;

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handlePress(tab.id)}
            activeOpacity={0.8}
          >
            <Image
              source={iconSource}
              style={[
                styles.icon,
                {
                  width: wpA(28),
                  height: wpA(28),
                  // tintColor: isActive
                  //   ? colors.dark_mode_icon_square
                  //   : colors.color1,
                },
              ]}
              contentFit="contain"
            />
            {isActive && <View style={styles.activeLine} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.icon_square_color,
    // borderRadius: wpA(24),
    // paddingVertical: hpA(10),
    // marginHorizontal: wpA(16),
    // marginBottom: hpA(20),
    // elevation: 5,
    paddingTop: hpA(10),
    paddingBottom: hpA(18),
    paddingLeft: wpA(15),
    paddingRight: wpA(15),
    gap: wpA(22),
    width: wpA(412),
    height: hpA(55),
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: wpA(60),
    position: "relative",
  },
  icon: {
    resizeMode: "contain",
    height: hpA(24),
  },
  activeLine: {
    position: "absolute",
    bottom: 0,
    width: wpA(28),
    height: hpA(3),
    borderRadius: hpA(2),
    backgroundColor: colors.dark_mode_icon_square,
  },
});
