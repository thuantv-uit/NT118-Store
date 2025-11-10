// Các field tùy theo category (Cổ áo, Chiều dài tay áo, Phong cách, Dịp, v.v.)
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

// attributes: array of either string (label) or {
//   key: string, label: string, type?: 'text'|'number'|'select', options?: string[]
// }
// props:
// - attributes: see above (optional)
// - values: { [key]: value } optional initial values
// - onChange: function(updatedValues) called on each change
export default function ProductAttributes({ attributes: attrsProp, values = {}, onChange }) {
  const defaultAttrs = [
    { key: 'storage', label: 'Kho' },
    { key: 'type', label: 'Loại' },
    { key: 'material', label: 'Chất liệu' },
    { key: 'pattern', label: 'Mẫu' },
    { key: 'style', label: 'Phong cách' },
    { key: 'occasion', label: 'Dịp' },
    { key: 'ship_from', label: 'Gửi từ' },
    { key: 'origin', label: 'Xuất xứ' }
  ];

  const attributes = (attrsProp && attrsProp.length) ? attrsProp.map((a) => {
    if (typeof a === 'string') return { key: a.toLowerCase().replace(/\s+/g, '_'), label: a };
    return a;
  }) : defaultAttrs;

  const [localValues, setLocalValues] = useState(() => {
    const init = {};
    attributes.forEach((a) => {
      init[a.key] = values[a.key] ?? '';
    });
    return init;
  });

  useEffect(() => {
    // propagate initial values if parent provided updated values later
    const merged = { ...localValues };
    let changed = false;
    attributes.forEach((a) => {
      if (values && values[a.key] !== undefined && values[a.key] !== localValues[a.key]) {
        merged[a.key] = values[a.key];
        changed = true;
      }
    });
    if (changed) setLocalValues(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  function handleChange(key, newVal) {
    const updated = { ...localValues, [key]: newVal };
    setLocalValues(updated);
    if (typeof onChange === 'function') onChange(updated);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Chi tiết Sản phẩm</Text>
      {attributes.map((attr) => (
        <View key={attr.key} style={styles.item}>
          {/* <Ionicons name="chatbox-outline" size={18} color="#CC7861" /> */}
          <Text style={styles.attrText}>{attr.label}</Text>

          {attr.type === 'select' && Array.isArray(attr.options) ? (
            <Picker
              selectedValue={localValues[attr.key]}
              style={styles.picker}
              onValueChange={(val) => handleChange(attr.key, val)}
            >
              <Picker.Item label={`Chọn ${attr.label}`} value="" />
              {attr.options.map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          ) : (
            <TextInput
              style={styles.input}
              placeholder={`Nhập ${attr.label.toLowerCase()}`}
              value={String(localValues[attr.key] ?? '')}
              onChangeText={(text) => handleChange(attr.key, text)}
              keyboardType={attr.type === 'number' ? 'numeric' : 'default'}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  sectionTitle: { 
    ...typography.title2,
    fontSize: 20,
    color: colors.color1, 

  },
  item: {
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 10,
    borderBottomWidth: 1, 
    borderColor: "#f2f2f2"
  },
  attrText: { 
    marginLeft: 8, 
    color: colors.black, 
    ...typography.headline1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    // borderWidth: 1,
    // borderColor: "rgba(204,120,97,0.3)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...typography.body1,
    color: colors.dark_mode_icon_square,
    fontSize: 15,
  },
  picker: {
    flex: 1,
    marginLeft: 12,
  },

});
