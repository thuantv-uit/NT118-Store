// NT118-Store/Project/mobile/app/(seller)/sellerCreateProduct.jsx
import React, { useState } from "react";
import { Alert, ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator, Modal } from "react-native";
import SellerScreenLayout from "./components/SellerScreenLayout";

import { useLocalSearchParams } from "expo-router";

// import dùng trong mọi file
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import {theme} from '@/theme/index';
import { wpA, hpA } from "@/utils/scale";

import ProductMediaPicker from "@/components/patterns/seller/ProductMediaPicker";
import ProductBasicInfo from "@/components/patterns/seller/ProductBasicInfo";
import ProductAttributes from "@/components/patterns/seller/ProductAttributes";
import ProductVariationManager from "@/components/patterns/seller/ProductVariationManager";
import ProductPricingSection from "@/components/patterns/seller/ProductPricingSection";
import ProductShippingSection from "@/components/patterns/seller/ProductShippingSection";
import ProductAdditionalSettings from "@/components/patterns/seller/ProductAdditionalSettings";
import ProductActionButtons from "@/components/patterns/seller/ProductActionButtons";
import { API_URL } from '@/constants/api';
import { useRouter } from "expo-router";
import { saveDraftSync as saveTempDraftSync, getDraft as getTempDraft, clearDraftSync as clearTempDraftSync } from '@/utils/tempDraft';
import SelectCategory from '@/components/patterns/seller/SelectCategory';


export default function SellerCreateProduct() {
    const { selectedCategory, selectedCategoryId } = useLocalSearchParams();
  const router = useRouter();
    // const [selectedCategory, setSelectedCategory] = useState(null);


  // Gom dữ liệu form tổng
  const [productData, setProductData] = useState({
    name: "",
    category: selectedCategory || "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    weight: "",
    dimensions: "",
    variations: [],
  attributes: {},
    images: [],
    shipping: {
      method: "",
      cost: "",
      time: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // 0..100
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // cập nhật dữ liệu con
  const updateField = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  // Restore temporary draft when returning from select-category, and merge selectedCategory params
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const d = await getTempDraft();
        if (!mounted) return;
        if (d) {
          // restore previously saved draft, but allow URL params to override category
          setProductData((prev) => ({ ...d, ...prev }));
          if (selectedCategory) updateField('category', selectedCategory);
          if (selectedCategoryId) updateField('category_id', selectedCategoryId);
          clearTempDraftSync();
        } else {
          if (selectedCategory) updateField('category', selectedCategory);
          if (selectedCategoryId) updateField('category_id', selectedCategoryId);
        }
      } catch (e) {
        console.warn('[sellerCreateProduct] restore draft failed', e && e.message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedCategory, selectedCategoryId]);
  // xử lý chọn danh mục
  const handleSelectCategory = (cat) => {
    updateField("category", cat.name);
    updateField("category_id", cat.id);
  };
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat); // ✅ Lưu danh mục đã chọn
  };


  // gửi dữ liệu lên backend
  // Use XMLHttpRequest to get upload progress events
  async function uploadFilesToServer(files, onProgress = () => {}) {
    if (!files || files.length === 0) return [];
    const form = new FormData();
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const uri = f.uri || f.url;
      if (!uri) continue;
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1] : 'jpg';
      const mimeType = (f.type && f.type.includes('/')) ? f.type : `image/${ext}`;
      form.append('files', { uri, name: filename, type: mimeType });
    }

    return await new Promise((resolve, reject) => {
      try {
        setUploading(true);
        setUploadProgress(0);
        const xhr = new XMLHttpRequest();
        console.log('[uploadFilesToServer] uploading', form.getLength ? 'form-with-length' : 'form-no-length', files.length);
        for (let i = 0; i < files.length; i++) console.log('[uploadFilesToServer] file', i, files[i].uri, files[i].type);
        xhr.open('POST', `${API_URL}/uploads`);
        xhr.onload = () => {
          setUploading(false);
          setUploadProgress(0);
          try {
            console.log('[uploadFilesToServer] xhr status', xhr.status);
            console.log('[uploadFilesToServer] xhr response', xhr.responseText);
            const data = JSON.parse(xhr.responseText || '{}');
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(data.files || []);
            } else {
              reject(new Error(data.message || `Upload failed (${xhr.status})`));
            }
          } catch (e) {
            reject(e);
          }
        };
        xhr.onerror = (e) => {
          console.warn('[uploadFilesToServer] xhr.onerror', e, '- attempting fetch fallback');
          // Fallback to fetch if XHR fails (some environments don't support XHR FormData well)
          (async () => {
            try {
              const res = await fetch(`${API_URL}/uploads`, { method: 'POST', body: form });
              const text = await res.text();
              console.log('[uploadFilesToServer] fetch fallback status', res.status, 'resp', text);
              const data = text ? JSON.parse(text) : {};
              if (res.ok) {
                // ensure UI updates
                setUploadProgress(100);
                setUploading(false);
                resolve(data.files || []);
              } else {
                setUploadProgress(0);
                setUploading(false);
                reject(new Error(data.message || `Upload failed (fetch fallback ${res.status})`));
              }
            } catch (fe) {
              console.warn('[uploadFilesToServer] fetch fallback failed', fe);
              setUploadProgress(0);
              setUploading(false);
              reject(new Error('Network error during upload'));
            }
          })();
        };
        if (xhr.upload && typeof xhr.upload.addEventListener === 'function') {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                let pct = Math.round((event.loaded / event.total) * 100);
                // clamp to 0..100 to avoid odd >100 values from some environments
                pct = Math.max(0, Math.min(100, pct));
                setUploadProgress(pct);
                onProgress(pct);
              }
          };
        }
        xhr.send(form);
      } catch (err) {
        setUploading(false);
        setUploadProgress(0);
        reject(err);
      }
    });
  }

  const handleSubmit = async () => {
    if (!productData.name || !productData.price) {
      Alert.alert("Thiếu thông tin", "Tên và giá sản phẩm là bắt buộc.");
      return;
    }

    // Ensure category is chosen for publishing
    if (!productData.category_id) {
      return Alert.alert("Thiếu danh mục", "Vui lòng chọn danh mục sản phẩm trước khi đăng.");
    }

    // Auto-generate SKU if missing to satisfy backend unique constraint
    if (!productData.sku || productData.sku.trim() === "") {
      const gen = `SKU-${Date.now()}`;
      updateField("sku", gen);
    }

    setLoading(true);
    try {
      // upload local files first (only those that are not already remote URLs)
      const imgs = productData.images || [];
      const toUpload = imgs.filter((f) => f && f.uri && !String(f.uri).startsWith('http'));
      const already = imgs.filter((f) => f && f.uri && String(f.uri).startsWith('http'));
      let uploaded = [];
      if (toUpload.length) {
        uploaded = await uploadFilesToServer(toUpload);
      }

      // combine uploaded results and already existing urls
      const imageUrls = [
        ...already.map((a) => (typeof a === 'string' ? a : a.uri)),
        ...uploaded.map((u) => ({ url: u.url, public_id: u.public_id, resource_type: u.resource_type })),
      ];

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SKU: productData.sku || `SKU-${Date.now()}`,
          name: productData.name,
          description: productData.description || 'Sản phẩm mới',
          price: Number(productData.price),
          category_id: Number(productData.category_id),
          stock: Number(productData.stock || 0),
          // send attributes collected from ProductAttributes component
          attributes: productData.attributes,
          imageUrls,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể thêm sản phẩm.');

      Alert.alert('Thành công', 'Sản phẩm đã được tạo!');
      setProductData({
        name: '',
        category_id: 1,
        sku: '',
        description: '',
        price: '',
        stock: '',
        weight: '',
        dimensions: '',
        variations: [],
        attributes: {},
        images: [],
        shipping: { method: '', cost: '', time: '' },
      });
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    // Allow saving partial product as draft; we still send the same payload but mark draft=true
    setLoading(true);
    try {
      // upload files if any
      const imgs = productData.images || [];
      const toUpload = imgs.filter((f) => f && f.uri && !String(f.uri).startsWith('http'));
      const already = imgs.filter((f) => f && f.uri && String(f.uri).startsWith('http'));
      let uploaded = [];
      if (toUpload.length) uploaded = await uploadFilesToServer(toUpload);

      const imageUrls = [
        ...already.map((a) => (typeof a === 'string' ? a : a.uri)),
        ...uploaded.map((u) => ({ url: u.url, public_id: u.public_id, resource_type: u.resource_type })),
      ];

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SKU: productData.sku || '',
          name: productData.name || 'Untitled (draft)',
          description: productData.description || '',
          price: Number(productData.price) || 0,
          category_id: Number(productData.category_id) || 1,
          stock: Number(productData.stock || 0),
          attributes: productData.attributes,
          draft: true,
          imageUrls,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể lưu nháp.');

      Alert.alert('Đã lưu', 'Bản nháp đã được lưu.');
    } catch (err) {
      Alert.alert('Lỗi', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    //  <View style={styles.container}>
    //             {/* nút Back */}
    //             {/* <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
    //         <Ionicons name="arrow-back-outline" size={24} color={theme.colors.textPrimary} />
    //       </TouchableOpacity> */}
    
    //             <Text style={styles.title}>Thêm Sản Phẩm</Text>
    <SellerScreenLayout title="Tạo sản phẩm mới" subtitle="Điền thông tin chi tiết để đăng bán" style={{ marginTop: wpA(16) }}>
      {/* <LinearGradient colors={["#FFE5EA", "#FAD4D6"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.uploadCard}>  </LinearGradient> */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: hpA(20), marginTop: hpA(0) }}>
        <ProductMediaPicker
          images={productData.images}
          onChange={(imgs) => updateField("images", imgs)}
        />
        <ProductBasicInfo
          name={productData.name}
          description={productData.description}
          brand={productData.brand}
          category={productData.category}
          onChange={updateField}
          // onSelectCategory={(catName) => updateField("category", catName)}
        />
        {/* Chọn danh mục */}
        <View style={{ marginVertical: hpA(12) }}>
          <Text style={{ color: colors.color1,...typography.title2,fontSize: 20,marginBottom: hpA(8) }}>
            Danh mục sản phẩm *
          </Text>
          <Pressable
            style={{ paddingVertical: 12, paddingHorizontal: 10, backgroundColor: "#fff", borderRadius: 8 }}
            onPress={() => {
              // open inline modal selector instead of navigating away (preserve form state)
              setShowCategoryModal(true);
            }}
          >
            <Text>{productData.category || "Chọn danh mục"}</Text>
          </Pressable>
          <Modal visible={showCategoryModal} animationType="slide">
            <SelectCategory
              onSelect={(cat) => {
                updateField('category', cat.name);
                updateField('category_id', cat.id);
                setShowCategoryModal(false);
              }}
            />
          </Modal>
          {/* {productData.category ? (
            <Text style={{ color: colors.hmee03, marginTop: hpA(4) }}>
              Đã chọn: {productData.category}
            </Text>
          ) : null} */}
        </View>
        <ProductPricingSection
          price={productData.price}
          stock={productData.stock}
          onChange={updateField}
        />
        <ProductVariationManager
          variations={productData.variations}
          onChange={(v) => updateField("variations", v)}
        />
        <ProductAttributes
          values={productData.attributes}
          onChange={(attrs) => updateField("attributes", attrs)}
        />
        <ProductShippingSection
          shipping={productData.shipping}
          onChange={(ship) => updateField("shipping", ship)}
        />
        <ProductAdditionalSettings
          weight={productData.weight}
          dimensions={productData.dimensions}
          onChange={updateField}
        />
        <View style={{ height: hpA(16) }} />
  <ProductActionButtons onSubmit={handleSubmit} onSaveDraft={handleSaveDraft} loading={loading} />
        {uploading ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary || '#000'} />
              <Text style={{ marginTop: 12, fontWeight: '600' }}>{`Đang tải lên ${uploadProgress}%`}</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SellerScreenLayout> 
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: colors['#FFF4F1'],
        alignItems: "center",
        // paddingTop: hpA(60),
    },
   
    title: {
        ...theme.typography.title1,
        color: "#C97C68",
        marginTop: hpA(24),
        // marginBottom: hpA(24),
    },
});