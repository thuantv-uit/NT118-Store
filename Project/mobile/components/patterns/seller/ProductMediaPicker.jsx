//Upload ảnh bìa + 8 ảnh/1 video phụ
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Component now accepts props: images (array) and onChange callback
export default function ProductMediaPicker({ images = [], onChange = () => {} }) {
  const [media, setMedia] = useState(() => (images || []).map((u) => ({ id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, uri: u.uri || u, type: u.type || 'image' })));
  const [ImagePicker, setImagePicker] = useState(null);

  // load expo-image-picker dynamically
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('expo-image-picker');
        if (mounted) setImagePicker(mod);
      } catch (err) {
        console.warn('expo-image-picker not available:', err?.message || err);
        if (mounted) setImagePicker(null);
      }
    })();
    return () => (mounted = false);
  }, []);

  // request permission when ImagePicker module becomes available
  useEffect(() => {
    if (!ImagePicker) return;
    (async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Quyền truy cập ảnh bị từ chối', 'Vui lòng cấp quyền để thêm hình ảnh hoặc video.');
        }
      } catch (err) {
        console.warn('requestMediaLibraryPermissionsAsync failed:', err);
      }
    })();
  }, [ImagePicker]);

  // sync incoming prop -> local
  useEffect(() => {
    const normalized = (images || []).map((u) => {
      if (typeof u === 'string') return { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, uri: u, type: 'image' };
      return { id: u.id || `${Date.now()}_${Math.random().toString(36).slice(2)}`, uri: u.uri || u.url, type: u.type || u.resource_type || 'image' };
    });
    setMedia(normalized);
  }, [images]);

  // NOTE: do NOT auto-propagate media -> parent in an effect to avoid
  // update cycles. We'll call `onChange` explicitly whenever we change media below.

  const onPressAdd = async () => {
    try {
      if (!ImagePicker) {
        Alert.alert('Tính năng chưa sẵn sàng', "Chức năng chọn ảnh chưa được cài đặt trong môi trường này.");
        return;
      }

  // Use the new API shape if available
  // NOTE: ImagePicker.MediaTypeOptions is deprecated — use ImagePicker.MediaType or an array of ImagePicker.MediaType
  const mediaTypes = ImagePicker.MediaType ? ImagePicker.MediaType.All : ImagePicker.MediaTypeOptions?.All;
  const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes, allowsEditing: true, quality: 0.8 });

      // Normalize result to assets array (handle different expo-image-picker shapes)
      let assets = [];
      // New API: { canceled: false, assets: [...] }
      if (Array.isArray(result.assets) && result.assets.length) {
        assets = result.assets;
      } else if (result.uri) {
        // Older API: { cancelled: false, uri, type }
        assets = [{ uri: result.uri, type: result.type }];
      }

      if (!assets.length) return; // user cancelled or no assets

      const newPicked = [];
      for (const a of assets) {
        const uri = a.uri || a.uri || a.url;
        const type = a.type || a.mediaType || a.resource_type || 'image';

        if (!uri) continue;

        // dedupe by uri
        if (media.some((m) => m.uri === uri)) {
          Alert.alert('Đã tồn tại', 'Ảnh/video này đã được thêm trước đó.');
          continue;
        }

        const picked = { id: `${Date.now()}_${Math.random().toString(36).slice(2)}`, uri, type };
        newPicked.push(picked);
      }
      if (newPicked.length) {
        // if any picked were videos, we respect the video-only rule: use the first video only
        const hasVideo = newPicked.some((p) => p.type === 'video') || media.some((m) => m.type === 'video');
        if (hasVideo) {
          const firstVideo = [...media, ...newPicked].find((m) => m.type === 'video');
          const next = firstVideo ? [firstVideo] : [];
          setMedia(next);
          onChange(next.map((m) => ({ id: m.id, uri: m.uri, type: m.type })));
          return;
        }

        const next = [...media, ...newPicked].slice(0, 9);
        setMedia(next);
        onChange(next.map((m) => ({ id: m.id, uri: m.uri, type: m.type })));
      }
    } catch (err) {
      console.warn('pick media error', err);
    }
  };

  const removeAt = (id) => {
    Alert.alert('Xóa', 'Bạn có muốn xóa ảnh này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          const next = media.filter((m) => m.id !== id);
          setMedia(next);
          onChange(next.map((m) => ({ id: m.id, uri: m.uri, type: m.type })));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm hình ảnh & video sản phẩm</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Pressable style={styles.addBox} onPress={onPressAdd}>
          <Ionicons name="add-outline" size={32} color="#BE123C" />
        </Pressable>

        {media.map((m) => (
          <Pressable key={m.id} style={styles.thumbShell} onLongPress={() => removeAt(m.id)}>
            <Image source={{ uri: m.uri }} style={styles.thumb} />
            {m.type === 'video' && (
              <View style={styles.videoBadge}>
                <Ionicons name="play" size={12} color="#fff" />
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.hint}>Tối đa 9 ảnh hoặc 1 video • Giữ lâu trên ảnh để xóa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  title: { fontWeight: "700", fontSize: 16, color: "#BE123C", marginBottom: 8 },
  addBox: {
    width: 100, height: 100, borderRadius: 10, borderWidth: 1,
    borderColor: "#CC7861", justifyContent: "center", alignItems: "center",
    backgroundColor: "#FFF"
  },
  scrollContent: { alignItems: "center" , paddingRight: 8},
  thumbShell: { marginLeft: 8, width: 100, height: 100, borderRadius: 10, overflow: "hidden" },
  thumb: { width: 100, height: 100, resizeMode: "cover" },
  videoBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 4,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: { color: "#9CA3AF", fontSize: 12, marginTop: 6 }
});
