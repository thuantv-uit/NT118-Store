// import { useUser } from "@clerk/clerk-expo";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useState } from "react";
// import {
//     Alert,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { API_URL } from "../../constants/api";
// import { COLORS } from "../../constants/colors";

// const CreateCartScreen = () => {
//   const router = useRouter();
//   const { productId } = useLocalSearchParams(); // Lấy productId từ params
//   const { user } = useUser(); // Lấy user từ Clerk
//   const [quantity, setQuantity] = useState("1"); // State cho số lượng (default 1)
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleCreateCart = async () => {
//     if (!user?.id) {
//       Alert.alert("Error", "User not authenticated. Please sign in.");
//       return;
//     }
//     // comment to fix
//     // console.log('userId: ', user.id);
//     if (!productId) {
//       Alert.alert("Error", "Product ID is required.");
//       return;
//     }
//     const qty = parseInt(quantity);
//     if (isNaN(qty) || qty <= 0) {
//       Alert.alert("Error", "Please enter a valid quantity (positive number).");
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       // Giả sử API POST để tạo cart item: { customer_id, product_id, quantity }
//       const response = await fetch(`${API_URL}/cart`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           customer_id: user.id, // Cập nhật từ user_id thành customer_id
//           product_id: productId,
//           quantity: qty,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to create cart item");
//       }

//       const result = await response.json();
//     //   console.log("Cart item created:", result);
//       Alert.alert("Success", "Item added to cart successfully!");
//       router.back(); // Quay lại ProductDetail hoặc Products
//     } catch (err) {
//     //   console.error("Error creating cart:", err);
//       Alert.alert("Error", err.message || "Failed to add to cart.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBack = () => {
//     router.back();
//   };

//   if (!user) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Please sign in to add to cart.</Text>
//         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//           <Text style={styles.backButtonText}>Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Add to Cart</Text>
//         <View style={styles.headerSpacer} />
//       </View>

//       {/* CONTENT */}
//       <View style={styles.content}>
//         <Text style={styles.label}>Quantity</Text>
//         <TextInput
//           style={styles.input}
//           value={quantity}
//           onChangeText={setQuantity}
//           placeholder="Enter quantity"
//           keyboardType="numeric"
//           maxLength={3} // Giới hạn số lượng hợp lý
//         />

//         <TouchableOpacity
//           style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
//           onPress={handleCreateCart}
//           disabled={isSubmitting}
//         >
//           <Text style={styles.submitButtonText}>
//             {isSubmitting ? "Adding..." : "Add to Cart"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = {
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: COLORS.primary,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     flex: 1,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.white,
//     textAlign: "center",
//   },
//   headerSpacer: {
//     width: 24,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//     justifyContent: "center",
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: COLORS.text,
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: COLORS.textLight,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: COLORS.text,
//     backgroundColor: COLORS.white,
//     marginBottom: 20,
//   },
//   submitButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitButtonDisabled: {
//     backgroundColor: COLORS.textLight,
//   },
//   submitButtonText: {
//     fontSize: 16,
//     color: COLORS.white,
//     fontWeight: "bold",
//   },
//   errorText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: COLORS.error,
//     marginTop: 50,
//   },
// };

// export default CreateCartScreen;