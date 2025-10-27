import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { colors } from "../../theme/colors";

export default function ScrollSlider({ value = 50, onChange }) {
  const [val, setVal] = useState(value);

  return (
    <View style={styles.container}>
      <Slider
        value={val}
        onValueChange={(v) => {
          setVal(v);
          onChange?.(v);
        }}
        minimumValue={0}
        maximumValue={100}
        minimumTrackTintColor={colors.hmee04}
        maximumTrackTintColor={colors.hmee02}
        thumbTintColor={colors.hmee04}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "90%", alignSelf: "center" },
});
