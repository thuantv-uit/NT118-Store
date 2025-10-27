import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function MenuSwitch({ items }) {
  const [active, setActive] = useState(items[0].id);

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? colors.hmee04 : colors.white,
                borderColor: colors.hmee04,
              },
            ]}
            onPress={() => setActive(item.id)}
          >
            <Text
              style={{
                color: isActive ? colors.white : colors.hmee04,
                fontWeight: "600",
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginVertical: 12,
  },
  button: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
});
