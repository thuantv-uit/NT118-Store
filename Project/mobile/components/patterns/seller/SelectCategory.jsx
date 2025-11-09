import React, { useEffect, useState, useRef, useRouter } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from "react-native";
import { API_URL } from "@/constants/api";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { wpA, hpA } from "@/utils/scale";
import { Icon } from "@/components/ui/icon";

export default function SelectCategory({ onSelect }) {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const cacheRef = useRef({});
  // const router = useRouter();



  // Fetch danh mục chính
  const fetchMain = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      const roots = data.filter((item) => item.parent_id === null);
      setMainCategories(roots);
      if (roots.length > 0) {
        setSelectedMain(roots[0]);
        fetchSub(roots[0].id);
      }
    } catch (err) {
      console.error("Fetch main categories error:", err);
    }
  };

  // Fetch danh mục con
  // const fetchSub = async (parentId) => {
  //   try {
  //     Animated.timing(fadeAnim, {
  //       toValue: 0,
  //       duration: 150,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       fetch(`${API_URL}/categories/children/${parentId}`)
  //         .then((res) => res.json())
  //         .then((data) => {
  //           setSubCategories(data);
  //           Animated.timing(fadeAnim, {
  //             toValue: 1,
  //             duration: 200,
  //             useNativeDriver: true,
  //           }).start();
  //         });
  //     });
  //   } catch (err) {
  //     console.error("Fetch sub categories error:", err);
  //   }
  // };
  const fetchSub = async (parentId) => {
    // ✅ Kiểm tra cache trước
    if (cacheRef.current[parentId]) {
      setSubCategories(cacheRef.current[parentId]);
      return; // Không cần fetch nữa
    }

    try {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(async () => {
        const res = await fetch(`${API_URL}/categories/children/${parentId}`);
        const data = await res.json();

        // ✅ Lưu vào cache
        cacheRef.current[parentId] = data;

        setSubCategories(data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } catch (err) {
      console.error("Fetch sub categories error:", err);
    }
  };


  useEffect(() => {
    fetchMain();
  }, []);

  const handleMainSelect = (cat) => {
    setSelectedMain(cat);
    fetchSub(cat.id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chọn danh mục</Text>
        <TouchableOpacity>
          <Icon name="search" size={wpA(20)} color={colors.hmee04} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Cột trái */}
        <FlatList
          data={mainCategories}
          keyExtractor={(item) => item.id.toString()}
          style={styles.leftCol}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.leftItem,
                item.id === selectedMain?.id && styles.leftItemActive,
              ]}
              onPress={() => handleMainSelect(item)}
            >
              <Text
                style={[
                  styles.leftText,
                  item.id === selectedMain?.id && styles.leftTextActive,
                ]}
              >
                {item.name}
              </Text>
              {item.id === selectedMain?.id && (
                <View style={styles.activeBar} />
              )}
            </TouchableOpacity>
          )}
        />

        {/* Cột phải */}
        <Animated.View style={[styles.rightCol, { opacity: fadeAnim }]}>
          <FlatList
            data={subCategories}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: hpA(20) }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.rightItem}
                activeOpacity={0.7}
                // onPress={() => {
                //   // Lưu danh mục con được chọn
                //   onSelect?.(item);

                //   // Quay lại màn trước (hoặc về màn product-create)
                //   router.back();
                // }}
                onPress={() => onSelect?.(item)}

              >
                <Text style={styles.rightText}>{item.name}</Text>
                <Icon
                  name="chevron-right"
                  size={wpA(16)}
                  color={colors.hmee06}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Không có danh mục con</Text>
              </View>
            }
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.,
    // ...typography.headline1,
    marginTop: hpA(50),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wpA(20),
    paddingTop: hpA(20),
    paddingBottom: hpA(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.hmee03,
    backgroundColor: colors.icon_square_color,
  },
  headerTitle: {
    ...typography.label1,
    color: colors.color1,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  leftCol: {
    width: "38%",
    backgroundColor: colors.hmee02,
  },
  rightCol: {
    width: "62%",
    backgroundColor: colors.hmee01,
  },
  leftItem: {
    padding: wpA(10),
    marginLeft: wpA(20),
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hpA(14),
    // borderBottomWidth: 1,
    borderRadius: 10,
    // borderBottomColor: colors.black,
    backgroundColor: colors.white,
    position: "relative",
  },
  leftItemActive: {
    backgroundColor: colors.gray,
  },
  leftText: {
    ...typography.body,
    color: colors.black,
  },
  leftTextActive: {
    color: colors.color1,
    fontWeight: "700",
  },
  activeBar: {
    position: "absolute",
    left: 0,
    width: wpA(3),
    height: "100%",
    backgroundColor: colors.color1,
  },
  rightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.hmee03,
    paddingVertical: hpA(14),
    paddingHorizontal: wpA(16),
  },
  rightText: {
    ...typography.body,
    color: colors.hmee07,
  },
  empty: {
    alignItems: "center",
    paddingVertical: hpA(20),
  },
  emptyText: {
    ...typography.caption,
    color: colors.hmee06,
  },
});
