// import React from "react";
// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import { Image } from "expo-image";
// import { wpA, hpA } from "@/utils/scale";
// import { colors } from "../../theme/colors";
// import { typography } from "@/theme/typography";
// import { theme } from "@/theme";

// import { LinearGradient } from "expo-linear-gradient";


// export default function FlashSaleSection({ data = [], onViewAll }) {
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerRow}>
//         <View style={styles.titleGroup}>
//           <Text style={styles.title}>FLASH SALE</Text>
//           <View style={styles.timerBox}>
//             <Text style={styles.timerText}>00</Text>
//             <Text style={styles.timerText}>44</Text>
//             <Text style={styles.timerText}>42</Text>
//           </View>
//         </View>

//         <TouchableOpacity onPress={onViewAll}>
//           <Text style={styles.viewAll}>Xem tất cả &gt;</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Danh sách sản phẩm */}
//       <FlatList
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         data={data}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={{ paddingVertical: hpA(10) }}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.discountTag}>
//               <Text style={styles.discountText}>-{item.discount}%</Text>
//             </View>
//             <Image source={item.image} style={styles.image} contentFit="cover" />

//             <Text style={styles.name} numberOfLines={2}>
//               {item.name}
//             </Text>

//             <Text style={styles.price}>{item.price}đ</Text>

//             <View
//               style={[
//                 styles.badge,
//                 {
//                   backgroundColor:
//                     item.status === "hot"
//                       ? colors.hmee04
//                       : colors.hmee03,
//                 },
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.badgeText,
//                   {
//                     color:
//                       item.status === "hot"
//                         ? colors.hmee07
//                         : colors.hmee06,
//                   },
//                 ]}
//               >
//                 {item.status === "hot" ? "CHỈ CÒN 2" : "ĐANG BÁN CHẠY"}
//               </Text>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { marginTop: hpA(10), paddingHorizontal: wpA(12) },

//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: hpA(6),
//   },
//   titleGroup: { flexDirection: "row", alignItems: "center", gap: wpA(6) },
//   title: { ...typography.title3, color: colors.hmee07 },
//   timerBox: { flexDirection: "row", gap: wpA(4) },
//   timerText: {
//     backgroundColor: colors.hmee07,
//     color: colors.white,
//     borderRadius: wpA(4),
//     paddingHorizontal: wpA(4),
//     ...typography.body3,
//   },
//   viewAll: { ...typography.body3, color: colors.hmee07 },

//   card: {
//     backgroundColor: colors.white,
//     width: wpA(150),
//     borderRadius: wpA(10),
//     marginRight: wpA(10),
//     padding: wpA(8),
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   image: {
//     width: "100%",
//     height: hpA(100),
//     borderRadius: wpA(8),
//   },
//   name: {
//     ...typography.body3,
//     color: colors.hmee06,
//     marginTop: hpA(2),
//     height: hpA(20),
//   },
//   price: {
//     ...typography.body2,
//     color: colors.hmee07,
//     marginTop: hpA(4),
//     // alignSelf: "center",
//   },
//   discountTag: {
//     position: "absolute",
//     top: wpA(4),
//     right: wpA(4),
//     backgroundColor: colors.icon_square_color,
//     borderRadius: wpA(6),
//     zIndex: 2,
//   },
//   discountText: {
//     ...typography.body4,
//     color: colors.inside_color_icon_on,
//     paddingHorizontal: wpA(4),
//     paddingVertical: hpA(2),
//   },
//   badge: {
//     marginTop: hpA(6),
//     borderRadius: wpA(8),
//     paddingVertical: hpA(3),
//     alignItems: "center",
//     backgroundColor: colors.main_color,
//   },
//   badgeText: {
//     ...typography.body3,
//   },
// });
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { wpA, hpA } from "@/utils/scale";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { LinearGradient } from "expo-linear-gradient";

export default function FlashSaleSection({ data = [], onViewAll }) {
  // Countdown (giả lập)
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 44, s: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (v) => String(v).padStart(2, "0");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.flashText}>FLASH SALE</Text>
          <View style={styles.timerBox}>
            <Text style={styles.timer}>{format(timeLeft.h)}</Text>
            <Text style={styles.timer}>{format(timeLeft.m)}</Text>
            <Text style={styles.timer}>{format(timeLeft.s)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>Xem tất cả &gt;</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingVertical: hpA(10) }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.discountTag}>
              <Text style={styles.discountText}>-{item.discount}%</Text>
            </View>

            <Image source={item.image} style={styles.image} contentFit="cover" />

            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>

            <Text style={styles.price}>{item.price}đ</Text>
            {/* 
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.status === "hot"
                      ?( <LinearGradient
                          colors={colors.hmee04}
                          style={styles.gradient}
                        />)
                      : (<LinearGradient
                          colors={colors.hmee03}
                          style={styles.gradient}
                        />),

                    
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      item.status === "hot" ? colors.inside_color_icon_on : colors.black,
                  },
                ]}
              >
                {item.status === "hot" ? "CHỈ CÒN 2" : "ĐANG BÁN CHẠY"}
              </Text>
            </View> */}
            {item.status === "hot" ? (
              
              <LinearGradient {...colors.hmee06} style={styles.badge}>
                <Image source={require("@/assets/icons/ui/hot.png")} style={styles.imageTag} contentFit="cover" />
                <Text style={[styles.badgeText, { color: colors.black }]}>
                  CHỈ CÒN 2
                </Text>
              </LinearGradient>
            ) : (
              <LinearGradient {...colors.hmee06} style={styles.badge}>
                <Text style={[styles.badgeText, { color: colors.black }]}>
                  ĐANG BÁN CHẠY
                </Text>
              </LinearGradient>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: hpA(10), paddingHorizontal: wpA(12) },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hpA(6),
  },
  titleGroup: { flexDirection: "row", alignItems: "center", gap: wpA(6) },
  flashText: { ...typography.headline1, color: colors.color1 },
  timerBox: { flexDirection: "row", gap: wpA(4) },
  timer: {
    backgroundColor: colors.icon_square_color,
    color: colors.color1,
    ...typography.caption1,
    borderRadius: wpA(4),
    paddingHorizontal: wpA(5),
    paddingVertical: hpA(2),
    // ...typography.body3,
  },
  viewAll: { ...typography.body3, color: colors.hmee07 },

  card: {
    backgroundColor: colors.white,
    width: wpA(150),
    borderRadius: wpA(10),
    marginRight: wpA(10),
    padding: wpA(8),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginTop: hpA(-16),
  },
  discountTag: {
    position: "absolute",
    top: wpA(4),
    right: wpA(4),
    backgroundColor: colors.icon_square_color,
    borderRadius: wpA(6),
    zIndex: 2,
  },
  discountText: {
    ...typography.caption1,
    color: colors.inside_color_icon_on,
    paddingHorizontal: wpA(4),
    paddingVertical: hpA(2),
  },
  image: {
    width: "100%",
    height: hpA(120),
    borderRadius: wpA(8),
  },
  name: {
    ...typography.body3,
    color: colors.hmee06,
    marginTop: hpA(6),
    height: hpA(20),
  },
  price: {
    ...typography.body2,
    color: colors.hmee07,
    marginTop: hpA(4),
  },
  badge: {
    marginTop: hpA(6),
    borderRadius: wpA(8),
    paddingVertical: hpA(3),
    alignItems: "center",
  },
  badgeText: {
    ...typography.body4,
  },
  imageTag: {
    position: "absolute",
    top: hpA(-2),
    left: wpA(0),
    width: wpA(25),
    height: hpA(25),
    marginBottom: hpA(0),
    zIndex: 2,
  },
});
