import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LoadingIcon from "./LoadingIcon";
import ButtonCategory from "./ButtonCategory";
import NavigationIcon from "./NavigationIcon";
import CheckboxRadio from "./CheckboxRadio";
import ToggleSwitch from "./ToggleSwitch";
import Counter from "./Counter";
import ScrollSlider from "./ScrollSlider";

export default function FunctionalIconsPreview() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>1. Functional Icons</Text>

      <LoadingIcon status="loading" />
      <ButtonCategory label="Men" />
      <NavigationIcon icon="home" variant="on" />
      <CheckboxRadio type="checkbox" />
      <ToggleSwitch />
      <Counter />
      <ScrollSlider />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
});
