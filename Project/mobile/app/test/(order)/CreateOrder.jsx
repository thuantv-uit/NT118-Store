// import { useUser } from "@clerk/clerk-expo";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useEffect, useState } from "react";
// import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { API_URL } from "../../constants/api";
// import { COLORS } from "../../constants/colors";

// const CreateOrder = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   const { paymentId, amount: paramAmount, shipmentId, cartIds } = useLocalSearchParams(); // Lấy từ params
//   const [payment, setPayment] = useState(null);
//   const [shipment, setShipment] = useState(null);
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!user?.id || !shipmentId || !paymentId) {
//       setError("Thiếu thông tin cần thiết.");
//       setIsLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         setError(null);

//         // Fetch payment by id để lấy amount chính thức
//         const paymentResponse = await fetch(`${API_URL}/payment/${paymentId}`);
//         if (!paymentResponse.ok) {
//           throw new Error("Failed to fetch payment");
//         }
//         const paymentData = await paymentResponse.json();
//         setPayment(paymentData);

//         // Fetch shipment by id
//         const shipmentResponse = await fetch(`${API_URL}/shipment/${shipmentId}`);
//         if (!shipmentResponse.ok) {
//           throw new Error("Failed to fetch shipment");
//         }
//         const shipmentData = await shipmentResponse.json();
//         setShipment(shipmentData);

//         // Fetch carts của user
//         const cartResponse = await fetch(`${API_URL}/cart/${user.id}`);
//         if (!cartResponse.ok) {
//           throw new Error("Failed to fetch cart");
//         }
//         const allCarts = await cartResponse.json();

//         const itemsWithProducts = await Promise.all(
//           allCarts.map(async (cart) => {
//             const productResponse = await fetch(`${API_URL}/product/${cart.product_id}`);
//             if (!productResponse.ok) {
//               console.warn(`Failed to fetch product ${cart.product_id}`);
//               return { ...cart, name: "Unknown Product", price: 0 };
//             }
//             const product = await productResponse.json();
//             return {
//               ...cart,
//               name: product.name || "Unnamed Product",
//               price: product.price || 0,
//             };
//           })
//         );

//         // Filter chỉ selected items theo cartIds
//         const selectedCartIds = cartIds ? cartIds.split(',') : [];
//         const selectedItems = itemsWithProducts.filter(item => selectedCartIds.includes(item.id.toString()));
//         setCartItems(selectedItems || []);
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching order data:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [user?.id, shipmentId, paymentId, cartIds]);

//   const handleBack = () => {
//     router.back();
//   };

//   const handleConfirmOrder = async () => {
//     if (!user?.id || cartItems.length === 0) {
//       Alert.alert("Lỗi", "Không thể tạo đơn hàng.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const orderDate = new Date().toISOString();
//       // Sử dụng cart_id đầu tiên (nếu backend chỉ hỗ trợ một, có thể adjust hoặc update backend để multiple)
//       const cartId = cartItems[0]?.id;

//       const response = await fetch(`${API_URL}/order`, { // Giả định route POST /order
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           order_date: orderDate,
//           payment_id: parseInt(paymentId),
//           customer_id: user.id,
//           shipment_id: parseInt(shipmentId),
//           cart_id: cartId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Lỗi: ${response.statusText}`);
//       }

//       const order = await response.json();
//       Alert.alert("Thành công", `Đơn hàng ${order.id} đã được tạo!`);
      
//       // Sau thành công, có thể clear cart và navigate về trang chính
//       // Ví dụ: router.push('/OrderSuccess');
//       router.push('/'); // Hoặc trang chính
//     } catch (err) {
//       Alert.alert("Lỗi", err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
//       </View>
//     );
//   }

//   if (error || !shipment || !payment) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error || "Không tìm thấy thông tin cần thiết."}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
//           <Text style={styles.retryButtonText}>Quay lại</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const total = payment.amount; // Lấy từ payment

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Xác Nhận Đơn Hàng</Text>
//         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//           <Text style={styles.backButtonText}>← Quay lại</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Thông tin thanh toán */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Thanh toán</Text>
//         <Text style={styles.infoText}>Số tiền: ${total}</Text>
//         <Text style={styles.infoText}>Phương thức: {payment.payment_method}</Text>
//         <Text style={styles.infoText}>ID Thanh toán: {paymentId}</Text>
//       </View>

//       {/* Thông tin vận chuyển */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Vận chuyển</Text>
//         <Text style={styles.infoText}>Địa chỉ: {shipment.address}, {shipment.city}, {shipment.state}, {shipment.country} {shipment.zipcode}</Text>
//         <Text style={styles.infoText}>ID Vận chuyển: {shipmentId}</Text>
//       </View>

//       {/* Thông tin giỏ hàng */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Giỏ hàng ({cartItems.length} món)</Text>
//         {cartItems.map((item) => (
//           <View key={item.id} style={styles.itemRow}>
//             <Text style={styles.itemName}>{item.name}</Text>
//             <Text style={styles.itemDetail}>${item.price} x {item.quantity} = ${(item.price * item.quantity)}</Text>
//           </View>
//         ))}
//         <Text style={styles.totalText}>Tổng: ${total}</Text>
//       </View>

//       {error && <Text style={styles.errorText}>{error}</Text>}

//       <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder} disabled={isLoading}>
//         <Text style={styles.confirmButtonText}>Xác nhận đặt hàng</Text>
//       </TouchableOpacity>

//       <Text style={styles.dateText}>Ngày đặt hàng: {new Date().toLocaleString()}</Text>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.primary,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.white,
//   },
//   backButton: {
//     paddingVertical: 4,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: COLORS.white,
//     fontWeight: "500",
//   },
//   section: {
//     backgroundColor: COLORS.white,
//     padding: 16,
//     margin: 8,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 14,
//     color: COLORS.text,
//     marginBottom: 4,
//   },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.textLight,
//   },
//   itemName: {
//     fontSize: 14,
//     color: COLORS.text,
//     flex: 1,
//   },
//   itemDetail: {
//     fontSize: 14,
//     color: COLORS.textLight,
//   },
//   totalText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     textAlign: "right",
//     marginTop: 8,
//   },
//   confirmButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     borderRadius: 8,
//     alignItems: "center",
//     margin: 16,
//   },
//   confirmButtonText: {
//     fontSize: 18,
//     color: COLORS.white,
//     fontWeight: "bold",
//   },
//   dateText: {
//     textAlign: "center",
//     fontSize: 12,
//     color: COLORS.textLight,
//     padding: 16,
//     backgroundColor: COLORS.white,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 8,
//     fontSize: 16,
//     color: COLORS.text,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: COLORS.error,
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   retryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: COLORS.white,
//     fontWeight: "bold",
//   },
// });

// export default CreateOrder;