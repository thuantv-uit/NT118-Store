// import { useUser } from "@clerk/clerk-expo";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from "react-native";
// import { styles } from "../../assets/styles/create.styles";
// import { API_URL } from "../../constants/api";
// import { COLORS } from "../../constants/colors";

// // Hardcoded categories - fixed data
// const CATEGORIES = [
//   { id: 1, name: "Điện thoại" },
//   { id: 2, name: "Laptop" },
//   { id: 3, name: "Tai nghe" },
//   { id: 4, name: "Khác" },
// ];

// const CreateProductScreen = () => {
//   const router = useRouter();
//   const { user } = useUser();

//   const [sku, setSku] = useState("");
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");
//   const [selectedCategoryName, setSelectedCategoryName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleCreate = async () => {
//     // Validations
//     if (!sku.trim()) return Alert.alert("Error", "Please enter SKU");
//     if (!name.trim()) return Alert.alert("Error", "Please enter product name");
//     if (!description.trim()) return Alert.alert("Error", "Please enter description");
//     if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
//       return Alert.alert("Error", "Please enter a valid price");
//     }
//     if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
//       return Alert.alert("Error", "Please enter a valid stock quantity");
//     }
//     if (!selectedCategoryName) {
//       return Alert.alert("Error", "Please select a category");
//     }

//     setIsLoading(true);
//     try {
//       // Tìm ID từ name đã chọn
//       const selectedCat = CATEGORIES.find(cat => cat.name === selectedCategoryName);
//       if (!selectedCat) {
//         throw new Error("Selected category not found");
//       }
//       const categoryId = selectedCat.id;

//       // Create product với category_id
//       const productResponse = await fetch(`${API_URL}/product`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           SKU: sku.trim(),
//           name: name.trim(),
//           description: description.trim(),
//           price: parseFloat(price),
//           stock: parseInt(stock),
//           category_id: categoryId,
//         }),
//       });

//       if (!productResponse.ok) {
//         const errorData = await productResponse.json();
//         console.log(errorData);
//         throw new Error(errorData.message || "Failed to create product");
//       }

//       Alert.alert("Success", "Product created successfully");
//       router.back();
//     } catch (error) {
//       Alert.alert("Error", error.message || "Failed to create product");
//       console.error("Error creating product:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.text} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>New Product</Text>
//         <TouchableOpacity
//           style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
//           onPress={handleCreate}
//           disabled={isLoading}
//         >
//           <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
//           {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.card}>
//         {/* INPUT CONTAINERS */}
//         <View style={styles.inputContainer}>
//           <Ionicons name="barcode-outline" size={22} color={COLORS.textLight} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="SKU"
//             placeholderTextColor={COLORS.textLight}
//             value={sku}
//             onChangeText={setSku}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Ionicons name="create-outline" size={22} color={COLORS.textLight} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Product Name"
//             placeholderTextColor={COLORS.textLight}
//             value={name}
//             onChangeText={setName}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Ionicons name="document-text-outline" size={22} color={COLORS.textLight} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Description"
//             placeholderTextColor={COLORS.textLight}
//             value={description}
//             onChangeText={setDescription}
//             multiline
//           />
//         </View>

//         <View style={styles.amountContainer}>
//           <Text style={styles.currencySymbol}>$</Text>
//           <TextInput
//             style={styles.amountInput}
//             placeholder="0.00"
//             placeholderTextColor={COLORS.textLight}
//             value={price}
//             onChangeText={setPrice}
//             keyboardType="numeric"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Ionicons name="layers-outline" size={22} color={COLORS.textLight} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Stock"
//             placeholderTextColor={COLORS.textLight}
//             value={stock}
//             onChangeText={setStock}
//             keyboardType="numeric"
//           />
//         </View>

//         {/* CATEGORY SECTION */}
//         <Text style={styles.sectionTitle}>
//           <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
//         </Text>

//         <View style={styles.categoryGrid}>
//           {CATEGORIES.map((category) => (
//             <TouchableOpacity
//               key={category.id}
//               style={[
//                 styles.categoryButton,
//                 selectedCategoryName === category.name && styles.categoryButtonActive,
//               ]}
//               onPress={() => {
//                 setSelectedCategoryName(category.name); // Chọn bằng name
//               }}
//             >
//               <Ionicons
//                 name="folder-outline" // Generic icon; customize per category if needed
//                 size={20}
//                 color={selectedCategoryName === category.name ? COLORS.white : COLORS.text}
//                 style={styles.categoryIcon}
//               />
//               <Text
//                 style={[
//                   styles.categoryButtonText,
//                   selectedCategoryName === category.name && styles.categoryButtonTextActive,
//                 ]}
//               >
//                 {category.name}
//               </Text>
//             </TouchableOpacity>
//           ))}
//           {/* Bỏ nút + New Category để chỉ chọn hardcoded */}
//         </View>
//       </View>

//       {isLoading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//         </View>
//       )}
//     </View>
//   );
// };

// export default CreateProductScreen;