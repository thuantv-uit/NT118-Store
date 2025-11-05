// import { useUser } from "@clerk/clerk-expo";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useState } from "react";
// import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { API_URL } from "../../constants/api";
// import { COLORS } from "../../constants/colors";

// const CreatePayment = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   const { amount, cartIds } = useLocalSearchParams(); // Lấy amount và cartIds từ params
//   const [selectedMethod, setSelectedMethod] = useState(null); // 'cash' hoặc 'bank_transfer'
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleBack = () => {
//     router.back();
//   };

//   const handlePayment = async () => {
//     if (!selectedMethod) {
//       Alert.alert("Lỗi", "Vui lòng chọn phương thức thanh toán.");
//       return;
//     }
//     if (!user?.id) {
//       Alert.alert("Lỗi", "Người dùng chưa đăng nhập.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     try {
//       const paymentDate = new Date().toISOString(); // Timestamp hiện tại
//       const response = await fetch(`${API_URL}/payment`, { // Giả định route POST /payment
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           payment_date: paymentDate,
//           payment_method: selectedMethod,
//           amount: parseFloat(amount), // Chuyển thành number
//           customer_id: user.id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Lỗi: ${response.statusText}`);
//       }

//       const payment = await response.json();
//       Alert.alert("Thành công", `Thanh toán ${payment.amount} đã được tạo!`);
      
//       // Sau khi thành công, navigate đến CreateShipment với payment info và cartIds
//       router.push({
//         pathname: '/CreateShipment',
//         params: { 
//           paymentId: payment.id.toString(), 
//           amount: payment.amount,
//           cartIds: cartIds.toString()
//         }
//       });
//     } catch (err) {
//       setError(err.message);
//       Alert.alert("Lỗi", err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Đang xử lý thanh toán...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Tạo Thanh Toán</Text>
//         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//           <Text style={styles.backButtonText}>← Quay lại</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Nội dung */}
//       <View style={styles.content}>
//         <Text style={styles.amountText}>Số tiền: ${amount}</Text>

//         <Text style={styles.methodTitle}>Chọn phương thức thanh toán:</Text>

//         <TouchableOpacity
//           style={[styles.methodButton, selectedMethod === 'cash' && styles.selectedMethod]}
//           onPress={() => setSelectedMethod('cash')}
//           disabled={isLoading}
//         >
//           <Text style={[styles.methodText, selectedMethod === 'cash' && styles.selectedText]}>Tiền mặt</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.methodButton, selectedMethod === 'bank_transfer' && styles.selectedMethod]}
//           onPress={() => setSelectedMethod('bank_transfer')}
//           disabled={isLoading}
//         >
//           <Text style={[styles.methodText, selectedMethod === 'bank_transfer' && styles.selectedText]}>Chuyển khoản</Text>
//         </TouchableOpacity>

//         {error && <Text style={styles.errorText}>{error}</Text>}

//         <TouchableOpacity style={styles.confirmButton} onPress={handlePayment} disabled={!selectedMethod || isLoading}>
//           <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.dateText}>Ngày thanh toán: {new Date().toLocaleString()}</Text>
//     </View>
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
//   content: {
//     flex: 1,
//     padding: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   amountText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     marginBottom: 32,
//     textAlign: "center",
//   },
//   methodTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.text,
//     marginBottom: 16,
//   },
//   methodButton: {
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLORS.textLight,
//     minWidth: 200,
//     alignItems: "center",
//   },
//   selectedMethod: {
//     borderColor: COLORS.primary,
//     backgroundColor: COLORS.primary,
//   },
//   methodText: {
//     fontSize: 16,
//     color: COLORS.text,
//   },
//   selectedText: {
//     color: COLORS.white,
//   },
//   errorText: {
//     color: COLORS.error,
//     fontSize: 14,
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   confirmButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//     borderRadius: 8,
//     marginTop: 24,
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
// });

// export default CreatePayment;