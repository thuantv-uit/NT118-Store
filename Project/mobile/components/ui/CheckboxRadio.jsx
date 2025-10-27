import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function CheckboxRadio({
  type = "checkbox", // "checkbox" | "radio"
  checked: propChecked,
  onChange,
}) {
  const [checked, setChecked] = useState(propChecked || false);
  const toggle = () => {
    const newState = !checked;
    setChecked(newState);
    onChange?.(newState);
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { borderRadius: type === "radio" ? 50 : 8 },
      ]}
      onPress={toggle}
    >
      {checked && <View style={styles.inner} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: colors.hmee04,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 14,
    height: 14,
    backgroundColor: colors.hmee04,
    borderRadius: 50,
  },
});
