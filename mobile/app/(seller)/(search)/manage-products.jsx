import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../../constants/api";

const pastel = { start: "#F7BCD3", end: "#9AD6DF" };

const Card = ({ item, onPress }) => {
  const firstVariant = item.variants?.[0];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }] }>
      <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: "#f7bcd3", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: "rgba(154,214,223,0.45)" }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: "#0f172a" }}>{item.name}</Text>
        <Text style={{ marginTop: 4, color: "#475569", fontSize: 13 }} numberOfLines={2}>{item.description}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="cube-outline" size={16} color="#0f766e" />
            <Text style={{ marginLeft: 6, color: "#0f172a", fontWeight: "700" }}>SKU: {item.SKU}</Text>
          </View>
          {firstVariant ? (
            <Text style={{ color: "#f7729a", fontWeight: "800" }}>{firstVariant.price?.toLocaleString?.("vi-VN") || firstVariant.price} đ</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

export default function ManageProducts() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/product`);
      if (!res.ok) throw new Error(`Fetch products failed ${res.status}`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      setError(err.message || "Lỗi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && userId) load();
  }, [isLoaded, userId]);

  const mine = useMemo(() => {
    return (products || []).filter((p) => p.customer_id === userId);
  }, [products, userId]);

  const renderItem = ({ item }) => (
    <Card item={item} onPress={() => router.push({ pathname: "/(seller)/(search)/product-edit", params: { id: item.id } })} />
  );

  if (!isLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator color="#f7729a" size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LinearGradient colors={[pastel.start, pastel.end]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 14 }}>
        <Pressable onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>
        <Text style={{ fontSize: 22, fontWeight: "900", color: "#0f172a" }}>Quản lý sản phẩm</Text>
        <Text style={{ marginTop: 4, color: "#1f2937", fontWeight: "600" }}>Danh sách sản phẩm bạn đã tạo</Text>
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color="#f7729a" size="large" />
          <Text style={{ marginTop: 8, color: "#475569" }}>Đang tải sản phẩm...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <Text style={{ color: "#b91c1c", fontWeight: "700", marginBottom: 8 }}>Lỗi</Text>
          <Text style={{ color: "#475569", textAlign: "center" }}>{error}</Text>
          <Pressable onPress={load} style={({ pressed }) => [{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: pressed ? "#e85d88" : "#f7729a" }]}>
            <Text style={{ color: "#fff", fontWeight: "800" }}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          data={mine}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: "#475569", fontWeight: "600" }}>Chưa có sản phẩm nào bạn tạo.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
