import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LoadingIcon from "../../components/ui/LoadingIcon";
import ButtonCategory from "../../components/ui/ButtonCategory";
import NavigationIcon from "../../components/ui/NavigationIcon";
import CheckboxRadio from "../../components/ui/CheckboxRadio";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import Counter from "../../components/ui/Counter";
import ScrollSlider from "../../components/ui/ScrollSlider";
import NavigationBar from "../../components/ui/NavigationBar";

export default function FunctionalIconsPreview() {
  console.log({
  LoadingIcon,
  ButtonCategory,
  NavigationIcon,
  CheckboxRadio,
  ToggleSwitch,
  Counter,
  ScrollSlider,
});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>1. Functional Icons</Text>

      {/* <LoadingIcon status="loading" /> */}
      {/* <ButtonCategory label="Men" /> */}
      {/* <NavigationIcon icon="home" variant="on" /> */}
      {/* <CheckboxRadio type="checkbox" /> */}
      <NavigationBar selected="home" />

      <ToggleSwitch />
      <Counter />
      <ScrollSlider />
    </View>
    
  );
}

const styles = StyleSheet.create({
  // container: { padding: 20, gap: 16 },
  title: { fontSize: 28, fontWeight: "700" },
});
