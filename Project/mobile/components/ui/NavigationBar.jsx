import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function NavigationBar({ onTabChange }) {
  const [active, setActive] = useState("home");

  const tabs = [
    { id: "home", icon: "home-outline", label: "Home" },
    { id: "cart", icon: "cart-outline", label: "Cart" },
    { id: "wishlist", icon: "heart-outline", label: "Wishlist" },
    { id: "profile", icon: "person-outline", label: "Profile" },
  ];

  const handlePress = (id) => {
    setActive(id);
    onTabChange?.(id);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handlePress(tab.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={tab.icon}
              size={26}
              color={isActive ? colors.hmee04 : colors.hmee01}
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
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.hmee02,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "relative",
  },
  activeLine: {
    position: "absolute",
    bottom: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.hmee04,
  },
});
