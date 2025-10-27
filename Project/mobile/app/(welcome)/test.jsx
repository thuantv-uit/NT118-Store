// import React from "react";
// import { View, StyleSheet, Text } from "react-native";
// import MaskedView from "@react-native-masked-view/masked-view";
// import { LinearGradient } from "expo-linear-gradient";
// import Cone1 from "../../assets/images/decor/cone1.svg";

// export default function Test() {
//   return (
//     <View style={styles.container}>
//       <MaskedView
//         style={styles.maskGroup}
//         maskElement={
//           // chữ HELLO làm vùng mask
//           <View style={styles.maskWrapper}>
//             <Text style={styles.maskText}>HELLO</Text>
//             <Cone1 width={100} height={100} />
//           </View>
//         }
//       >
//         {/* Vùng bị cắt theo chữ HELLO */}
//         {/* <View style={styles.fill} /> */}
//         <LinearGradient
//           colors={["#FF8C8C", "#FFD700", "#90EE90", "#00BFFF", "#8A2BE2"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.fill}
//         />
//       </MaskedView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#F3F3F3",
//   },
//   maskGroup: {
//     width: 400,
//     height: 200,
//   },
//   maskWrapper: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   maskText: {
//     fontSize: 70,
//     fontWeight: "bold",
//     color: "black", // Mask bắt buộc phải có alpha (đen = vùng hiển thị)
//   },
//   fill: {
//     flex: 1,
//     // backgroundColor: "#FF8C8C", // chỉ màu phẳng
//   },
// });
import React from "react";
import { View, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import DecorCone from "../../components/decor/Decor";
// import { Canvas, Paint, BlendMode } from "@shopify/react-native-skia";


export default function DecorConeFix() {
  return (
    <View style={styles.container}>

      {/* 🟠 Lớp khối 3D thật */}
      <Image
        source={require("../../assets/images/decor/cone1.png")}
        style={styles.cone3D}
        contentFit="cover"
      />

      {/* 🟣 Lớp ánh sáng — bị cắt theo mask alpha của cone1.png */}
      <MaskedView
        style={styles.maskGroup}
        maskElement={
          <Image
            source={require("../../assets/images/decor/cone1.png")} // mask PNG (đen vùng cần hiện)
            style={styles.maskImage}
            contentFit="cover"
          />
        }
      >
        {/* <LinearGradient
          colors={["#ff9d9dff", "#ffb3b3ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientFill}


        /> */}
        <Image
          source={require("../../assets/images/decor/back.png")} // ánh sáng PNG (trắng vùng cần hiện)
          style={styles.gradientFill}
          contentFit="cover"
        />
      </MaskedView>

      <DecorCone type="cone1" style={{ position: "absolute", top: 200, left: 150 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#FDEFEF",
    flex: 1,
  },
 
  cone3D: {
    position: "absolute",
    width: 100,
    height: 100,
    elevation: 8, // chỉ có tác dụng trên Android để tạo bóng
  },
  maskGroup: {
    position: "absolute",
    width: 100,
    height: 100,
    elevation: 8,
  },
  maskImage: {
    width: "100%",
    height: "100%",
    elevation: 8,
  },
  gradientFill: {
    width: "100%",
    height: "100%",
    // backgroundBlendMode:'hard-lighten',
    // mixBlendMode: 'hard-lighten',
    opacity: 0.7,
    elevation: 8, // ánh sáng nhẹ hơn để nhìn rõ khối thật bên dưới
  },
});
