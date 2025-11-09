import React from 'react';
import SelectCategory from '@/components/patterns/seller/SelectCategory';
import { useRouter } from 'expo-router';

export default function SelectCategoryScreen() {
  const router = useRouter();
    // const [selectedCategory, setSelectedCategory] = useState(null);
// const handleCategorySelect = (cat) => {
//     setSelectedCategory(cat); // ✅ Lưu danh mục đã chọn
//   };

  return (
    <SelectCategory
      onSelect={(cat) => {
        // return selected category name and id to the product create route
        router.replace({ pathname: '/sellerCreateProduct', params: { selectedCategory: cat.name, selectedCategoryId: cat.id } });
      }}
    />
  );
}
