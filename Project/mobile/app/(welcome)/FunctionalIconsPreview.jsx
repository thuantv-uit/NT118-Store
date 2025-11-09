import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LoadingIcon from "../../components/ui/LoadingIcon";
import ButtonCategory from "../../components/ui/ButtonCategory";
import NavigationIcon from "../../components/ui/NavigationIcon";
import CheckboxRadio from "../../components/ui/CheckboxRadio";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import Counter from "../../components/ui/Counter";
import ScrollSlider from "../../components/ui/ScrollSlider";
import NavigationBar from "../../components/ui/NavigationBar";

// Layout và các component seller
// import SellerScreenLayout from "./components/SellerScreenLayout";
import ProductMediaPicker from "@/components/patterns/seller/ProductMediaPicker";
import ProductBasicInfo from "@/components/patterns/seller/ProductBasicInfo";
import ProductAttributes from "@/components/patterns/seller/ProductAttributes";
import ProductVariationManager from "@/components/patterns/seller/ProductVariationManager";
import ProductPricingSection from "@/components/patterns/seller/ProductPricingSection";
import ProductShippingSection from "@/components/patterns/seller/ProductShippingSection";
import ProductAdditionalSettings from "@/components/patterns/seller/ProductAdditionalSettings";
import ProductActionButtons from "@/components/patterns/seller/ProductActionButtons";


export default function FunctionalIconsPreview() {
  console.log({
  LoadingIcon,
  ButtonCategory,
  NavigationIcon,
  CheckboxRadio,
  ToggleSwitch,
  Counter,
  ScrollSlider,
  NavigationBar,
  // SellerScreenLayout,
  ProductMediaPicker,
  ProductBasicInfo,
  ProductAttributes,
  ProductVariationManager,
  ProductPricingSection,
  ProductShippingSection,
  ProductAdditionalSettings,
  ProductActionButtons,

});

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>1. Functional Icons</Text> */}

      {/* <LoadingIcon status="loading" /> */}
      {/* <ButtonCategory label="Men" /> */}
      {/* <NavigationIcon icon="home" variant="on" /> */}
      {/* <CheckboxRadio type="checkbox" /> */}
      {/* <NavigationBar selected="home" /> */}
      {/* 1️⃣ Ảnh & Video */}
        <ProductMediaPicker />

        {/* 2️⃣ Thông tin cơ bản */}
        <ProductBasicInfo />

        {/* 3️⃣ Thuộc tính sản phẩm */}
        <ProductAttributes />

        {/* 4️⃣ Phân loại hàng */}
        <ProductVariationManager />

        {/* 5️⃣ Giá & kho */}
        <ProductPricingSection />



      {/* <ToggleSwitch /> */}
      {/* <Counter /> */}
      {/* <ScrollSlider /> */}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 , top: 50},
  title: { fontSize: 28, fontWeight: "700" },
});
