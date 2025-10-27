import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function Counter({ initial = 1, min = 0, max = 10 }) {
  const [count, setCount] = useState(initial);

  const increment = () => setCount(Math.min(max, count + 1));
  const decrement = () => setCount(Math.max(min, count - 1));

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrement}>
        <Ionicons name="remove-circle-outline" size={32} color={colors.hmee04} />
      </TouchableOpacity>
      <Text style={styles.text}>{count}</Text>
      <TouchableOpacity onPress={increment}>
        <Ionicons name="add-circle-outline" size={32} color={colors.hmee04} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 12 },
  text: { fontSize: 20, color: colors.hmee04, fontWeight: "600" },
});
