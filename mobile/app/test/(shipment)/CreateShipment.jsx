// import { useUser } from "@clerk/clerk-expo";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useState } from "react";
// import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
// import { API_URL } from "../../constants/api";
// import { COLORS } from "../../constants/colors";

// const CreateShipment = () => {
//   const router = useRouter();
//   const { user } = useUser();
//   const { paymentId, amount, cartIds } = useLocalSearchParams(); // Lấy paymentId, amount và cartIds từ params
//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('');
//   const [country, setCountry] = useState('');
//   const [zipcode, setZipcode] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleBack = () => {
//     router.back();
//   };

//   const handleCreateShipment = async () => {
//     if (!address || !city || !state || !country || !zipcode) {
//       Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin địa chỉ.");
//       return;
//     }
//     if (!user?.id) {
//       Alert.alert("Lỗi", "Người dùng chưa đăng nhập.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     try {
//       const shipmentDate = new Date().toISOString(); // Timestamp hiện tại
//       const response = await fetch(`${API_URL}/shipment`, { // Giả định route POST /shipment
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           shipment_date: shipmentDate,
//           address,
//           city,
//           state,
//           country,
//           zipcode,
//           customer_id: user.id,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Lỗi: ${response.statusText}`);
//       }

//       const shipment = await response.json();
//       Alert.alert("Thành công", `Đơn vận chuyển đã được tạo với ID: ${shipment.id}`);
      
//       // Sau khi thành công, navigate đến CreateOrder với đầy đủ info bao gồm cartIds
//       router.push({
//         pathname: '/CreateOrder',
//         params: { 
//           paymentId: paymentId.toString(), 
//           amount: amount.toString(), 
//           shipmentId: shipment.id.toString(),
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
//         <Text style={styles.loadingText}>Đang tạo đơn vận chuyển...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Tạo Đơn Vận Chuyển</Text>
//         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//           <Text style={styles.backButtonText}>← Quay lại</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Nội dung form */}
//       <View style={styles.content}>
//         <Text style={styles.amountText}>Số tiền: ${amount}</Text>

//         <Text style={styles.sectionTitle}>Thông tin địa chỉ giao hàng:</Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Địa chỉ chi tiết (số nhà, đường...)"
//           value={address}
//           onChangeText={setAddress}
//           multiline
//           numberOfLines={2}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Thành phố"
//           value={city}
//           onChangeText={setCity}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Tỉnh/Bang"
//           value={state}
//           onChangeText={setState}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Quốc gia"
//           value={country}
//           onChangeText={setCountry}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Mã bưu điện"
//           value={zipcode}
//           onChangeText={setZipcode}
//           keyboardType="numeric"
//         />

//         {error && <Text style={styles.errorText}>{error}</Text>}

//         <TouchableOpacity style={styles.confirmButton} onPress={handleCreateShipment} disabled={isLoading}>
//           <Text style={styles.confirmButtonText}>Xác nhận tạo đơn</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.dateText}>Ngày vận chuyển: {new Date().toLocaleString()}</Text>
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
//   },
//   amountText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: COLORS.primary,
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.text,
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   input: {
//     backgroundColor: COLORS.white,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLORS.textLight,
//     fontSize: 16,
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
//     alignItems: "center",
//     marginTop: 16,
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

// export default CreateShipment;