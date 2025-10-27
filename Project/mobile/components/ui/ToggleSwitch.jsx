// components/icons/ToggleSwitch.jsx
import React, { useState } from "react";
import { View, Animated, TouchableOpacity, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export default function ToggleSwitch({ variant = "off", onToggle }) {
  const [isOn, setIsOn] = useState(variant === "on");

  const toggle = () => {
    setIsOn(!isOn);
    onToggle?.(!isOn);
  };

  return (
    <TouchableOpacity
      onPress={toggle}
      style={[
        styles.track,
        { backgroundColor: isOn ? colors.hmee04 : colors.hmee02 },
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            transform: [{ translateX: isOn ? 20 : 0 }],
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 26,
    borderRadius: 13,
    padding: 2,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },
});


// import React, { useState } from "react";
// import { TouchableOpacity, View, Animated, StyleSheet } from "react-native";
// import { colors } from "../../theme/colors";

// export default function ToggleSwitch({ variant = "off", onToggle }) {
//   const [on, setOn] = useState(variant === "on");
//   const anim = new Animated.Value(on ? 1 : 0);

//   const toggle = () => {
//     Animated.timing(anim, {
//       toValue: on ? 0 : 1,
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//     setOn(!on);
//     onToggle?.(!on);
//   };

//   const translateX = anim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [2, 22],
//   });

//   return (
//     <TouchableOpacity
//       onPress={toggle}
//       style={[
//         styles.track,
//         { backgroundColor: on ? colors.hmee04 : colors.hmee02 },
//       ]}
//     >
//       <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   track: {
//     width: 50,
//     height: 26,
//     borderRadius: 13,
//     padding: 2,
//   },
//   thumb: {
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: "#fff",
//   },
// });
